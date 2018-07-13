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
 * @fileoverview Externs for minibuffer 0.1
 *
 * @see https://github.com/rochars/minibuffer
 * @externs
 */

/**
 * A class to read and write to buffers.
 */
var MiniBuffer = {};

// The types param
var typeDefinition = {
	bits: 0,
	signed: false,
	float: false,
	be: false
};

/**
 * @type {number}
 */
MiniBuffer.head = 0;

/**
 * Read a number from a buffer.
 * @param {!Uint8Array} buffer The bufefr.
 * @param {!Object} typeDefinition The type definition.
 * @param {?number=} index The index to read.
 * @return {number} The number.
 * @throws {Error} If word size + index > buffer.length
 */
MiniBuffer.read = function(buffer, typeDefinition, index=null) {};

/**
 * Write a number to a buffer.
 * @param {!Uint8Array} buffer The buffer.
 * @param {!Object} typeDefinition The type definition.
 * @param {number} num The number to write.
 * @param {?number=} index The buffer index to write.
 * @throws {Error} If word size + index > buffer.length
 */
MiniBuffer.write = function(buffer, typeDefinition, num, index=null) {};

/**
 * Write a ASCII string to a buffer. If the string is smaller
 * than the max size the output buffer is filled with 0s.
 * @param {!Uint8Array} buffer The buffer.
 * @param {string} str The string to be written as bytes.
 * @param {number=} size The size of the string.
 * @param {?number=} index The buffer index to write.
 * @throws {Error} If size + index > buffer.length
 */
MiniBuffer.writeStr = function(buffer, str, size=str.length, index=null) {};

/**
 * Read a ASCII string from a buffer.
 * @param {!Uint8Array} buffer The buffer.
 * @param {number} size the max size of the string.
 * @param {?number=} index The buffer index to read.
 * @return {string} The string.
 * @throws {Error} If size + index > buffer.length
 */
MiniBuffer.readStr = function(buffer, size, index=null) {};
