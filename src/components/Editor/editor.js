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
			currentTime: 0,
			selection: [],
			keyboard: new Set(),
			drawer: setInterval(this.audioTimeUpdateHandler.bind(this), 16)
		};

		this.handleOszDrop = this.handleOszDrop.bind(this);
		this.beatmapLoad = this.beatmapLoad.bind(this);
		this.keyDownHandler = this.keyDownHandler.bind(this);
		this.keyUpHandler = this.keyUpHandler.bind(this);
	}

	doNothing(event) {
		event.preventDefault();
	}

	handleOszDrop(event) {
		event.preventDefault();
		event.stopPropagation();

		JSZip.loadAsync(event.dataTransfer.files[0])
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
				unzipped.file(beatmap.AudioFilename).async('base64', (meta) => {
					console.log(meta.percent.toFixed(2) + '%');
				})
				.then((encodedSong) => {
					this.refs.song.src = 'data:audio/mp3;base64,' + encodedSong;
					document.getElementsByTagName('audio')[0].play();
				});

				// eslint-disable-next-line no-console
				console.log(beatmap); // TODO: This is temp
			}, (error) => {
				console.error('Failed to decompress file.\n', error);
			});
	}

	audioTimeUpdateHandler() {
		this.setState({currentTime: (Math.round(this.refs.song.currentTime * 1000))});
	}

	// Need to eat Tab presses so focus remains on React div
	keyDownHandler(event) {
		if (this.state.keyboard.has(event.key.toLowerCase())) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		let stopPropagation = true;
		let audio = document.getElementsByTagName('audio')[0];
		switch (event.key) {
		case '1': // Select mode
			break;
		case '2': // Place circles
			break;
		case '3': // Place sliders
			break;
		case '4': // Place spinners
			break;

		case 'q': case 'Q': // New Combo
			break;
		case 'w': case 'W':
			break;
		case 'e': case 'E':
			break;
		case 'r': case 'R': // Ctrl+R MUST REFRESH
			break;
		case 't': case 'T':
			break;

		case 'a': case 'A': // Select all, AIMod
			audio.currentTime = 0;
			break;
		case 's': case 'S': // Save, export
			audio.currentTime = audio.currentTime - 3;
			break;
		case 'd': case 'D': // Clone, polygons
			audio.currentTime = audio.currentTime + 3;
			break;
		case 'f': case 'F': // Slider2Stream
			audio.currentTime = audio.currentTime + 10;
			break;
		case 'g': case 'G': // Reverse selection
			break;

		case 'z': case 'Z': // Undo
			break;
		case 'x': case 'X': // Cut
			break;
		case 'c': case 'C': // Copy
			break;
		case 'v': case 'V': // Paste
			break;
		case 'b': case 'B': // Nice?
			break;

		case 'F1': //
			break;
		case 'F2': //
			break;
		case 'F3': //
			break;
		case 'F4': //
			break;
		case 'F5': // Test play - ctrl+F5 -> refresh
			break;

		case ' ': // play/pause
			audio.paused ? audio.play() : audio.pause();
			break;
		case 'Alt': // Spacing snap
			break;
		case 'Shift': // Grid snap
			break;
		case 'Escape': // Empty selection, close any modals
			break;

		default:
			stopPropagation = false;
			break;
		}
		if (stopPropagation) {
			this.state.keyboard.add(event.key.toLowerCase());

			event.preventDefault();
			event.stopPropagation();
		}
	}

	keyUpHandler(event) {
		this.state.keyboard.delete(event.key.toLowerCase());
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
			<div tabIndex="0" onDragOver={this.doNothing} onDrop={this.handleOszDrop} onKeyDownCapture={this.keyDownHandler} onKeyUpCapture={this.keyUpHandler}>
				{topbar}
				<div className="center">
					<Sidebar side="left">
						{sidebarTogglesLeft}
					</Sidebar>
					{playfield}
					<Sidebar side="right">
						{sidebarTogglesRight}
					</Sidebar>
				</div>
				{bottombar}
				<audio preload ref="song">
				</audio>
			</div>
		);
	}
}