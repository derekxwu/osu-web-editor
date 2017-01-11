/**
  * sidebartoggle.js
  *
  * Toggles within each sidebar, plus sampleset/additions
  */

'use strict';
import React from 'react';

export default class SidebarToggle extends React.Component {
	render() {
		const toggleText = {
			'select': 'Select',
			'circle': 'Circle',
			'slider': 'Slider',
			'spinner': 'Spinner',
			'newcombo': 'New Combo',
			'whistle': 'Whistle',
			'finish': 'Finish',
			'clap': 'Clap'
		};
		return (
			<div className={'sidebartoggle sidebartoggle-' + this.props.toggleType}>
				<p>{toggleText[this.props.toggleType]}</p>
			</div>
		);
	}
}

SidebarToggle.propTypes = {
	toggleType: React.PropTypes.string,
	img: React.PropTypes.string
};