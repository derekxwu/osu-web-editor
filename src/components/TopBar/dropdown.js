/**
  * dropdown.js
  *
  * Dropdown menus - File, compose, edit, etc.
  * No Comppose/Design/Timing/Setup tabs because they take more space than
  * they're worth. Plus I'm not supporting storyboarding anyway.
  */

import React from 'react';

export default class Dropdown extends React.Component {
	render() {
		const fileMenu = [
			'newdiff',
			'changediff',
			'save',
			'reverttosave',
			'AIMod',
			'AIBat',
			'download',
			'edittext'
		];
		const editMenu = [
			'clone',
			'reverseselection',
			'fliph',
			'flipv',
			'rotatecw',
			'rotateccw',
			'rotateby',
			'scaleby',
			'resetsounds'
		];

		// A _LOT_ of todos - snaking sliders, hit animations, followpoints
		const viewMenu = [
			'timing',
			'setup',
			'grid'
		];
		const composeMenu = [
			'makepolygon',
			'slider2stream'
		];
		const timingMenu = [
			'addsection',
			'addinheritedsection',
			'resnapsection',
			'resetsection',
			'deletesection',
			'resnapall',
			'previewpoint'
		];
		const miscMenu = [
			'about',
			'source'
		];
		return (
			<div className="dropdown">
			</div>
		);
	}
}