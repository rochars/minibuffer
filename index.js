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

import {unpackFrom, packTo} from 'byte-data';

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
   * @param {!Uint8Array} buffer The bufefr.
   * @param {!Object} typeDefinition The type definition.
   * @param {?number=} index The index to read.
   * @return {number} The number.
   */
  read(buffer, typeDefinition, index=null) {
    index = index === null ? this.head : index;
    /** @type {number} */
    let size = typeDefinition.bits / 8;
    /** @type {number} */
    let num = unpackFrom(buffer, typeDefinition, index);
    this.head += size + index;
    return num;
  }

  /**
   * Read a number to a buffer.
   * @param {!Uint8Array} buffer The buffer.
   * @param {!Object} typeDefinition The type definition.
   * @param {number} num The number to write.
   * @param {?number=} index The buffer index to write.
   */
  write(buffer, typeDefinition, num, index=null) {
    index = index === null ? this.head : index;
    /** @type {number} */
    let size = typeDefinition.bits / 8;
    this.head += packTo(num, typeDefinition, buffer, index);
  }
}
