'use strict';

/*
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
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
 * @fileoverview A function to swap endianness in byte buffers.
 * @see https://github.com/rochars/endianness
 */

/**
 * Swap the byte ordering in a buffer. The buffer is modified in place.
 * @param {!Array<number|string>|!Uint8Array} bytes The bytes.
 * @param {number} offset The byte offset.
 * @param {number=} index The start index. Assumes 0.
 * @param {number=} end The end index. Assumes the buffer length.
 * @throws {Error} If the buffer length is not valid.
 */
function endianness(bytes, offset, index=0, end=bytes.length) {
  if (end % offset) {
    throw new Error("Bad buffer length.");
  }
  for (; index < end; index += offset) {
    swap(bytes, offset, index);
  }
}

/**
 * Swap the byte order of a value in a buffer. The buffer is modified in place.
 * @param {!Array<number|string>|!Uint8Array} bytes The bytes.
 * @param {number} offset The byte offset.
 * @param {number} index The start index.
 * @private
 */
function swap(bytes, offset, index) {
  offset--;
  for(let x = 0; x < offset; x++) {
    /** @type {number|string} */
    let theByte = bytes[index + x];
    bytes[index + x] = bytes[index + offset];
    bytes[index + offset] = theByte;
    offset--;
  }
}

/*
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
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
 * @fileoverview Pack and unpack two's complement ints and unsigned ints.
 * @see https://github.com/rochars/byte-data
 */

/**
 * A class to pack and unpack two's complement ints and unsigned ints.
 */
class Integer {

  /**
   * @param {number} bits Number of bits used by the data.
   * @param {boolean} signed True for signed types.
   * @throws {Error} if the number of bits is smaller than 1 or greater than 64.
   */
  constructor(bits, signed) {
    /**
     * The max number of bits used by the data.
     * @type {number}
     * @private
     */
    this.bits_ = bits;
    /**
     * The number of bytes used by the data.
     * @type {number}
     * @private
     */
    this.offset_ = 0;
    /**
     * The practical number of bits used by the data.
     * @type {number}
     * @private
     */
    this.realBits_ = this.bits_;
    /**
     * The mask to be used in the last byte.
     * @type {number}
     * @private
     */
    this.lastByteMask_ = 255;
    // Set the min and max values according to the number of bits
    /** @type {number} */
    let max = Math.pow(2, this.bits_);
    if (signed) {
      this.max_ = max / 2 -1;
      this.min_ = -max / 2;
    } else {
      this.max_ = max - 1;
      this.min_ = 0;
    }
    this.build_();
  }

  /**
   * Read one integer number from a byte buffer.
   * @param {!Uint8Array} bytes An array of bytes.
   * @param {number=} i The index to read.
   * @return {number}
   */
  read(bytes, i=0) {
    let num = 0;
    for(let x=0; x<this.offset_; x++) {
      num += bytes[i + x] * Math.pow(256, x);
    }
    return this.overflow_(this.sign_(num)); 
  }

  /**
   * Write one integer number to a byte buffer.
   * @param {!Array<number>} bytes An array of bytes.
   * @param {number} num The number.
   * @param {number=} j The index being written in the byte buffer.
   * @return {number} The next index to write on the byte buffer.
   * @private
   */
  write(bytes, num, j=0) {
    j = this.writeFirstByte_(bytes, this.overflow_(num), j);
    for (let i = 2; i < this.offset_; i++, j++) {
      bytes[j] = Math.floor(num / Math.pow(2, ((i - 1) * 8))) & 255;
    }
    if (this.bits_ > 8) {
      bytes[j] = Math.floor(
          num / Math.pow(2, ((this.offset_ - 1) * 8))) & this.lastByteMask_;
      j++;
    }
    return j;
  }

  /**
   * Build the type.
   * @throws {Error} if the number of bits is smaller than 1 or greater than 64.
   * @private
   */
  build_() {
    this.setRealBits_();
    this.setLastByteMask_();
    this.offset_ = this.bits_ < 8 ? 1 : Math.ceil(this.realBits_ / 8);
  }

  /**
   * Sign a number.
   * @param {number} num The number.
   * @return {number}
   * @private
   */
  sign_(num) {
    if (num > this.max_) {
      num -= (this.max_ * 2) + 2;
    }
    return num;
  }

  /**
   * Trows error in case of underflow or overflow.
   * @param {number} num The number.
   * @return {number}
   * @throws {Error} on overflow or underflow.
   * @private
   */
  overflow_(num) {
    if (num > this.max_) {
      throw new Error('Overflow.');
    } else if (num < this.min_) {
      throw new Error('Underflow.');
    }
    return num;
  }

  /**
   * Set the practical bit number for data with bit count different
   * from the standard types (8, 16, 32, 40, 48, 64).
   * @private
   */
  setRealBits_() {
    this.realBits_ = ((this.bits_ - 1) | 7) + 1;
  }

  /**
   * Set the mask that should be used when writing the last byte.
   * @private
   */
  setLastByteMask_() {
    /** @type {number} */
    let r = 8 - (this.realBits_ - this.bits_);
    this.lastByteMask_ = Math.pow(2, r > 0 ? r : 8) - 1;
  }

  /**
   * Write the first byte of a integer number.
   * @param {!Array<number>} bytes An array of bytes.
   * @param {number} number The number.
   * @param {number} j The index being written in the byte buffer.
   * @return {number} The next index to write on the byte buffer.
   * @private
   */
  writeFirstByte_(bytes, number, j) {
    if (this.bits_ < 8) {
      bytes[j] = number < 0 ? number + Math.pow(2, this.bits_) : number;
    } else {
      bytes[j] = number & 255;
    }
    return j + 1;
  }
}

/*
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
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
 * @fileoverview Functions to validate input.
 * @see https://github.com/rochars/byte-data
 */

function validateValueType(value) {
  if (value !== null) {
    if ([Number, Boolean].indexOf(value.constructor) == -1) {
      throw new Error('Expected number, boolean or null; found ' + value.constructor);
    }
  }
}

/**
 * Validate that the value is not null or undefined.
 * @param {number} value The value.
 * @throws {Error} If the value is of type undefined.
 */
function validateNotUndefined(value) {
  if (value === undefined) {
    throw new Error('Undefined value.');
  }
}

/**
 * Validate the type definition.
 * @param {!Object} theType The type definition.
 * @throws {Error} If the type definition is not valid.
 */
function validateType(theType) {
  if (!theType) {
    throw new Error('Undefined type.');
  }
  if (theType.float) {
    validateFloatType_(theType);
  } else {
    validateIntType_(theType);
  }
}

/**
 * Validate the type definition of floating point numbers.
 * @param {!Object} theType The type definition.
 * @throws {Error} If the type definition is not valid.
 * @private
 */
function validateFloatType_(theType) {
  if ([16,32,64].indexOf(theType.bits) == -1) {
    throw new Error('Bad float type.');
  }
}

/**
 * Validate the type definition of integers.
 * @param {!Object} theType The type definition.
 * @throws {Error} If the type definition is not valid.
 * @private
 */
function validateIntType_(theType) {
  if (theType.bits < 1 || theType.bits > 53) {
    throw new Error('Bad type definition.');
  }
}

/*
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
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
 * Use a Typed Array to check if the host is BE or LE. This will impact
 * on how 64-bit floating point numbers are handled.
 * @type {boolean}
 * @private
 */
const BE_ENV = new Uint8Array(new Uint32Array([1]).buffer)[0] === 0;
/**
 * @type {number}
 * @private
 */
const HIGH = BE_ENV ? 1 : 0;
/**
 * @type {number}
 * @private
 */
const LOW = BE_ENV ? 0 : 1;
/**
 * @type {!Int8Array}
 * @private
 */
let int8_ = new Int8Array(8);
/**
 * @type {!Uint32Array}
 * @private
 */
let ui32_ = new Uint32Array(int8_.buffer);
/**
 * @type {!Float32Array}
 * @private
 */
let f32_ = new Float32Array(int8_.buffer);
/**
 * @type {!Float64Array}
 * @private
 */
let f64_ = new Float64Array(int8_.buffer);
/**
 * @type {Function}
 * @private
 */
let reader_;
/**
 * @type {Function}
 * @private
 */
let writer_;
/**
 * @type {Object}
 * @private
 */
let gInt_ = {};

/**
 * Validate the type and set up the packing/unpacking functions.
 * @param {!Object} theType The type definition.
 * @throws {Error} If the type definition is not valid.
 * @private
 */
function setUp_(theType) {
  validateType(theType);
  theType.offset = theType.bits < 8 ? 1 : Math.ceil(theType.bits / 8);
  setReader(theType);
  setWriter(theType);
  gInt_ = new Integer(
    theType.bits == 64 ? 32 : theType.bits,
    theType.float ? false : theType.signed);
}

/**
 * Turn numbers to bytes.
 * @param {number} value The value to be packed.
 * @param {!Object} theType The type definition.
 * @param {!Uint8Array|!Array<number>} buffer The buffer to write the bytes to.
 * @param {number} index The index to start writing.
 * @param {number} len The end index.
 * @return {number} the new index to be written.
 * @private
 */
function writeBytes_(value, theType, buffer, index, len) {
  validateNotUndefined(value);
  validateValueType(value);
  while (index < len) {
    index = writer_(buffer, value, index);
  }
  if (theType.be) {
    endianness(
      buffer, theType.offset, index - theType.offset, index);
  }
  return index;
}

/**
 * Read int values from bytes.
 * @param {!Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @return {number}
 * @private
 */
function readInt_(bytes, i) {
  return gInt_.read(bytes, i);
}

/**
 * Read 1 16-bit float from bytes.
 * Thanks https://stackoverflow.com/a/8796597
 * @param {!Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @return {number}
 * @private
 */
function read16F_(bytes, i) {
  /** @type {number} */
  let int = gInt_.read(bytes, i);
  /** @type {number} */
  let exponent = (int & 0x7C00) >> 10;
  /** @type {number} */
  let fraction = int & 0x03FF;
  /** @type {number} */
  let floatValue;
  if (exponent) {
    floatValue =  Math.pow(2, exponent - 15) * (1 + fraction / 0x400);
  } else {
    floatValue = 6.103515625e-5 * (fraction / 0x400);
  }
  return floatValue * (int >> 15 ? -1 : 1);
}

/**
 * Read 1 32-bit float from bytes.
 * @param {!Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @return {number}
 * @private
 */
function read32F_(bytes, i) {
  ui32_[0] = gInt_.read(bytes, i);
  return f32_[0];
}

/**
 * Read 1 64-bit float from bytes.
 * Thanks https://gist.github.com/kg/2192799
 * @param {!Uint8Array} bytes An array of bytes.
 * @param {number} i The index to read.
 * @return {number}
 * @private
 */
function read64F_(bytes, i) {
  ui32_[HIGH] = gInt_.read(bytes, i);
  ui32_[LOW] = gInt_.read(bytes, i + 4);
  return f64_[0];
}

/**
 * Write a integer value to a byte buffer.
 * @param {!Uint8Array} bytes An array of bytes.
 * @param {number} number The number to write as bytes.
 * @param {number} j The index being written in the byte buffer.
 * @return {!number} The next index to write on the byte buffer.
 * @private
 */
function writeInt_(bytes, number, j) {
  return gInt_.write(bytes, number, j);
}

/**
 * Write one 16-bit float as a binary value.
 * @param {!Uint8Array} bytes An array of bytes.
 * @param {number} number The number to write as bytes.
 * @param {number} j The index being written in the byte buffer.
 * @return {number} The next index to write on the byte buffer.
 * @private
 */
function write16F_(bytes, number, j) {
  f32_[0] = number;
  /** @type {number} */
  let x = ui32_[0];
  /** @type {number} */
  let bits = (x >> 16) & 0x8000;
  /** @type {number} */
  let m = (x >> 12) & 0x07ff;
  /** @type {number} */
  let e = (x >> 23) & 0xff;
  if (e >= 103) {
    bits |= ((e - 112) << 10) | (m >> 1);
    bits += m & 1;
  }
  bytes[j++] = bits & 0xFF;
  bytes[j++] = bits >>> 8 & 0xFF;
  return j;
}

/**
 * Write one 32-bit float as a binary value.
 * @param {!Uint8Array} bytes An array of bytes.
 * @param {number} number The number to write as bytes.
 * @param {number} j The index being written in the byte buffer.
 * @return {number} The next index to write on the byte buffer.
 * @private
 */
function write32F_(bytes, number, j) {
  f32_[0] = number;
  return gInt_.write(bytes, ui32_[0], j);
}

/**
 * Write one 64-bit float as a binary value.
 * @param {!Uint8Array} bytes An array of bytes.
 * @param {number} number The number to write as bytes.
 * @param {number} j The index being written in the byte buffer.
 * @return {number} The next index to write on the byte buffer.
 * @private
 */
function write64F_(bytes, number, j) {
  f64_[0] = number;
  j = gInt_.write(bytes, ui32_[HIGH], j);
  return gInt_.write(bytes, ui32_[LOW], j);
}

/**
 * Set the function to unpack the data.
 * @param {!Object} theType The type definition.
 * @private
 */
function setReader(theType) {
  if (theType.float) {
    if (theType.bits == 16) {
      reader_ = read16F_;
    } else if(theType.bits == 32) {
      reader_ = read32F_;
    } else {
      reader_ = read64F_;
    }
  } else {
    reader_ = readInt_;
  }
}

/**
 * Set the function to pack the data.
 * @param {!Object} theType The type definition.
 * @private
 */
function setWriter(theType) {
  if (theType.float) {
    if (theType.bits == 16) {
      writer_ = write16F_;
    } else if(theType.bits == 32) {
      writer_ = write32F_;
    } else {
      writer_ = write64F_;
    }
  } else {
    writer_ = writeInt_;
  }   
}

/*
 * Copyright (c) 2017-2018 Rafael da Silva Rocha.
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
 * Read a string of UTF-8 characters from a byte buffer.
 * @see https://encoding.spec.whatwg.org/#the-encoding
 * @see https://stackoverflow.com/a/34926911
 * @param {!Uint8Array|!Array<!number>} buffer A byte buffer.
 * @param {number=} index The index to read.
 * @param {?number=} len The number of bytes to read.
 * @return {string}
 * @throws {Error} If read a value that is not UTF-8.
 */
function unpackString(buffer, index=0, len=null) {
  len = len !== null ? index + len : buffer.length;
  /** @type {string} */
  let str = "";
  while(index < len) {
    /** @type {number} */
    let charCode = buffer[index++];
    if (charCode >> 7 === 0) {
      str += String.fromCharCode(charCode);
    } else {
      /** @type {number} */
      let count = 0;
      if (charCode >> 5 === 0x06) {
        count = 1;
      } else if (charCode >> 4 === 0x0e) {
        count = 2;
      } else if (charCode >> 3 === 0x1e) {
        count = 3;
      }
      charCode = charCode & (1 << (8 - count - 1)) - 1;
      for (let i = 0; i < count; i++) {
        charCode = (charCode << 6) | (buffer[index++] & 0x3f);
      }
      if (charCode <= 0xffff) {
        str += String.fromCharCode(charCode);
      } else {
        charCode -= 0x10000;
        str += String.fromCharCode(
          ((charCode >> 10) & 0x3ff) + 0xd800,
          (charCode & 0x3ff) + 0xdc00);
      }
    }
  }
  return str;
}

/**
 * Write a string of UTF-8 characters as a byte buffer.
 * @see https://encoding.spec.whatwg.org/#utf-8-encoder
 * @param {string} str The string to pack.
 * @return {!Array<number>} The next index to write on the buffer.
 * @throws {Error} If a character in the string is not UTF-8.
 */
function packString(str) {
  /** @type {!Array<!number>} */
  let bytes = [];
  for (let i = 0; i < str.length; i++) {
    /** @type {number} */
    let codePoint = str.codePointAt(i);
    if (codePoint < 128) {
      bytes.push(codePoint);
    } else {
      /** @type {number} */
      let count = 0;
      /** @type {number} */
      let offset = 0;
      if (codePoint <= 0x07FF) {
        count = 1;
        offset = 0xC0;
      } else if(codePoint <= 0xFFFF) {
        count = 2;
        offset = 0xE0;
      } else if(codePoint <= 0x10FFFF) {
        count = 3;
        offset = 0xF0;
        i++;
      }
      bytes.push((codePoint >> (6 * count)) + offset);
      while (count > 0) {
        bytes.push(0x80 | (codePoint >> (6 * (count - 1)) & 0x3F));
        count--;
      }
    }
  }
  return bytes;
}

/**
 * Write a string of UTF-8 characters to a byte buffer.
 * @param {string} str The string to pack.
 * @param {!Uint8Array|!Array<number>} buffer The output buffer.
 * @param {number=} index The index to write in the buffer.
 * @return {number} The next index to write in the buffer.
 * @throws {Error} If a character in the string is not valid ASCII.
 */
function packStringTo(str, buffer, index=0) {
  /** @type {!Array<!number>} */
  let bytes = packString(str);
  for (let i = 0; i < bytes.length; i++) {
    buffer[index++] = bytes[i];
  }
  return index;
}

/**
 * Pack a number to a byte buffer.
 * @param {number} value The value.
 * @param {!Object} theType The type definition.
 * @param {!Uint8Array|!Array<number>} buffer The output buffer.
 * @param {number=} index The index to write.
 * @return {number} The next index to write.
 * @throws {Error} If the type definition is not valid.
 * @throws {Error} If the value is not valid.
 */
function packTo(value, theType, buffer, index=0) {
  setUp_(theType);
  return writeBytes_(value,
    theType,
    buffer,
    index,
    index + theType.offset);
}

/**
 * Unpack a number from a byte buffer.
 * @param {!Uint8Array|!Array<!number>} buffer The byte buffer.
 * @param {!Object} theType The type definition.
 * @param {number=} index The buffer index to read.
 * @return {number|undefined}
 * @throws {Error} If the type definition is not valid
 */
function unpack(buffer, theType, index=0) {
  setUp_(theType);
  if ((theType.offset + index) > buffer.length) {
    throw Error('Bad buffer length.');
  }
  if (theType.be) {
    endianness(buffer, theType.offset, index, index + theType.offset);
  }
  /** @type {number} */
  let value = reader_(buffer, index);
  if (theType.be) {
    endianness(buffer, theType.offset, index, index + theType.offset);
  }
  return value;
}

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
 * @type {string}
 * @private
 */
const RANGE_EROR = "Range error";

/**
 * A class to read and write to buffers.
 */
class MiniBuffer {
  
  constructor() {
    /**
     * @type {number}
     */
    this.head = 0;
  }

  /**
   * Set the MiniBuffer head to zero.
   */
  clear() {
    this.head = 0;
  }

  /**
   * Read a number from a buffer.
   * @param {!Uint8Array} buffer The buffer.
   * @param {!Object} typeDefinition The type definition.
   * @param {?number=} index The index to read.
   * @return {number|undefined} The number.
   * @throws {Error} If word size + index > buffer.length
   */
  read(buffer, typeDefinition, index=null) {
    index = index === null ? this.head : index;
    /** @type {number} */
    let size = typeDefinition.bits / 8;
    if (index + size > buffer.length) {
      throw new Error(RANGE_EROR);
    }
    /** @type {number|undefined} */
    let num = unpack(buffer, typeDefinition, index);
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
   * Read a UTF-8 string from a buffer.
   * @param {!Uint8Array} buffer The buffer.
   * @param {number} size the max size of the string.
   * @param {?number=} index The buffer index to read.
   * @return {string} The string.
   * @throws {Error} If size + index > buffer.length
   */
  readStr(buffer, size, index=null) {
    index = index === null ? this.head : index;
    size = index + size;
    let zstr = size === -1 ? true : false;
    size = zstr ? buffer.length : size;
    if (size > buffer.length) {
      throw new Error(RANGE_EROR);
    }
    /** @type {string} */
    let str = '';
    for (; index<size; index++) {
      if (buffer[index] === 0) {
        break;
      }
      str += unpackString(buffer, index, 1);
    }
    this.head = index;
    return str;
  }

  /**
   * Write a UTF-8 string to a buffer. If the string is smaller
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

module.exports = MiniBuffer;
module.exports.default = MiniBuffer;
