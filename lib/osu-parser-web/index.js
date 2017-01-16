'use strict';

var slidercalc = require('./lib/slidercalc.js');

function beatmapParser() {

  const sectionRegex = /^\[([^\]]+)\]$/;
  const keyValuePairRegex = /^([^:\s]+)\s*:\s*(.+)$/;
  const curveTypes = {
    C: 'catmull',
    B: 'bezier',
    L: 'linear',
    P: 'pass-through'
  };

  var beatmap = {
    nbCircles: 0,
    nbSliders: 0,
    nbSpinners: 0,
    timingPoints: [],
    breakTimes: [],
    hitObjects: []
  };

  var osuSection;
  var bpmMin;
  var bpmMax;
  var members;

  var timingLines = [];
  var objectLines = [];
  var eventsLines = [];

  /**
   * Get the timing point affecting a specific offset
   * @param  {Integer} offset
   * @return {Object} timingPoint
   */
  const getTimingPoint = (offset) => {
    for (var i = beatmap.timingPoints.length - 1; i >= 0; i--) {
      if (beatmap.timingPoints[i].offset <= offset) { return beatmap.timingPoints[i]; }
    }
    return beatmap.timingPoints[0];
  };

  /**
   * Parse additions member
   * @param  {String} str         additions member (sample:add:customSampleIndex:Volume:hitsound)
   * @return {Object} additions   a list of additions
   */
  const parseAdditions = (str) => {
    if (!str) return {};

    var additions = {};
    var adds = str.split(':');

    const sampleTypes = ['', 'normal', 'soft', 'drum'];

    if (adds[0] && adds[0] !== '0')
      additions.sample = sampleTypes[+adds[0]];

    if (adds[1] && adds[1] !== '0')
      additions.additionalSample = sampleTypes[+adds[1]];

    if (adds[2] && adds[2] !== '0') { additions.customSampleIndex = parseInt(adds[2]); }
    if (adds[3] && adds[3] !== '0') { additions.hitsoundVolume = parseInt(adds[3]); }
    if (adds[4])                    { additions.hitsound = adds[4]; }

    return additions;
  };

  /**
   * Parse a timing line
   * @param  {String} line
   */
  const parseTimingPoint = (line) => {
    members = line.split(',');

    var timingPoint = {
      offset:            parseInt(members[0]),
      beatLength:        parseFloat(members[1]),
      velocity:          1,
      timingSignature:   parseInt(members[2]),
      sampleSetId:       parseInt(members[3]),
      customSampleIndex: parseInt(members[4]),
      sampleVolume:      parseInt(members[5]),
      timingChange:      (members[6] == 1),
      kiaiTimeActive:    (members[7] == 1)
    };

    if (!isNaN(timingPoint.beatLength) && timingPoint.beatLength !== 0) {
      if (timingPoint.beatLength > 0) {
        // If positive, beatLength is the length of a beat in milliseconds
        var bpm = Math.round(60000 / timingPoint.beatLength);
        beatmap.bpmMin = beatmap.bpmMin ? Math.min(beatmap.bpmMin, bpm) : bpm;
        beatmap.bpmMax = beatmap.bpmMax ? Math.max(beatmap.bpmMax, bpm) : bpm;
        timingPoint.bpm = bpm;
      } else {
        // If negative, beatLength is a velocity factor
        timingPoint.velocity = Math.abs(100 / timingPoint.beatLength);
      }
    }

    beatmap.timingPoints.push(timingPoint);
  };

  /**
   * Parse an object line
   * @param  {String} line
   */
  const parseHitObject = (line) => {
    members = line.split(',');

    var soundType = members[4];
    var objectType = members[3];

    var hitObject = {
      startTime:  parseInt(members[2]),
      newCombo:   !!(objectType & 4),
      soundTypes: [],
      position: [
        parseInt(members[0]),
        parseInt(members[1])
      ]
    };

    /**
     * sound type is a bitwise flag enum
     * 0 : normal
     * 2 : whistle
     * 4 : finish
     * 8 : clap
     */
    if (soundType & 2) { hitObject.soundTypes.push('whistle'); }
    if (soundType & 4) { hitObject.soundTypes.push('finish'); }
    if (soundType & 8) { hitObject.soundTypes.push('clap'); }
    if (hitObject.soundTypes.length === 0) { hitObject.soundTypes.push('normal'); }

    /**
     * object type is a bitwise flag enum
     * 1: circle
     * 2: slider
     * 8: spinner
     */
    if (objectType & 1) {
      // Circle
      beatmap.nbCircles++;
      hitObject.objectName = 'circle';
      hitObject.additions = parseAdditions(members[5]);
    } else if (objectType & 8) {
      // Spinner
      beatmap.nbSpinners++;
      hitObject.objectName = 'spinner';
      hitObject.endTime = parseInt(members[5]);
      hitObject.additions = parseAdditions(members[6]);
    } else if (objectType & 2) {
      // Slider
      beatmap.nbSliders++;
      hitObject.objectName = 'slider';
      hitObject.repeatCount = parseInt(members[6]);
      hitObject.pixelLength = parseInt(members[7]);
      hitObject.additions = parseAdditions(members[10]);
      hitObject.edges = [];
      hitObject.points = [
        [hitObject.position[0], hitObject.position[1]]
      ];

      /**
       * Calculate slider duration
       */
      var timing = getTimingPoint(hitObject.startTime);

      if (timing) {
        var pxPerBeat = beatmap.SliderMultiplier * 100 * timing.velocity;
        var beatsNumber = (hitObject.pixelLength * hitObject.repeatCount) / pxPerBeat;
        hitObject.duration = Math.ceil(beatsNumber * timing.beatLength);
        hitObject.endTime = hitObject.startTime + hitObject.duration;
      }
      /**
       * Parse slider points
       */
      var points = (members[5] || '').split('|');
      if (points.length) {
        hitObject.curveType = curveTypes[points[0]] || 'unknown';

        for (var i = 1, l = points.length; i < l; i++) {
          var coordinates = points[i].split(':');
          hitObject.points.push([
            parseInt(coordinates[0]),
            parseInt(coordinates[1])
          ]);
        }
      }

      var edgeSounds = [];
      var edgeAdditions = [];
      if (members[8]) { edgeSounds = members[8].split('|'); }
      if (members[9]) { edgeAdditions = members[9].split('|'); }

      /**
       * Get soundTypes and additions for each slider edge
       */
      for (var j = 0, lgt = hitObject.repeatCount + 1; j < lgt; j++) {
        var edge = {
          soundTypes: [],
          additions: parseAdditions(edgeAdditions[j])
        };

        if (edgeSounds[j]) {
          var sound = edgeSounds[j];
          if (sound & 2) { edge.soundTypes.push('whistle'); }
          if (sound & 4) { edge.soundTypes.push('finish'); }
          if (sound & 8) { edge.soundTypes.push('clap'); }
          if (edge.soundTypes.length === 0) { edge.soundTypes.push('normal'); }
        } else {
          edge.soundTypes.push('normal');
        }

        hitObject.edges.push(edge);
      }

      // get coordinates of the slider endpoint
      var endPoint = slidercalc.getEndPoint(hitObject.curveType, hitObject.pixelLength, hitObject.points);
      if (endPoint && endPoint[0] && endPoint[1]) {
        hitObject.endPosition = [
          Math.round(endPoint[0]),
          Math.round(endPoint[1])
        ];
      } else {
        // If endPosition could not be calculated, approximate it by setting it to the last point
        hitObject.endPosition = hitObject.points[hitObject.points.length - 1];
      }
    } else {
      // Unknown
      hitObject.objectName = 'unknown';
    }

    beatmap.hitObjects.push(hitObject);
  };

  /**
   * Compute the total time and the draining time of the beatmap
   */
  const computeDuration = (hitObjects, breakTimes) => {
    var firstObject = hitObjects[0];
    var lastObject = hitObjects[hitObjects.length - 1];

    var totalBreakTime = 0;

    breakTimes.forEach(breakTime => {
      totalBreakTime += breakTime.endTime - breakTime.startTime;
    });

    var durations = {
      totalTime: 0,
      drainingTime: 0
    };

    if (firstObject && lastObject) {
      durations.totalTime = Math.floor(lastObject.startTime / 1000);
      durations.drainingTime = Math.floor((lastObject.startTime - firstObject.startTime - totalBreakTime) / 1000);
    }

    return durations;
  };

  /**
   * Browse objects and compute max combo
   */
  const computeMaxCombo = (hitObjects, timingPoints, sliderMultiplier, sliderTickRate) => {
    var maxCombo = 0;
    var currentTiming = timingPoints[0];
    var nextOffset = timingPoints[1] ? timingPoints[1].offset : Infinity;
    var i = 1;

    hitObjects.forEach(hitObject => {
      if (hitObject.startTime >= nextOffset) {
        currentTiming = timingPoints[i++];
        nextOffset = timingPoints[i] ? timingPoints[i].offset : Infinity;
      }

      var osupxPerBeat = sliderMultiplier * 100 * currentTiming.velocity;
      var tickLength = osupxPerBeat / sliderTickRate;

      if (hitObject.objectName == 'slider') {
        var tickPerSide = Math.ceil((Math.floor(hitObject.pixelLength / tickLength * 100) / 100) - 1);
        maxCombo += (hitObject.edges.length - 1) * (tickPerSide + 1);
      }
      
      maxCombo++;
    });

    return maxCombo;
  };

  /**
   * @param {String|Buffer} data
   * @return {Object} beatmap
   */
  const buildBeatmap = (data) => {

    var lines = data.toString().split('\n')
      .map(line => line.trim())
      .filter(line => line);

    var rawSections = {};
    var sectionStart = 0;
    var currentSection = null;

    lines.forEach((line, index) => {
      var section = (line.match(sectionRegex) || [])[1];
      if (!section) {
        var version = line.match(/^osu file format (v\d+)$/);
        if (version)
          beatmap.fileFormat = version[1];
        return;
      }
      
      if (currentSection)
        rawSections[currentSection] = lines.slice(sectionStart, index);
      sectionStart = index + 1;
      currentSection = section;
    });
    // Add the last section
    rawSections[currentSection] = lines.slice(sectionStart);

    // Validate beatmap sections
    const requiredSections = [
      'General', 'Metadata', 'Difficulty',
      'Events', 'TimingPoints', 'HitObjects',
    ];

    var missingSection = null;
    if (missingSection = requiredSections.find(section => !Array.isArray(rawSections[section])))
      throw new Error(`Invalid beatmap: missing section '${missingSection}'!`);

    // Store these for future parsing
    timingLines = rawSections['TimingPoints'];
    objectLines = rawSections['HitObjects'];
    eventsLines = rawSections['Events'];

    const propSections = [
      'General', 'Metadata', 'Difficulty', 'Colours', 'Editor',
    ];

    propSections.forEach(section => {
      if (!Array.isArray(rawSections[section]))
        return;
      rawSections[section].forEach(line => {
        const match = line.match(keyValuePairRegex);
        if (match)
          beatmap[match[1]] = match[2];
      });
    });

    if (beatmap.Tags) {
      beatmap.tagsArray = beatmap.Tags.split(' ');
    }

    eventsLines.forEach(line => {
      var members = line.split(',');

      if (members[0] == '0' && members[1] == '0' && members.length >= 3) {
        var bgName = members[2].trim();

        if (bgName.charAt(0) == '"' && bgName.charAt(bgName.length - 1) == '"') {
          beatmap.bgFilename = bgName.substring(1, bgName.length - 1);
        } else {
          beatmap.bgFilename = bgName;
        }
      } else if (members[0] == '2' && /^\d+$/.test(members[1]) && /^\d+$/.test(members[2])) {
        beatmap.breakTimes.push({
          startTime: parseInt(members[1]),
          endTime: parseInt(members[2])
        });
      }
    });

    beatmap.breakTimes.sort((a, b) => a.startTime - b.startTime);

    timingLines.forEach(parseTimingPoint);
    beatmap.timingPoints.sort((a, b) => a.offset - b.offset);

    var timingPoints = beatmap.timingPoints;

    for (var i = 1; i < timingPoints.length; i++) {
      if (!timingPoints[i]['bpm']) {
        timingPoints[i].beatLength = timingPoints[i - 1].beatLength;
        timingPoints[i].bpm = timingPoints[i - 1].bpm;
      }
    }

    objectLines.forEach(parseHitObject);
    beatmap.hitObjects.sort((a, b) => a.startTime - b.startTime);

    beatmap.maxCombo = computeMaxCombo(
      beatmap.hitObjects,
      beatmap.timingPoints,
      parseFloat(beatmap.SliderMultiplier),
      parseInt(beatmap.SliderTickRate)
    );
    const durations = computeDuration(beatmap.hitObjects, beatmap.breakTimes);
    Object.assign(beatmap, durations);

    return beatmap;
  };

  return {
    buildBeatmap: buildBeatmap
  };
}

/**
 * Parse the content of a .osu file
 * @param  {String|Buffer} content
 * @return {Object} beatmap
 */
exports.parseContent = function (data) {
  var parser = beatmapParser();

  return parser.buildBeatmap(data);
};