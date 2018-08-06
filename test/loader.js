/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

/**
 * @fileoverview minibuffer test target loader.
 * @see https://github.com/rochars/minibuffer
 */

let minibuffer;
let types = require("binary-data-types");

// UMD min
if (process.argv[3] == '--umd') {
	console.log('umd tests');
	minibuffer = require('../dist/minibuffer.umd.js');
// UMD min, no Uint8Array available, es3 tag is misleading
} else if (process.argv[3] == '--es3') {
	console.log('es3 tests');
	global.Uint8Array = undefined;
	minibuffer = require('../dist/minibuffer.umd.js');

// ES6
} else if (process.argv[3] == '--esm') {
	require = require("esm")(module);
	global.module = module;
	console.log("esm");
	minibuffer = require('../dist/minibuffer.js');

// ES6 min
} else if (process.argv[3] == '--min') {
	require = require("esm")(module);
	global.module = module;
	console.log("min");
	minibuffer = require('../dist/minibuffer.min.js');

// Source
} else {
	require = require("esm")(module);
	global.module = module;
	console.log('Source tests');
	minibuffer = require('../index.js');
}

minibuffer.types = types;
module.exports = minibuffer;
