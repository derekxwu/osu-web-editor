/**
  * playfieldspinner.js
  *
  * Spinner meant for going on the playfield
  */

import React from 'react';

export default class PlayfieldSpinner extends React.Component {
	render() {
		if (this.props.currentTime > this.props.time && this.props.currentTime < this.props.end) {
			return (
				<text x="256" y="192" fontSize="32" dominantBaseline="central" textAnchor="middle">[Spinner]</text>
			);
		}
		else {
			return null;
		}
	}
}

PlayfieldSpinner.propTypes = {
	currentTime: React.PropTypes.number,
	time: React.PropTypes.number,
	end: React.PropTypes.number
};