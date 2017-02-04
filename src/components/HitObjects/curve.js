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
	static osuLinearBezier(slider_points, length) { // TODO: Make sliderballs easier - parameterize the entire slider
		let segments = Curve.parseLinearBezier(slider_points);
		let str = 'M ' + slider_points[0].join(' ');
		let samplingIncrement = 10 / length;

		segments.forEach((segment) => {
			if (segments.length === 2) { // Linear segment
				str += ' L ' + segment[1].join(' ');
			}
			else {
				let points = [];
				for (let i = 0; i <= 1; i += samplingIncrement) {
					points.push(Curve.bezierPointAt(i, segment));
				}
				points.forEach((point) => {
					str += ' L ' + point.join(' ');
				});
			}
		});
		return str;
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
	static osuPassthrough(slider_points, length) {
		return '';
	}
}
