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
 * @fileoverview Externs for minibuffer 0.3.0
 * @see https://github.com/rochars/minibuffer
 * @externs
 */

/** @type {!Object} */
var theType = {
	bits: 0,
	signed: false,
	fp: false,
	be: false
};

/**
 * Read a string of UTF-8 characters from a byte buffer.
 * @param {!Uint8Array|!Array<number>} buffer A byte buffer.
 * @param {number=} index The buffer index to start reading.
 * @param {number=} end The buffer index to stop reading, non inclusive.
 *   Assumes buffer length if undefined.
 * @return {string}
 */
function unpackString(buffer, index=0, end=buffer.length) {}

/**
 * Write a string of UTF-8 characters as a byte buffer.
 * @param {string} str The string to pack.
 * @return {!Array<number>} The UTF-8 string bytes.
 */ 
function packString(str) {}

/**
 * Write a string of UTF-8 characters to a byte buffer.
 * @param {string} str The string to pack.
 * @param {!Uint8Array|!Array<number>} buffer The output buffer.
 * @param {number=} index The buffer index to start writing.
 *   Assumes zero if undefined.
 * @return {number} The next index to write in the buffer.
 */
function packStringTo(str, buffer, index=0) {}

// Numbers
/**
 * Pack a number as a byte buffer.
 * @param {number} value The number.
 * @param {!Object} theType The type definition.
 * @return {!Array<number>} The packed value.
 * @throws {Error} If the type definition is not valid.
 * @throws {Error} If the value is not valid.
 */
function pack(value, theType) {}

/**
 * Pack a number to a byte buffer.
 * @param {number} value The value.
 * @param {!Object} theType The type definition.
 * @param {!Uint8Array|!Array<number>} buffer The output buffer.
 * @param {number=} index The buffer index to write. Assumes 0 if undefined.
 * @return {number} The next index to write.
 * @throws {Error} If the type definition is not valid.
 * @throws {Error} If the value is not valid.
 */
function packTo(value, theType, buffer, index=0) {}

/**
 * Pack an array of numbers as a byte buffer.
 * @param {!Array<number>|!TypedArray} values The values.
 * @param {!Object} theType The type definition.
 * @return {!Array<number>} The packed values.
 * @throws {Error} If the type definition is not valid.
 * @throws {Error} If any of the values are not valid.
 */
function packArray(values, theType) {}

/**
 * Pack a array of numbers to a byte buffer.
 * @param {!Array<number>|!TypedArray} values The value.
 * @param {!Object} theType The type definition.
 * @param {!Uint8Array|!Array<number>} buffer The output buffer.
 * @param {number=} index The buffer index to start writing.
 *   Assumes zero if undefined.
 * @return {number} The next index to write.
 * @throws {Error} If the type definition is not valid.
 * @throws {Error} If the value is not valid.
 */
function packArrayTo(values, theType, buffer, index=0) {}

/**
 * Unpack a number from a byte buffer.
 * @param {!Uint8Array|!Array<number>} buffer The byte buffer.
 * @param {!Object} theType The type definition.
 * @param {number=} index The buffer index to read. Assumes zero if undefined.
 * @return {number}
 * @throws {Error} If the type definition is not valid
 * @throws {Error} On bad buffer length.
 */
function unpack(buffer, theType, index=0) {}

/**
 * Unpack an array of numbers from a byte buffer.
 * @param {!Uint8Array|!Array<number>} buffer The byte buffer.
 * @param {!Object} theType The type definition.
 * @param {number=} index The buffer index to start reading.
 *   Assumes zero if undefined.
 * @param {number=} end The buffer index to stop reading.
 *   Assumes the buffer length if undefined.
 * @param {boolean=} safe If set to false, extra bytes in the end of
 *   the array are ignored and input buffers with insufficient bytes will
 *   output a empty array. If safe is set to true the function
 *   will throw a 'Bad buffer length' error. Defaults to false.
 * @return {!Array<number>}
 * @throws {Error} If the type definition is not valid
 */
function unpackArray(
	buffer, theType, index=0, end=buffer.length, safe=false) {}

/**
 * Unpack a array of numbers to a typed array.
 * @param {!Uint8Array|!Array<number>} buffer The byte buffer.
 * @param {!Object} theType The type definition.
 * @param {!TypedArray|!Array<number>} output The output array.
 * @param {number=} index The buffer index to start reading.
 *   Assumes zero if undefined.
 * @param {number=} end The buffer index to stop reading.
 *   Assumes the buffer length if undefined.
 * @param {boolean=} safe If set to false, extra bytes in the end of
 *   the array are ignored and input buffers with insufficient bytes will
 *   write nothing to the output array. If safe is set to true the function
 *   will throw a 'Bad buffer length' error. Defaults to false.
 * @throws {Error} If the type definition is not valid
 */
function unpackArrayTo(
	buffer, theType, output, index=0, end=buffer.length, safe=false) {}
