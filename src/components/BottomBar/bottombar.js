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
				<SongTimeline />
				<PlaybackSpeed />
			</div>
		);
	}
}