/**
  * playfieldcircle.js
  *
  * Circle meant for going on the playfield
  */

import React from 'react';

export default class PlayfieldCircle extends React.Component {
	render() {
		const timeDiff = Math.abs(this.props.time - this.props.currentTime);
		const opacity = 1 - 0.7 * (timeDiff / 500);
		return (
			<image 	href="img/hitcircle.png"
					x={this.props.x} y={this.props.y}
					height="30" width="30"
					opacity={opacity}
			/>
		);
	}
}

PlayfieldCircle.propTypes = {
	x: React.PropTypes.number,
	y: React.PropTypes.number,
	currentTime: React.PropTypes.number,
	time: React.PropTypes.number
};