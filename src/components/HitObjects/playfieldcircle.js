/**
  * playfieldcircle.js
  *
  * Circle meant for going on the playfield
  */

import React from 'react';

export default class PlayfieldCircle extends React.Component {
	render() {
		let timeDiff = this.props.time - this.props.currentTime;
		let approachScale = (3 * timeDiff / this.props.approachTime) + 1;
		let approachSize = this.props.circleSize * approachScale;
		let opacity = 0.2 + (1 - (Math.abs(timeDiff) / this.props.visibleRange));
		return (
			<g opacity={opacity}>
				<image
					href="img/hitcircle.png"
					x={this.props.x} y={this.props.y}
					transform={'translate(-' + this.props.circleSize/2 + ', -' + this.props.circleSize/2 + ')'}
					height={this.props.circleSize} width={this.props.circleSize}
				/>
				<image
					href="img/hitcircleoverlay.png"
					x={this.props.x} y={this.props.y}
					transform={'translate(-' + this.props.circleSize/2 + ', -' + this.props.circleSize/2 + ')'}
					height={this.props.circleSize} width={this.props.circleSize}
				/>
				{approachScale > 1 && approachScale < 4 && <image
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
	time: React.PropTypes.number,
	circleSize: React.PropTypes.number,
	approachTime: React.PropTypes.number,
	visibleRange: React.PropTypes.number
};