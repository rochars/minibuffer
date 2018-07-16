/**
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * https://github.com/rochars/minibuffer
 *
 */

/**
 * @fileoverview minibuffer test loader.
 */

/** @type {Object} */
let minibuffer;

// Browser
if (process.argv[3] == '--min') {
    console.log('browser tests');
    global.window = global;
    require('../dist/minibuffer.min.js');
    minibuffer = window.MiniBuffer;

// CommonJS
} else if (process.argv[3] == '--cjs') {
	console.log('cjs tests');
	minibuffer = require('../dist/minibuffer.cjs.js');
	minibufferDefault = require('../dist/minibuffer.cjs.js').default;
	if (minibuffer != minibufferDefault) {
		throw new Error('CommonJS dist should export as default and as .default.');
	}

// ESM
} else if (process.argv[3] == '--esm') {
	console.log('esm tests');
	require = require("esm")(module);
	global.module = module;
	minibuffer = require('../dist/minibuffer.js').default;

// Source
} else {
	console.log('Source tests');
	require = require("esm")(module);
	global.module = module;
	minibuffer = require('../index.js').default;
}

module.exports = minibuffer;
