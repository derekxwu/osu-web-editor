/**
  * curve.js
  *
  * Handling curves for sliders - Bezier & Circles
  * TODO: Minimize the number of points sampled - more for sharper curves, fewer for smoother.
  */

export default class Curve {
	/***
	 *	Sample points from a Bezier curve to approximate it with line segments.
	 * 	Input: A series of coordinates designating control points and end points of curves.
	 * 		Curve endpoints are denoted with repeated coordinates.
	 * 		Ex: [[0, 0], [50, 50], [25, 25], [25, 25], [10, 10]]
	 *   	A Bezier curve starting at 0,0 and ending at 25,25 with control point 50,50; joined with
	 *    	a straight line from 25,25 to 10,10.
	 *  Return: An SVG-compatible path approximating the given curve
	 *  Ex use: <path d={sampleBezier(points)}/>
	 */
	static osuLinearBezier(slider_points, length, repeats) { // TODO: Make sliderballs easier - parameterize the entire slider
		let segments = Curve.parseLinearBezier(slider_points);
		let dStr = 'M ' + slider_points[0].join(' ');
		let samplingIncrement = 10 / length;

		segments.forEach((segment) => {
			if (segment.length === 2) { // Linear segment
				dStr += ' L ' + segment[1].join(' ');
			}
			else {
				let points = [];
				for (let i = 0; i <= 1; i += samplingIncrement) {
					points.push(Curve.bezierPointAt(i, segment));
				}
				points.forEach((point) => {
					dStr += ' L ' + point.join(' ');
				});
			}
		});
		return dStr;
	}

	/***
	 *	Split slider into segments on red points
	 */
	static parseLinearBezier(slider_points) {
		// is it faster to iterate over this and push to currentSegment or to save indices and slice
		let segments = [];
		let redPointIndices = [];
		let lastPoint = slider_points[0];
		for (let i = 1; i < slider_points.length; i++) {
			if (slider_points[i][0] === lastPoint[0] && slider_points[i][1] === lastPoint[1]) {
				redPointIndices.push(i);
			}
			else {
				lastPoint = slider_points[i];
			}
		}
		if (redPointIndices[redPointIndices.length - 1] === slider_points.length - 1) { redPointIndices.pop(); } // Ending on a red point
		for (let i = 0; i <= redPointIndices.length; i++) {
			// TODO: This is a mega-hack
			// MDN suggests that using undefined as an arg may be defined behavior
			segments.push(slider_points.slice(redPointIndices[i - 1], redPointIndices[i]));
		}
		return segments;
	}

	// Adapted from http://jsbin.com/pesutibefu/edit?html,js,output
	static bezierPointAt(t, slider_points) {
		if (slider_points.length === 1) { return slider_points[0]; }
		let newpoints = [];
		for (let i = 0, j = 1; j < slider_points.length; i++, j++) {
			newpoints[i] = Curve.linearInterpolate2d(t, slider_points[i], slider_points[j]);
		}
		return Curve.bezierPointAt(t, newpoints);
	}

	/***
	 * Linear interpolation in 2D - for points in the form of [x, y]
	 */
	static linearInterpolate2d(ratio, start, end) {
		return [Curve.linearInterpolate(ratio, start[0], end[0]), Curve.linearInterpolate(ratio, start[1], end[1])];
	}

	static linearInterpolate(ratio, start, end) {
		return ((1 - ratio) * start) + (ratio * end);
	}

	/***
	 *	Sample points from the circle defined by the three given points.
	 *	Input: 3 points, start, middle, end
	 *		Ex: [[50,50], [55,50], [70,70]]
	 *	Return: SVG-compatible path approximating arc on the circle from start to end including middle.
	 *		Ex use: <path d={sampleCircleFromPoints(points)}/>
	 */
	static osuPassthrough(slider_points, length, repeats) { // TODO: be a better person and have circle sliders remember their centers
		// TODO: make a getpoint for sliderball
		let midpointA = Curve.midpoint(slider_points[0], slider_points[1]);
		let midpointB = Curve.midpoint(slider_points[1], slider_points[2]);
		let vectorTowardCenterA = [slider_points[0][1] - midpointA[1], midpointA[0] - slider_points[0][0]];
		let vectorTowardCenterB = [slider_points[1][1] -  midpointB[1], midpointB[0]  - slider_points[1][0]];
		let centerPoint = Curve.parametricIntersection(midpointA, vectorTowardCenterA, midpointB, vectorTowardCenterB);

		let angleStartPoint = [slider_points[0][0] - centerPoint[0], slider_points[0][1] - centerPoint[1]];
		let angleMidPoint = [slider_points[1][0] - centerPoint[0], slider_points[1][1] - centerPoint[1]];
		let angleEndPoint = [slider_points[2][0] - centerPoint[0], slider_points[2][1] - centerPoint[1]];
		let radius = Math.sqrt(angleStartPoint[0] * angleStartPoint[0] + angleStartPoint[1] * angleStartPoint[1]);

		let angleStart = Math.atan2(angleStartPoint[1], angleStartPoint[0]);
		let angleMid = Math.atan2(angleMidPoint[1], angleMidPoint[0]);
		let angleEnd = Math.atan2(angleEndPoint[1], angleEndPoint[0]);

		// In case the arc goes over the 0/2pi point and that messes up the start/mid/end ordering
		if (!(angleStart > angleMid && angleMid > angleEnd) && !(angleStart < angleMid && angleMid < angleEnd)) {
			if (angleStart > angleEnd) {
				if (angleStart > angleMid) {
					angleStart -= 2 * Math.PI;
				}
				else {
					angleEnd += 2 * Math.PI;
				}
			}
			else {
				if (angleStart > angleMid) {
					angleEnd -= 2 * Math.PI;
				}
				else {
					angleStart += 2 * Math.PI;
				}
			}
		}

		// We draw an arc of given length, from starting point, along arc defined by three points
		// Not necessarily the same as the arc defined by three points because slider length snaps to beats
		let arcLength = length / radius;
		if (angleStart > angleEnd) { arcLength = -arcLength; }

		let dStr = 'M ' + slider_points[0].join(' ');
		let points = [];
		for (let i = 0; i <= 1; i += 0.05) {
			points.push([centerPoint[0] + radius * Math.cos(angleStart + i*arcLength), centerPoint[1] + radius * Math.sin(angleStart + i*arcLength)]);
		}
		points.forEach((point) => {
			dStr += ' L ' + point.join(' ');
		});
		return dStr;
	}

	static midpoint(pointA, pointB) {
		return [(pointA[0] + pointB[0])/2, (pointA[1] + pointB[1])/2];
	}

	static parametricIntersection(aStart, aVector, bStart, bVector) {
		// See the math: http://gamedev.stackexchange.com/questions/44720/line-intersection-from-parametric-equation
		let someMagicVariable = (bVector[0] * aVector[1]) - (bVector[1] * aVector[0]);
		let bIntersectParam = ((bStart[1] - aStart[1]) * aVector[0] + (aStart[0] - bStart[0]) * aVector[1]) / someMagicVariable;
		return [bStart[0] + bIntersectParam * bVector[0], bStart[1] + bIntersectParam * bVector[1]];
	}
}
