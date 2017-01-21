/**
  * bottombar.js
  *
  * Full timeline, playback speed
  */

import React from 'react';
import PlaybackSpeed from './playbackspeed.js';
import SongTimeline from './songtimeline.js';

export default class BottomBar extends React.Component {
	render() {
		return (
			<div className="bottombar">
				{/* Thing to pop up other timelines */}
				<SongTimeline />
				<PlaybackSpeed />
			</div>
		);
	}
}