/**
  * playfield.js
  *
  * Grid and Hitobjects
  */

'use strict';
import React from 'react';
import Grid from './grid.js';

export default class Playfield extends React.Component {
	render() {
		return (
			<div className="playfield">
				{/* Playfield is 512x384
				  * Add 55opx margin for CS0 going beyond
				  */}
				<svg height="100%" viewBox="-40 -40 592 464">
					<rect x="0" y="0" width="512" height="384"
					fill="black" fillOpacity="0.2"/>
					<line x1="0" x2="512" y1="192" y2="192"
					stroke="black" strokeWidth="0.5" strokeOpacity="0.5" />
					<line x1="256" x2="256" y1="0" y2="384"
					stroke="black" strokeWidth="0.5" strokeOpacity="0.5" />
					<Grid />
				</svg>
			</div>
		);
	}
}