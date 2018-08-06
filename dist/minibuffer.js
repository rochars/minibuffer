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

/** @module endianness */

/**
 * Swap the byte ordering in a buffer. The buffer is modified in place.
 * @param {!Array|!Uint8Array} bytes The bytes.
 * @param {number} offset The byte offset.
 * @param {number=} start The start index. Assumes 0.
 * @param {number=} end The end index. Assumes the buffer length.
 * @throws {Error} If the buffer length is not valid.
 */
function endianness(bytes, offset, start=0, end=bytes.length) {
  if (end % offset) {
    throw new Error("Bad buffer length.");
  }
  for (let index = start; index < end; index += offset) {
    swap(bytes, offset, index);
  }
}

/**
 * Swap the byte order of a value in a buffer. The buffer is modified in place.
 * @param {!Array|!Uint8Array} bytes The bytes.
 * @param {number} offset The byte offset.
 * @param {number} index The start index.
 * @private
 */
function swap(bytes, offset, index) {
  offset--;
  for(let x = 0; x < offset; x++) {
    /** @type {*} */
    let theByte = bytes[index + x];
    bytes[index + x] = bytes[index + offset];
    bytes[index + offset] = theByte;
    offset--;
  }
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
 * @fileoverview Functions to serialize and deserialize UTF-8 strings.
 * @see https://github.com/rochars/utf8-buffer
 * @see https://encoding.spec.whatwg.org/#the-encoding
 * @see https://encoding.spec.whatwg.org/#utf-8-encoder
 */

/** @module utf8-buffer */

/**
 * Read a string of UTF-8 characters from a byte buffer.
 * Invalid characters are replaced with 'REPLACEMENT CHARACTER' (U+FFFD).
 * @see https://encoding.spec.whatwg.org/#the-encoding
 * @see https://stackoverflow.com/a/34926911
 * @param {!Uint8Array|!Array<number>} buffer A byte buffer.
 * @param {number=} start The buffer index to start reading.
 * @param {?number=} end The buffer index to stop reading.
 *   Assumes the buffer length if undefined.
 * @return {string}
 */
function unpack(buffer, start=0, end=buffer.length) {
  /** @type {string} */
  let str = "";
  for(let index = start; index < end;) {
    /** @type {number} */
    let lowerBoundary = 0x80;
    /** @type {number} */
    let upperBoundary = 0xBF;
    /** @type {boolean} */
    let replace = false;
    /** @type {number} */
    let charCode = buffer[index++];
    if (charCode >= 0x00 && charCode <= 0x7F) {
      str += String.fromCharCode(charCode);
    } else {
      /** @type {number} */
      let count = 0;
      if (charCode >= 0xC2 && charCode <= 0xDF) {
        count = 1;
      } else if (charCode >= 0xE0 && charCode <= 0xEF ) {
        count = 2;
        if (buffer[index] === 0xE0) {
          lowerBoundary = 0xA0;
        }
        if (buffer[index] === 0xED) {
          upperBoundary = 0x9F;
        }
      } else if (charCode >= 0xF0 && charCode <= 0xF4 ) {
        count = 3;
        if (buffer[index] === 0xF0) {
          lowerBoundary = 0x90;
        }
        if (buffer[index] === 0xF4) {
          upperBoundary = 0x8F;
        }
      } else {
        replace = true;
      }
      charCode = charCode & (1 << (8 - count - 1)) - 1;
      for (let i = 0; i < count; i++) {
        if (buffer[index] < lowerBoundary || buffer[index] > upperBoundary) {
          replace = true;
        }
        charCode = (charCode << 6) | (buffer[index] & 0x3f);
        index++;
      }
      if (replace) {
        str += String.fromCharCode(0xFFFD);
      } 
      else if (charCode <= 0xffff) {
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
 * Write a string of UTF-8 characters to a byte buffer.
 * @see https://encoding.spec.whatwg.org/#utf-8-encoder
 * @param {string} str The string to pack.
 * @param {!Uint8Array|!Array<number>} buffer The buffer to pack the string to.
 * @param {number=} index The buffer index to start writing.
 * @return {number} The next index to write in the buffer.
 */
function pack(str, buffer, index=0) {
  for (let i = 0, len = str.length; i < len; i++) {
    /** @type {number} */
    let codePoint = str.codePointAt(i);
    if (codePoint < 128) {
      buffer[index] = codePoint;
      index++;
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
      buffer[index] = (codePoint >> (6 * count)) + offset;
      index++;
      while (count > 0) {
        buffer[index] = 0x80 | (codePoint >> (6 * (count - 1)) & 0x3F);
        index++;
        count--;
      }
    }
  }
  return index;
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

const TYPE_ERR = 'Unsupported type';

/**
 * Validate that the value is not null or undefined.
 * @param {*} value The value.y.
 * @throws {Error} If the value is not Number or Boolean.
 * @throws {Error} If the value is NaN, Infinity or -Infinity.
 */
function validateIsInt(value) {
  validateIsNumber(value);
  if (value !== value || value === Infinity || value === -Infinity) {
    throwValueErr_('integer');
  }
}

/**
 * Validate that the value is not null or undefined.
 * @param {*} value The value.
 * @throws {Error} If the value is not Number or Boolean.
 */
function validateIsNumber(value) {
  if (value === undefined || value === null) {
    throwValueErr_();
  }
  if (value.constructor != Number && value.constructor != Boolean) {
    throwValueErr_();
  }
}

/**
 * Validate the type definition of floating-point numbers.
 * @param {number} bits The number of bits.
 * @throws {Error} If the type definition is not valid.
 * @private
 */
function validateFloatType(bits) {
  if (!bits || bits !== 16 && bits !== 32 && bits !== 64) {
    throw new Error(TYPE_ERR + ': float, bits: ' + bits);
  }
}

/**
 * Validate the type definition of integers.
 * @param {number} bits The number of bits.
 * @throws {Error} If the type definition is not valid.
 * @private
 */
function validateIntType(bits) {
  if (!bits || bits < 1 || bits > 53) {
    throw new Error(TYPE_ERR + ': int, bits: ' + bits);
  }
}

/**
 * Throw a error about the input value.
 * @param {string} theType The name of the type the value was expected to be.
 * @throws {Error} Always when called.
 * @private
 */
function throwValueErr_(theType='valid number') {
  throw new Error('Argument is not a ' + theType);
}

/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 * Copyright (c) 2013 DeNA Co., Ltd.
 * Copyright (c) 2010, Linden Research, Inc
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
 * @fileoverview Encode and decode IEEE 754 floating point numbers.
 * @see https://github.com/rochars/ieee754-buffer
 * @see https://bitbucket.org/lindenlab/llsd/raw/7d2646cd3f9b4c806e73aebc4b32bd81e4047fdc/js/typedarray.js
 * @see https://github.com/kazuho/ieee754.js/blob/master/ieee754.js
 */

/** 
 * @module IEEE754Buffer
 * @ignore
 */

/**
 * A class to encode and decode IEEE 754 floating-point numbers.
 */
class IEEE754Buffer {

  /**
   * Pack a IEEE 754 floating point number.
   * @param {number} ebits The exponent bits.
   * @param {number} fbits The fraction bits.
   */
  constructor(ebits, fbits) {
    this.ebits = ebits;
    this.fbits = fbits;
    this.bias = (1 << (ebits - 1)) - 1;
    this.numBytes = Math.ceil((ebits + fbits) / 8);
    this.biasP2 = Math.pow(2, this.bias + 1);
    this.ebitsFbits = (ebits + fbits);
    this.fbias = Math.pow(2, -(8 * this.numBytes - 1 - ebits));
  }

  /**
   * Pack a IEEE 754 floating point number.
   * @param {!Uint8Array|!Array<number>} buffer The buffer.
   * @param {number} num The number.
   * @param {number} index The index to write on the buffer.
   * @return {number} The next index to write on the buffer.
   */
  pack(buffer, num, index) {
    // Round overflows
    if (Math.abs(num) > this.biasP2 - (this.ebitsFbits * 2)) {
      num = num < 0 ? -Infinity : Infinity;
    }
    /**
     * sign, need this to handle negative zero
     * @see http://cwestblog.com/2014/02/25/javascript-testing-for-negative-zero/
     * @type {number}
     */
    let sign = (((num = +num) || 1 / num) < 0) ? 1 : num < 0 ? 1 : 0;
    num = Math.abs(num);
    /** @type {number} */
    let exp = Math.min(Math.floor(Math.log(num) / Math.LN2), 1023);
    /** @type {number} */
    let fraction = this.roundToEven(num / Math.pow(2, exp) * Math.pow(2, this.fbits));
    // NaN
    if (num !== num) {
      fraction = Math.pow(2, this.fbits - 1);
      exp = (1 << this.ebits) - 1;
    // Number
    } else if (num !== 0) {
      if (num >= Math.pow(2, 1 - this.bias)) {
        if (fraction / Math.pow(2, this.fbits) >= 2) {
          exp = exp + 1;
          fraction = 1;
        }
        // Overflow
        if (exp > this.bias) {
          exp = (1 << this.ebits) - 1;
          fraction = 0;
        } else {
          exp = exp + this.bias;
          fraction = this.roundToEven(fraction) - Math.pow(2, this.fbits);
        }
      } else {
        fraction = this.roundToEven(num / Math.pow(2, 1 - this.bias - this.fbits));
        exp = 0;
      } 
    }
    return this.packFloatBits_(buffer, index, sign, exp, fraction);
  }

  /**
   * Unpack a IEEE 754 floating point number.
   * Derived from IEEE754 by DeNA Co., Ltd., MIT License. 
   * Adapted to handle NaN. Should port the solution to the original repo.
   * @param {!Uint8Array|!Array<number>} buffer The buffer.
   * @param {number} index The index to read from the buffer.
   * @return {number} The floating point number.
   */
  unpack(buffer, index) {
    /** @type {number} */
    let eMax = (1 << this.ebits) - 1;
    /** @type {number} */
    let significand;
    /** @type {string} */
    let leftBits = "";
    for (let i = this.numBytes - 1; i >= 0 ; i--) {
      /** @type {string} */
      let t = buffer[i + index].toString(2);
      leftBits += "00000000".substring(t.length) + t;
    }
    /** @type {number} */
    let sign = leftBits.charAt(0) == "1" ? -1 : 1;
    leftBits = leftBits.substring(1);
    /** @type {number} */
    let exponent = parseInt(leftBits.substring(0, this.ebits), 2);
    leftBits = leftBits.substring(this.ebits);
    if (exponent == eMax) {
      if (parseInt(leftBits, 2) !== 0) {
        return NaN;
      }
      return sign * Infinity;  
    } else if (exponent === 0) {
      exponent += 1;
      significand = parseInt(leftBits, 2);
    } else {
      significand = parseInt("1" + leftBits, 2);
    }
    return sign * significand * this.fbias * Math.pow(2, exponent - this.bias);
  }

  /**
   * Pack a IEEE754 from its sign, exponent and fraction bits
   * and place it in a byte buffer.
   * @param {!Uint8Array|!Array<number>} buffer The byte buffer to write to.
   * @param {number} index The buffer index to write.
   * @param {number} sign The sign.
   * @param {number} exp the exponent.
   * @param {number} fraction The fraction.
   * @return {number}
   * @private
   */
  packFloatBits_(buffer, index, sign, exp, fraction) {
    /** @type {!Array<number>} */
    let bits = [];
    // the sign
    bits.push(sign);
    // the exponent
    for (let i = this.ebits; i > 0; i -= 1) {
      bits[i] = (exp % 2 ? 1 : 0);
      exp = Math.floor(exp / 2);
    }
    // the fraction
    let len = bits.length;
    for (let i = this.fbits; i > 0; i -= 1) {
      bits[len + i] = (fraction % 2 ? 1 : 0);
      fraction = Math.floor(fraction / 2);
    }
    // pack as bytes
    /** @type {string} */
    let str = bits.join('');
    /** @type {number} */
    let numBytes = this.numBytes + index - 1;
    /** @type {number} */
    let k = index;
    while (numBytes >= index) {
      buffer[numBytes] = parseInt(str.substring(0, 8), 2);
      str = str.substring(8);
      numBytes--;
      k++;
    }
    return k;
  }

  roundToEven(n) {
    var w = Math.floor(n), f = n - w;
    if (f < 0.5) {
      return w;
    }
    if (f > 0.5) {
      return w + 1;
    }
    return w % 2 ? w + 1 : w;
  }
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
 * @fileoverview Pack and unpack unsigned ints.
 * @see https://github.com/rochars/uint-buffer
 */

/**
 * @module UintBuffer
 * @ignore
 */

/**
 * A class to write and read unsigned ints to and from byte buffers.
 */
class UintBuffer {
  
  /**
   * @param {number} bits The number of bits used by the integer.
   */
  constructor(bits) {
    /**
     * The number of bits used by one number.
     * @type {number}
     */
    this.bits = bits;
    /**
     * The number of bytes used by one number.
     * @type {number}
     */
    this.bytes = bits < 8 ? 1 : Math.ceil(bits / 8);
    /**
     * @type {number}
     * @protected
     */
    this.max = Math.pow(2, bits) - 1;
    /**
     * @type {number}
     * @protected
     */
    this.min = 0;
    /** @type {number} */
    let r = 8 - ((((bits - 1) | 7) + 1) - bits);
    /**
     * @type {number}
     * @private
     */
    this.lastByteMask_ = Math.pow(2, r > 0 ? r : 8) - 1;
  }

  /**
   * Write one unsigned integer to a byte buffer.
   * @param {!Uint8Array|!Array<number>} buffer An array of bytes.
   * @param {number} num The number.
   * @param {number=} index The index being written in the byte buffer.
   * @return {number} The next index to write on the byte buffer.
   * @throws {Error} If num is NaN.
   * @throws {Error} On overflow.
   */
  pack(buffer, num, index=0) {
    if (num !== num) {
      throw new Error('NaN');
    }
    this.overflow(num);
    buffer[index] = (num < 0 ? num + Math.pow(2, this.bits) : num) & 255;
    index++;
    /** @type {number} */
    let len = this.bytes;
    for (let i = 2; i < len; i++) {
      buffer[index] = Math.floor(num / Math.pow(2, ((i - 1) * 8))) & 255;
      index++;
    }
    if (this.bits > 8) {
      buffer[index] = Math.floor(
          num / Math.pow(2, ((this.bytes - 1) * 8))) & this.lastByteMask_;
      index++;
    }
    return index;
  }
  
  /**
   * Read one unsigned integer from a byte buffer.
   * @param {!Uint8Array|!Array<number>} buffer An array of bytes.
   * @param {number=} index The index to read.
   * @return {number} The number.
   * @throws {Error} On overflow.
   */
  unpack(buffer, index=0) {
    /** @type {number} */
    let num = this.unpackUnsafe(buffer, index);
    this.overflow(num);
    return num; 
  }

  /**
   * Read one unsigned integer from a byte buffer.
   * Does not check for overflows.
   * @param {!Uint8Array|!Array<number>} buffer An array of bytes.
   * @param {number} index The index to read.
   * @return {number}
   * @protected
   */
  unpackUnsafe(buffer, index) {
    /** @type {number} */
    let num = 0;
    for(let x = 0; x < this.bytes; x++) {
      num += buffer[index + x] * Math.pow(256, x);
    }
    return num;
  }

  /**
   * Throws error in case of overflow.
   * @param {number} num The number.
   * @throws {Error} on overflow.
   * @protected
   */
  overflow(num) {
    if (num > this.max || num < this.min) {
      throw new Error('Overflow');
    }
  }
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
 * A class to write and read two's complement signed integers
 * to and from byte buffers.
 * @extends UintBuffer
 */
class TwosComplementBuffer extends UintBuffer {
  
  /**
   * @param {number} bits The number of bits used by the integer.
   */
  constructor(bits) {
    super(bits);
    /**
     * @type {number}
     * @protected
     */
    this.max = Math.pow(2, this.bits) / 2 - 1;
    /**
     * @type {number}
     * @protected
     */
    this.min = -this.max - 1;
  }

  /**
   * Write one two's complement signed integer to a byte buffer.
   * @param {!Uint8Array|!Array<number>} buffer An array of bytes.
   * @param {number} num The number.
   * @param {number=} index The index being written in the byte buffer.
   * @return {number} The next index to write on the byte buffer.
   * @throws {Error} If num is NaN.
   * @throws {Error} On overflow.
   */
  pack(buffer, num, index=0) {
    return super.pack(buffer, num, index);
  }

  /**
   * Read one two's complement signed integer from a byte buffer.
   * @param {!Uint8Array|!Array<number>} buffer An array of bytes.
   * @param {number=} index The index to read.
   * @return {number}
   * @throws {Error} On overflow.
   */
  unpack(buffer, index=0) {
    /** @type {number} */
    let num = super.unpackUnsafe(buffer, index);
    num = this.sign_(num);
    this.overflow(num);
    return num; 
  }

  /**
   * Sign a number.
   * @param {number} num The number.
   * @return {number}
   * @private
   */
  sign_(num) {
    if (num > this.max) {
      num -= (this.max * 2) + 2;
    }
    return num;
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
 * A class to pack and unpack integers and floating-point numbers.
 * Signed integers are two's complement.
 * Floating-point numbers are IEEE 754 standard.
 */
class NumberBuffer {
  
  /**
   * Read one number from a byte buffer.
   * @param {number} bits The number of bits of the number.
   * @param {boolean} fp Tue for floating-point numbers.
   * @param {boolean} signed True for signed numbers.
   * @throws {Error} If the type definition is not valid.
   */
  constructor(bits, fp, signed) {
    /** @type {TwosComplementBuffer|UintBuffer|IEEE754Buffer} */
    this.parser = null;
    if (fp) {
      validateFloatType(bits);
      this.parser = this.getFPParser_(bits);
    } else {
      validateIntType(bits);
      this.parser = signed ?
        new TwosComplementBuffer(bits) : new UintBuffer(bits);
      this.parser.bytes = this.parser.bytes === 8 ? 4 : this.parser.bytes;
    }
  }

  /**
   * Read one number from a byte buffer.
   * @param {!Uint8Array|!Array<number>} buffer An array of bytes.
   * @param {number=} index The index to read.
   * @return {number} The number.
   * @throws {Error} On overflow.
   */
  unpack(buffer, index=0) {
    return this.parser.unpack(buffer, index);
  }

  /**
   * Write one number to a byte buffer.
   * @param {!Uint8Array|!Array<number>} buffer An array of bytes.
   * @param {number} num The number.
   * @param {number=} index The index being written in the byte buffer.
   * @return {number} The next index to write on the byte buffer.
   * @throws {Error} If num is NaN.
   * @throws {Error} On overflow.
   */
  pack(buffer, num, index=0) {
    return this.parser.pack(buffer, num, index);
  }

  /**
   * Return a instance of IEEE754Buffer.
   * @param {number} bits The number of bits.
   * @return {IEEE754Buffer}
   * @private
   */
  getFPParser_(bits) {
    if (bits === 16) {
      return new IEEE754Buffer(5, 11);
    } else if(bits === 32) {
      return new IEEE754Buffer(8, 23);
    } else {
      return new IEEE754Buffer(11, 52);
    }
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
 * @param {!Uint8Array|!Array<number>} buffer A byte buffer.
 * @param {number=} index The buffer index to start reading.
 * @param {number=} end The buffer index to stop reading, non inclusive.
 *   Assumes buffer length if undefined.
 * @return {string}
 */
function unpackString(buffer, index=0, end=buffer.length) {
  return unpack(buffer, index, end);
}

/**
 * Write a string of UTF-8 characters as a byte buffer.
 * @param {string} str The string to pack.
 * @return {!Array<number>} The UTF-8 string bytes.
 */ 
function packString(str) {
  /** @type {!Array<number>} */
  let buffer = [];
  pack(str, buffer, 0);
  return buffer;
}

/**
 * Write a string of UTF-8 characters to a byte buffer.
 * @param {string} str The string to pack.
 * @param {!Uint8Array|!Array<number>} buffer The output buffer.
 * @param {number=} index The buffer index to start writing.
 *   Assumes zero if undefined.
 * @return {number} The next index to write in the buffer.
 */
function packStringTo(str, buffer, index=0) {
  return pack(str, buffer, index);
}

// Numbers
/**
 * Pack a number as a byte buffer.
 * @param {number} value The number.
 * @param {!Object} theType The type definition.
 * @return {!Array<number>} The packed value.
 * @throws {Error} If the type definition is not valid.
 * @throws {Error} If the value is not valid.
 */
function pack$1(value, theType) {
  /** @type {!Array<number>} */
  let output = [];
  packTo(value, theType, output);
  return output;
}

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
function packTo(value, theType, buffer, index=0) {
  return packArrayTo([value], theType, buffer, index);
}

/**
 * Pack an array of numbers as a byte buffer.
 * @param {!Array<number>|!TypedArray} values The values.
 * @param {!Object} theType The type definition.
 * @return {!Array<number>} The packed values.
 * @throws {Error} If the type definition is not valid.
 * @throws {Error} If any of the values are not valid.
 */
function packArray(values, theType) {
  /** @type {!Array<number>} */
  let output = [];
  packArrayTo(values, theType, output);
  return output;
}

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
function packArrayTo(values, theType, buffer, index=0) {
  theType = theType || {};
  /** @type {NumberBuffer} */
  let packer = new NumberBuffer(
    theType.bits, theType.fp, theType.signed);
  /** @type {number} */
  let offset = offset_(theType.bits);
  /** @type {Function} */
  let validateInput = theType.fp ? validateIsNumber : validateIsInt;
  /** @type {number} */
  let i = 0;
  try {
    for (let valuesLen = values.length; i < valuesLen; i++) {
      validateInput(values[i]);
      /** @type {number} */
      let len = index + offset;
      while (index < len) {
        index = packer.pack(buffer, values[i], index);
      }
      swap_(theType.be, buffer, offset, index - offset, index);
    }
  } catch (e) {
    throw new Error(e.message + ' at input index ' + i);
  }
  return index;
}

/**
 * Unpack a number from a byte buffer.
 * @param {!Uint8Array|!Array<number>} buffer The byte buffer.
 * @param {!Object} theType The type definition.
 * @param {number=} index The buffer index to read. Assumes zero if undefined.
 * @return {number}
 * @throws {Error} If the type definition is not valid
 * @throws {Error} On bad buffer length.
 * @throws {Error} On overflow
 */
function unpack$1(buffer, theType, index=0) {
  return unpackArray(
    buffer, theType, index, index + offset_(theType.bits), true)[0];
}

/**
 * Unpack an array of numbers from a byte buffer.
 * @param {!Uint8Array|!Array<number>} buffer The byte buffer.
 * @param {!Object} theType The type definition.
 * @param {number=} start The buffer index to start reading.
 *   Assumes zero if undefined.
 * @param {number=} end The buffer index to stop reading.
 *   Assumes the buffer length if undefined.
 * @param {boolean=} safe If set to false, extra bytes in the end of
 *   the array are ignored and input buffers with insufficient bytes will
 *   output a empty array. If safe is set to true the function
 *   will throw a 'Bad buffer length' error. Defaults to false.
 * @return {!Array<number>}
 * @throws {Error} If the type definition is not valid
 * @throws {Error} On overflow
 */
function unpackArray(
    buffer, theType, start=0, end=buffer.length, safe=false) {
  /** @type {!Array<number>} */
  let output = [];
  unpackArrayTo(buffer, theType, output, start, end, safe);
  return output;
}

/**
 * Unpack a array of numbers to a typed array.
 * @param {!Uint8Array|!Array<number>} buffer The byte buffer.
 * @param {!Object} theType The type definition.
 * @param {!TypedArray|!Array<number>} output The output array.
 * @param {number=} start The buffer index to start reading.
 *   Assumes zero if undefined.
 * @param {number=} end The buffer index to stop reading.
 *   Assumes the buffer length if undefined.
 * @param {boolean=} safe If set to false, extra bytes in the end of
 *   the array are ignored and input buffers with insufficient bytes will
 *   write nothing to the output array. If safe is set to true the function
 *   will throw a 'Bad buffer length' error. Defaults to false.
 * @throws {Error} If the type definition is not valid
 * @throws {Error} On overflow
 */
function unpackArrayTo(
    buffer, theType, output, start=0, end=buffer.length, safe=false) {
  theType = theType || {};
  /** @type {NumberBuffer} */
  let packer = new NumberBuffer(
    theType.bits, theType.fp, theType.signed);
  /** @type {number} */
  let offset = offset_(theType.bits);
  /** @type {number} */
  let extra = (end - start) % offset;
  if (safe && (extra || buffer.length < offset)) {
    throw new Error('Bad buffer length');
  }
  end -= extra;
  /** @type {number} */
  let i = 0;
  try {
    swap_(theType.be, buffer, offset, start, end);
    for (let j = start; j < end; j += offset, i++) {
      output[i] = packer.unpack(buffer, j);
    }
    swap_(theType.be, buffer, offset, start, end);
  } catch (e) {
    throw new Error(e.message + ' at output index ' + i);
  }
}

/**
 * Swap endianness in a slice of an array when flip == true.
 * @param {boolean} flip True if should swap endianness.
 * @param {!Uint8Array|!Array<number>} buffer The buffer.
 * @param {number} offset The number of bytes each value use.
 * @param {number} start The buffer index to start the swap.
 * @param {number} end The buffer index to end the swap.
 * @throws {Error} On bad buffer length for the swap.
 * @private
 */
function swap_(flip, buffer, offset, start, end) {
  if (flip) {
    endianness(buffer, offset, start, end);
  }
}

/**
 * Get the byte offset of a type based on its number of bits.
 * @param {number} bits The number of bits.
 * @private
 */
function offset_(bits) {
  return bits < 8 ? 1 : Math.ceil(bits / 8);
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
 * Read a string of UTF-8 characters from a byte buffer.
 * @param {!Uint8Array|!Array<number>} buffer A byte buffer.
 * @param {number=} index The buffer index to start reading.
 * @param {number=} end The buffer index to stop reading, non inclusive.
 *   Assumes buffer length if undefined.
 * @return {string}
 */
function unpackString$1(buffer, index=0, end=buffer.length) {
  return unpackString(buffer, index, end);
}

/**
 * Write a string of UTF-8 characters as a byte buffer.
 * @param {string} str The string to pack.
 * @return {!Array<number>} The UTF-8 string bytes.
 */ 
function packString$1(str) {
  return packString(str);
}

/**
 * Write a string of UTF-8 characters to a byte buffer.
 * @param {string} str The string to pack.
 * @param {!Uint8Array|!Array<number>} buffer The output buffer.
 * @param {number=} index The buffer index to start writing.
 *   Assumes zero if undefined.
 * @return {number} The next index to write in the buffer.
 */
function packStringTo$1(str, buffer, index=0) {
  return packStringTo(str, buffer, index);
}

// Numbers
/**
 * Pack a number as a byte buffer.
 * @param {number} value The number.
 * @param {!Object} theType The type definition.
 * @return {!Array<number>} The packed value.
 * @throws {Error} If the type definition is not valid.
 * @throws {Error} If the value is not valid.
 */
function pack$2(value, theType) {
  return pack$1(value, theType);
}

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
function packTo$1(value, theType, buffer, index=0) {
  return packTo(value, theType, buffer, index);
}

/**
 * Pack an array of numbers as a byte buffer.
 * @param {!Array<number>|!TypedArray} values The values.
 * @param {!Object} theType The type definition.
 * @return {!Array<number>} The packed values.
 * @throws {Error} If the type definition is not valid.
 * @throws {Error} If any of the values are not valid.
 */
function packArray$1(values, theType) {
  return packArray(values, theType);
}

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
function packArrayTo$1(values, theType, buffer, index=0) {
  return packArrayTo(values, theType, buffer, index);
}

/**
 * Unpack a number from a byte buffer.
 * @param {!Uint8Array|!Array<number>} buffer The byte buffer.
 * @param {!Object} theType The type definition.
 * @param {number=} index The buffer index to read. Assumes zero if undefined.
 * @return {number}
 * @throws {Error} If the type definition is not valid
 * @throws {Error} On bad buffer length.
 * @throws {Error} On overflow
 */
function unpack$2(buffer, theType, index=0) {
  return unpack$1(buffer, theType, index);
}

/**
 * Unpack an array of numbers from a byte buffer.
 * @param {!Uint8Array|!Array<number>} buffer The byte buffer.
 * @param {!Object} theType The type definition.
 * @param {number=} start The buffer index to start reading.
 *   Assumes zero if undefined.
 * @param {number=} end The buffer index to stop reading.
 *   Assumes the buffer length if undefined.
 * @param {boolean=} safe If set to false, extra bytes in the end of
 *   the array are ignored and input buffers with insufficient bytes will
 *   output a empty array. If safe is set to true the function
 *   will throw a 'Bad buffer length' error. Defaults to false.
 * @return {!Array<number>}
 * @throws {Error} If the type definition is not valid
 * @throws {Error} On overflow
 */
function unpackArray$1(
    buffer, theType, start=0, end=buffer.length, safe=false) {
  return unpackArray(buffer, theType, start, end, safe);
}

/**
 * Unpack a array of numbers to a typed array.
 * @param {!Uint8Array|!Array<number>} buffer The byte buffer.
 * @param {!Object} theType The type definition.
 * @param {!TypedArray|!Array<number>} output The output array.
 * @param {number=} start The buffer index to start reading.
 *   Assumes zero if undefined.
 * @param {number=} end The buffer index to stop reading.
 *   Assumes the buffer length if undefined.
 * @param {boolean=} safe If set to false, extra bytes in the end of
 *   the array are ignored and input buffers with insufficient bytes will
 *   write nothing to the output array. If safe is set to true the function
 *   will throw a 'Bad buffer length' error. Defaults to false.
 * @throws {Error} If the type definition is not valid
 * @throws {Error} On overflow
 */
function unpackArrayTo$1(
    buffer, theType, output, start=0, end=buffer.length, safe=false) {
  unpackArrayTo(buffer, theType, output, start, end, safe);
}

export { unpackString$1 as unpackString, packString$1 as packString, packStringTo$1 as packStringTo, pack$2 as pack, packTo$1 as packTo, packArray$1 as packArray, packArrayTo$1 as packArrayTo, unpack$2 as unpack, unpackArray$1 as unpackArray, unpackArrayTo$1 as unpackArrayTo };
