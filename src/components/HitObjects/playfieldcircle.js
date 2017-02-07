/**
  * playfieldcircle.js
  *
  * Circle meant for going on the playfield
  */

import React from 'react';

export default class PlayfieldCircle extends React.Component {
	render() {
		let circleSize = 60;
		let approachSize = circleSize * ((this.props.time - this.props.currentTime)/250 + 1);
		return (
			<g>
				<image
					href="img/hitcircle.png"
					x={this.props.x} y={this.props.y}
					transform={'translate(-' + circleSize/2 + ', -' + circleSize/2 + ')'}
					height={circleSize} width={circleSize}
				/>
				<image
					href="img/hitcircleoverlay.png"
					x={this.props.x} y={this.props.y}
					transform={'translate(-' + circleSize/2 + ', -' + circleSize/2 + ')'}
					height={circleSize} width={circleSize}
				/>
				{approachSize > circleSize && <image
					href="img/approachcircle.png"
					x={this.props.x} y={this.props.y}
					transform={'translate(-' + approachSize/2 + ', -' + approachSize/2 + ')'}
					height={approachSize} width={approachSize}
				/>}
			</g>
		);
	}
}

PlayfieldCircle.propTypes = {
	x: React.PropTypes.number,
	y: React.PropTypes.number,
	currentTime: React.PropTypes.number,
	time: React.PropTypes.number
};