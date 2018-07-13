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
 * @fileoverview A minimalist buffer reader and writer.
 * @see https://github.com/rochars/minibuffer
 */

/** @module minibuffer */

import {unpackFrom, packTo, unpackString, packStringTo} from 'byte-data';

/**
 * @type {string}
 * @private
 */
const RANGE_EROR = "Range error";

/**
 * A class to read and write to buffers.
 */
export default class MiniBuffer {
  
  constructor() {
    /**
     * @type {number}
     */
    this.head = 0;
  }

  /**
   * Read a number from a buffer.
   * @param {!Uint8Array} buffer The buffer.
   * @param {!Object} typeDefinition The type definition.
   * @param {?number=} index The index to read.
   * @return {number} The number.
   * @throws {Error} If word size + index > buffer.length
   */
  read(buffer, typeDefinition, index=null) {
    index = index === null ? this.head : index;
    /** @type {number} */
    let size = typeDefinition.bits / 8;
    if (index + size > buffer.length) {
      throw new Error(RANGE_EROR);
    }
    /** @type {number} */
    let num = unpackFrom(buffer, typeDefinition, index);
    this.head = size + index;
    return num;
  }

  /**
   * Write a number to a buffer.
   * @param {!Uint8Array} buffer The buffer.
   * @param {!Object} typeDefinition The type definition.
   * @param {number} num The number to write.
   * @param {?number=} index The buffer index to write.
   * @throws {Error} If word size + index > buffer.length
   */
  write(buffer, typeDefinition, num, index=null) {
    index = index === null ? this.head : index;
    /** @type {number} */
    let size = typeDefinition.bits / 8;
    if (index + size > buffer.length) {
      throw new Error(RANGE_EROR);
    }
    this.head = packTo(num, typeDefinition, buffer, index);
  }

  /**
   * Read a ASCII string from a buffer.
   * @param {!Uint8Array} buffer The buffer.
   * @param {number} size the max size of the string.
   * @param {?number=} index The buffer index to read.
   * @return {string} The string.
   * @throws {Error} If size + index > buffer.length
   */
  readStr(buffer, size, index=null) {
    index = index === null ? this.head : index;
    size = index + size;
    if (size > buffer.length) {
      throw new Error(RANGE_EROR);
    }
    /** @type {string} */
    let str = '';
    for (; index<size; index++) {
      str += unpackString(buffer, index, 1);
    }
    this.head = index;
    return str;
  }

  /**
   * Write a ASCII string to a buffer. If the string is smaller
   * than the max size the output buffer is filled with 0s.
   * @param {!Uint8Array} buffer The buffer.
   * @param {string} str The string to be written as bytes.
   * @param {number=} size The size of the string.
   * @param {?number=} index The buffer index to write.
   * @throws {Error} If size + index > buffer.length
   */
  writeStr(buffer, str, size=str.length, index=null) {
    index = index === null ? this.head : index;
    /** @type {number} */
    let limit = index + size;
    if (limit > buffer.length) {
      throw new Error(RANGE_EROR);
    }
    this.head = packStringTo(str, buffer, index);
    if (this.head < index + size) {
      for (; this.head<limit; this.head++) {
        buffer[this.head] = 0;
      }
    }
  }
}
