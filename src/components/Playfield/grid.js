/**
  * grid.js
  *
  * background grid
  */

'use strict';
import React from 'react';

export default class Grid extends React.Component {
	render() {
		const defaultLevel = 3;
		const level = defaultLevel;
		const rows = [], cols = [];
		for (let i = 0; i <= 512; i += Math.pow(2, level + 1)) {
			cols.push(i.toString());
		}
		for (let i = 0; i <= 384; i += Math.pow(2, level + 1)) {
			rows.push(i.toString());
		}
		const lines_v = cols.map((col) => {
			return <line key={col} x1={col} x2={col} y1="0" y2="384"
			strokeWidth="0.3" stroke="black" strokeOpacity="0.3" />;
		});
		const lines_h = rows.map((row) => {
			return <line key={row} x1="0" x2="512" y1={row} y2={row}
			strokeWidth="0.3" stroke="black" strokeOpacity="0.3" />;
		});
		return (
			<g>
				{lines_v}
				{lines_h}
			</g>
		);
	}
}
