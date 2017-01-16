/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './components/Editor/editor.js';

window.onload = () => {
	ReactDOM.render(<Editor />, document.getElementsByClassName('main')[0]);
};