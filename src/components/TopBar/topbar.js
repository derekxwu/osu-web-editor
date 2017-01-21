/**
  * topbar.js
  *
  * Top section, containing dropdowns, local timeline, beat snap etc.
  */

import React from 'react';
import BeatSnap from './beatsnap.js';
import Dropdown from './dropdown.js';
import LocalTimeline from './localtimeline.js';

export default class TopBar extends React.Component {
	render() {
		return (
			<div className="topbar">
				<div className="topbar-left">
					<Dropdown />
					<LocalTimeline />
				</div>
				<BeatSnap />
			</div>
		);
	}
}