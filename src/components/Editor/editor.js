/**
  * editor.js
  *
  * Top-level component for the beatmap editor
  */

import React from 'react';
import TopBar from '../TopBar/topbar.js';
import Sidebar from '../Sidebar/sidebar.js';
import SidebarToggle from '../Sidebar/sidebartoggle.js';
import Playfield from '../Playfield/playfield.js';
import BottomBar from '../BottomBar/bottombar.js';

import JSZip from 'jszip';
import OsuParser from '../../../lib/osu-parser-web/index.js';

export default class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			files: [],
			currentDiff: null,
			audioFile: null,
			backgroundImage: null,
			currentTime: 0
		};

		this.handleOszDrop = this.handleOszDrop.bind(this);
		this.beatmapLoad = this.beatmapLoad.bind(this);
	}

	doNothing(e) {
		e.preventDefault();
	}

	handleOszDrop(e) {
		e.preventDefault();
		e.stopPropagation();

		JSZip.loadAsync(e.dataTransfer.files[0])
			.then(this.beatmapLoad, (error) => {
				console.error(error);
			});
	}

	beatmapLoad(unzipped) {
		unzipped.file(/\.osu$/)[0] // First .osu file in the set
			.async('string') // unzip to string
			.then((osufile) => { // parse and change state
				const beatmap = OsuParser.parseContent(osufile);
				if (beatmap.Mode !== '0') {
					// TODO: Something user-visible
					console.warn('Only osu!standard is supported.');
				}
				this.setState({
					files: unzipped,
					audioFile: beatmap.AudioFilename,
					currentDiff: beatmap,
					backgroundImage: beatmap.bgFilename,
					currentTime: 0
				});
				// Load song, background image
				console.log(beatmap);
			}, (error) => {
				console.error('Failed to decompress file.');
				console.error(error);
			});
	}

	render() {
		let topbar, playfield, bottombar;
		if (this.state.currentDiff !== null) {
			topbar = <TopBar
							currentTime={this.state.currentTime}
							objects={this.state.currentDiff.hitObjects}
							timingPoints={this.state.currentDiff.timingPoints}
							bookmarks={this.state.currentDiff.Bookmarks}
						/>;
			playfield = <Playfield currentTime={this.state.currentTime} objects={this.state.currentDiff.hitObjects} />;
			bottombar = <BottomBar
							currentTime={this.state.currentTime}
							timingPoints={this.state.currentDiff.timingPoints}
							bookmarks={this.state.currentDiff.Bookmarks}
						/>;
		} else { // No beatmap loaded yet
			topbar = <TopBar currentTime={this.state.currentTime} objects={[]} timingPoints={[]} bookmarks={[]} />;
			playfield = <Playfield currentTime={this.state.currentTime} objects={[]} />;
			bottombar = <BottomBar currentTime={this.state.currentTime} timingPoints={[]} bookmarks={[]} />;
		}


		const sidebarTogglesLeft = ['select', 'circle', 'slider', 'spinner'].map((e) => {
			return <SidebarToggle key={e} img="img/square.png" toggleType={e} />;
		});
		const sidebarTogglesRight = ['newcombo', 'whistle', 'finish', 'clap'].map((e) => {
			return <SidebarToggle key={e} img="img/square.png" toggleType={e} />;
		});
		// sidebarTogglesLeft.push(kiai indicator, samplesets)

		return (
			<div onDragOver={this.doNothing} onDrop={this.handleOszDrop}>
				{topbar}
				<div>
					<Sidebar side="left">
						{sidebarTogglesLeft}
					</Sidebar>
					{playfield}
					<Sidebar side="right">
						{sidebarTogglesRight}
					</Sidebar>
				</div>
				{bottombar}
			</div>
		);
	}
}