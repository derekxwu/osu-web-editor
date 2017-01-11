/**
  * sidebar.js
  *
  * Left and right sidebars
  *   Select/Circle/Slider/Spinner
  *   NC, hitsounds, grid/distance snap
  */

'use strict';
import React from 'react';

export default class Sidebar extends React.Component {
	render() {
		return (
			<div className={'sidebar sidebar-' + this.props.side}>
				{this.props.children}
			</div>
		);
	}
}

Sidebar.propTypes = {
	side: React.PropTypes.string,
	children: React.PropTypes.node
};