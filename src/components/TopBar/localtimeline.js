/**
  * localtimeline.js
  *
  * Zoom-in of timeline, with hit objects shown - and note ticks
  */

import React from 'react';

export default class LocalTimeline extends React.Component {
	render() {
		return (
			<div className="localtimeline">
				<div className="timelinezoom"></div>
				<svg viewBox="0 0 100 100" preserveAspectRatio="none">
					{/*	maps absolute units to percentages */}
					<path d="M 0 90 L 100 90" stroke="white" strokeWidth="1" vectorEffect="non-scaling-stroke" />
					<path d="M 50 10 L 50 90" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />
				</svg>
			</div>
		);
	}
}