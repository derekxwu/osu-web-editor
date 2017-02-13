/**
  * playfieldslider.js
  *
  * Slider meant for going on the playfield
  */

import React from 'react';
import PlayfieldCircle from './playfieldcircle.js';
import Curve from './curve.js';

export default class PlayfieldSlider extends React.Component {
	render() {
		let d = '';
		switch (this.props.type) {
		case 'bezier':
			d = Curve.osuLinearBezier(this.props.points, this.props.length, this.props.repeats);
			break;
		case 'linear':
			// TODO: repeats
			d = 'M ' + this.props.points[0].join(' ') + ' L ' + this.props.points[1].join(' ');
			break;
		case 'pass-through':
			d = Curve.osuPassthrough(this.props.points, this.props.length, this.props.repeats);
			break;
		case 'catmull':
			console.warn('Catmull sliders are not supported: Slider at ' + this.props.time);
			return null;
		default:
			console.error('Unexpected slider type');
			return null;
		}
		return <g>
					<path
						d={d}
						stroke="black"
						strokeWidth={this.props.circleSize - 8}
						strokeOpacity="0.7"
						strokeLinejoin="round"
						strokeLinecap="round"
						fill="none"
						strokeDasharray={((this.props.currentTime + 500) < this.props.time) ?
						'0 99999' :
						(this.props.length * ((this.props.currentTime + 500) - this.props.time) / this.props.duration) + ' 99999'}
					/>
					<PlayfieldCircle
						currentTime={this.props.currentTime}
						x={this.props.points[0][0]}
						y={this.props.points[0][1]}
						time={this.props.time}
						circleSize={this.props.circleSize}
						approachTime={this.props.approachTime}
					/>
				</g>;
	}
}

PlayfieldSlider.propTypes = {
	currentTime: React.PropTypes.number,
	time: React.PropTypes.number,
	type: React.PropTypes.string,
	points: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.number)),
	length: React.PropTypes.number,
	duration: React.PropTypes.number,
	repeats: React.PropTypes.number,
	circleSize: React.PropTypes.number,
	approachTime: React.PropTypes.number,
	visibleRange: React.PropTypes.number
};