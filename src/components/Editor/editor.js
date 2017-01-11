/**
  * editor.js
  *
  * Top-level component for the beatmap editor
  */

'use strict';
import React from 'react';
import TopBar from '../TopBar/topbar.js';
import Sidebar from '../Sidebar/sidebar.js';
import SidebarToggle from '../Sidebar/sidebartoggle.js';
import Playfield from '../Playfield/playfield.js';
import BottomBar from '../BottomBar/bottombar.js';

export default class Editor extends React.Component {
	render() {
		const sidebarTogglesLeft = ['select', 'circle', 'slider', 'spinner'];
		const sidebarTogglesRight = ['newcombo', 'whistle', 'finish', 'clap'];
		const sidebarElementsLeft = [];
		const sidebarElementsRight = [];
		// sidebarElementsLeft.push(kiai indicator, samplesets)
		sidebarTogglesLeft.forEach((e) => {
			sidebarElementsLeft.push(
				<SidebarToggle key={e} img="img/square.png" toggleType={e} />
			);
		});
		sidebarTogglesRight.forEach((e) => {
			sidebarElementsRight.push(
				<SidebarToggle key={e} img="img/square.png" toggleType={e} />
			);
		});
		return (
			<div>
				<TopBar />
				<div>
					<Sidebar side="left">
						{sidebarElementsLeft}
					</Sidebar>
					<Playfield />
					<Sidebar side="right">
						{sidebarElementsRight}
					</Sidebar>
				</div>
				<BottomBar />
			</div>
		);
	}
}