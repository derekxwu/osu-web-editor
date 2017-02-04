/**
  * playfieldslider.js
  *
  * Slider meant for going on the playfield
  */

import React from 'react';
import Curve from './curve.js';

export default class PlayfieldSlider extends React.Component {
	render() {
		let d = '';
		switch (this.props.type) {
		case 'bezier':
			d = Curve.osuLinearBezier(this.props.points, this.props.length);
			break;
		case 'linear':
			d = 'M ' + this.props.points[0].join(' ') + ' L ' + this.props.points[1].join(' ');
			break;
		case 'pass-through':
			d = Curve.osuPassthrough(this.props.points, this.props.length);
			break;
		case 'catmull':
			console.warn('Catmull sliders are not supported: Slider at ' + this.props.time);
			return null;
		default:
			console.error('Unexpected slider type');
			return null;
		}
		return <path d={d} stroke="black" strokeWidth="20" strokeOpacity="0.7" strokeLinejoin="round" strokeLinecap="round" fill="none"/>;
	}
}

PlayfieldSlider.propTypes = {
	currentTime: React.PropTypes.number,
	time: React.PropTypes.number,
	type: React.PropTypes.string,
	points: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.number)),
	length: React.PropTypes.number,
	duration: React.PropTypes.number
};