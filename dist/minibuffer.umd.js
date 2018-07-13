(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.MiniBuffer = factory());
}(this, (function () { 'use strict';

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
  function endianness(bytes, offset) {
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : bytes.length;

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
    for (var x = 0; x < offset; x++) {
      /** @type {number|string} */
      var theByte = bytes[index + x];
      bytes[index + x] = bytes[index + offset];
      bytes[index + offset] = theByte;
      offset--;
    }
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

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
  var Integer = function () {

    /**
     * @param {number} bits Number of bits used by the data.
     * @param {boolean} signed True for signed types.
     * @throws {Error} if the number of bits is smaller than 1 or greater than 64.
     */
    function Integer(bits, signed) {
      classCallCheck(this, Integer);

      /**
       * The max number of bits used by the data.
       * @type {number}
       * @private
       */
      this.bits = bits;
      /**
       * If this type it is signed or not.
       * @type {boolean}
       * @private
       */
      this.signed = signed;
      /**
       * The number of bytes used by the data.
       * @type {number}
       * @private
       */
      this.offset = 0;
      /**
       * Min value for numbers of this type.
       * @type {number}
       * @private
       */
      this.min = -Infinity;
      /**
       * Max value for numbers of this type.
       * @type {number}
       * @private
       */
      this.max = Infinity;
      /**
       * The practical number of bits used by the data.
       * @type {number}
       * @private
       */
      this.realBits_ = this.bits;
      /**
       * The mask to be used in the last byte.
       * @type {number}
       * @private
       */
      this.lastByteMask_ = 255;
      this.build_();
    }

    /**
     * Read one integer number from a byte buffer.
     * @param {!Uint8Array} bytes An array of bytes.
     * @param {number=} i The index to read.
     * @return {number}
     */


    createClass(Integer, [{
      key: 'read',
      value: function read(bytes) {
        var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var num = 0;
        var x = this.offset - 1;
        while (x > 0) {
          num = bytes[x + i] << x * 8 | num;
          x--;
        }
        num = (bytes[i] | num) >>> 0;
        return this.overflow_(this.sign_(num));
      }

      /**
       * Write one integer number to a byte buffer.
       * @param {!Array<number>} bytes An array of bytes.
       * @param {number} number The number.
       * @param {number=} j The index being written in the byte buffer.
       * @return {number} The next index to write on the byte buffer.
       */

    }, {
      key: 'write',
      value: function write(bytes, number) {
        var j = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        number = this.overflow_(number);
        bytes[j++] = number & 255;
        for (var i = 2; i <= this.offset; i++) {
          bytes[j++] = Math.floor(number / Math.pow(2, (i - 1) * 8)) & 255;
        }
        return j;
      }

      /**
       * Write one integer number to a byte buffer.
       * @param {!Array<number>} bytes An array of bytes.
       * @param {number} number The number.
       * @param {number=} j The index being written in the byte buffer.
       * @return {number} The next index to write on the byte buffer.
       * @private
       */

    }, {
      key: 'writeEsoteric_',
      value: function writeEsoteric_(bytes, number) {
        var j = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        number = this.overflow_(number);
        j = this.writeFirstByte_(bytes, number, j);
        for (var i = 2; i < this.offset; i++) {
          bytes[j++] = Math.floor(number / Math.pow(2, (i - 1) * 8)) & 255;
        }
        if (this.bits > 8) {
          bytes[j++] = Math.floor(number / Math.pow(2, (this.offset - 1) * 8)) & this.lastByteMask_;
        }
        return j;
      }

      /**
       * Read a integer number from a byte buffer by turning int bytes
       * to a string of bits. Used for data with more than 32 bits.
       * @param {!Uint8Array} bytes An array of bytes.
       * @param {number=} i The index to read.
       * @return {number}
       * @private
       */

    }, {
      key: 'readBits_',
      value: function readBits_(bytes) {
        var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var binary = '';
        var j = 0;
        while (j < this.offset) {
          var bits = bytes[i + j].toString(2);
          binary = new Array(9 - bits.length).join('0') + bits + binary;
          j++;
        }
        return this.overflow_(this.sign_(parseInt(binary, 2)));
      }

      /**
       * Build the type.
       * @throws {Error} if the number of bits is smaller than 1 or greater than 64.
       * @private
       */

    }, {
      key: 'build_',
      value: function build_() {
        this.setRealBits_();
        this.setLastByteMask_();
        this.setMinMax_();
        this.offset = this.bits < 8 ? 1 : Math.ceil(this.realBits_ / 8);
        if (this.realBits_ != this.bits || this.bits < 8 || this.bits > 32) {
          this.write = this.writeEsoteric_;
          this.read = this.readBits_;
        }
      }

      /**
       * Sign a number.
       * @param {number} num The number.
       * @return {number}
       * @private
       */

    }, {
      key: 'sign_',
      value: function sign_(num) {
        if (num > this.max) {
          num -= this.max * 2 + 2;
        }
        return num;
      }

      /**
       * Limit the value according to the bit depth in case of
       * overflow or underflow.
       * @param {number} value The data.
       * @return {number}
       * @private
       */

    }, {
      key: 'overflow_',
      value: function overflow_(value) {
        if (value > this.max) {
          throw new Error('Overflow.');
        } else if (value < this.min) {
          throw new Error('Underflow.');
        }
        return value;
      }

      /**
       * Set the minimum and maximum values for the type.
       * @private
       */

    }, {
      key: 'setMinMax_',
      value: function setMinMax_() {
        var max = Math.pow(2, this.bits);
        if (this.signed) {
          this.max = max / 2 - 1;
          this.min = -max / 2;
        } else {
          this.max = max - 1;
          this.min = 0;
        }
      }

      /**
       * Set the practical bit number for data with bit count different
       * from the standard types (8, 16, 32, 40, 48, 64) and more than 8 bits.
       * @private
       */

    }, {
      key: 'setRealBits_',
      value: function setRealBits_() {
        if (this.bits > 8) {
          this.realBits_ = (this.bits - 1 | 7) + 1;
        }
      }

      /**
       * Set the mask that should be used when writing the last byte.
       * @private
       */

    }, {
      key: 'setLastByteMask_',
      value: function setLastByteMask_() {
        var r = 8 - (this.realBits_ - this.bits);
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

    }, {
      key: 'writeFirstByte_',
      value: function writeFirstByte_(bytes, number, j) {
        if (this.bits < 8) {
          bytes[j++] = number < 0 ? number + Math.pow(2, this.bits) : number;
        } else {
          bytes[j++] = number & 255;
        }
        return j;
      }
    }]);
    return Integer;
  }();

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

  /**
   * Validate that the code is a valid ASCII code.
   * @param {number} code The code.
   * @throws {Error} If the code is not a valid ASCII code.
   */
  function validateASCIICode(code) {
    if (code > 127) {
      throw new Error('Bad ASCII code.');
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
    if ([16, 32, 64].indexOf(theType.bits) == -1) {
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
  var BE_ENV = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x12;
  var HIGH = BE_ENV ? 1 : 0;
  var LOW = BE_ENV ? 0 : 1;

  /**
   * @type {!Int8Array}
   * @private
   */
  var int8_ = new Int8Array(8);
  /**
   * @type {!Uint32Array}
   * @private
   */
  var ui32_ = new Uint32Array(int8_.buffer);
  /**
   * @type {!Float32Array}
   * @private
   */
  var f32_ = new Float32Array(int8_.buffer);
  /**
   * @type {!Float64Array}
   * @private
   */
  var f64_ = new Float64Array(int8_.buffer);
  /**
   * @type {Function}
   * @private
   */
  var reader_ = void 0;
  /**
   * @type {Function}
   * @private
   */
  var writer_ = void 0;
  /**
   * @type {Object}
   * @private
   */
  var gInt_ = {};

  /**
   * Validate the type and set up the packing/unpacking functions.
   * @param {!Object} theType The type definition.
   * @throws {Error} If the type definition is not valid.
   * @private
   */
  function setUp_(theType) {
    validateType(theType);
    theType.offset = theType.bits < 8 ? 1 : Math.ceil(theType.bits / 8);
    theType.be = theType.be || false;
    setReader(theType);
    setWriter(theType);
    gInt_ = new Integer(theType.bits == 64 ? 32 : theType.bits, theType.float ? false : theType.signed);
  }

  /**
   * Turn numbers to bytes.
   * @param {number} value The value to be packed.
   * @param {!Object} theType The type definition.
   * @param {!Uint8Array|!Array<number>} buffer The buffer to write the bytes to.
   * @param {number} index The index to start writing.
   * @param {number} len The end index.
   * @param {!Function} validate The function used to validate input.
   * @param {boolean} be True if big-endian.
   * @return {number} the new index to be written.
   * @private
   */
  function writeBytes_(value, theType, buffer, index, len, validate, be) {
    while (index < len) {
      validate(value, theType);
      index = writer_(buffer, value, index);
    }
    if (be) {
      endianness(buffer, theType.offset, index - theType.offset, index);
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
    var int = gInt_.read(bytes, i);
    /** @type {number} */
    var exponent = (int & 0x7C00) >> 10;
    /** @type {number} */
    var fraction = int & 0x03FF;
    /** @type {number} */
    var floatValue = void 0;
    if (exponent) {
      floatValue = Math.pow(2, exponent - 15) * (1 + fraction / 0x400);
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
    var x = ui32_[0];
    /** @type {number} */
    var bits = x >> 16 & 0x8000;
    /** @type {number} */
    var m = x >> 12 & 0x07ff;
    /** @type {number} */
    var e = x >> 23 & 0xff;
    if (e >= 103) {
      bits |= e - 112 << 10 | m >> 1;
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
      } else if (theType.bits == 32) {
        reader_ = read32F_;
      } else if (theType.bits == 64) {
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
      } else if (theType.bits == 32) {
        writer_ = write32F_;
      } else if (theType.bits == 64) {
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

  // ASCII characters
  /**
   * Read a string of ASCII characters from a byte buffer.
   * @param {!Uint8Array} bytes A byte buffer.
   * @param {number=} index The index to read.
   * @param {?number=} len The number of bytes to read.
   * @return {string}
   * @throws {Error} If a character in the string is not valid ASCII.
   */
  function unpackString(bytes) {
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var chrs = '';
    len = len ? index + len : bytes.length;
    while (index < len) {
      validateASCIICode(bytes[index]);
      chrs += String.fromCharCode(bytes[index]);
      index++;
    }
    return chrs;
  }

  /**
   * Write a string of ASCII characters to a byte buffer.
   * @param {string} str The string to pack.
   * @param {!Uint8Array|!Array<number>} buffer The output buffer.
   * @param {number=} index The index to write in the buffer.
   * @return {number} The next index to write in the buffer.
   * @throws {Error} If a character in the string is not valid ASCII.
   */
  function packStringTo(str, buffer) {
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      validateASCIICode(code);
      buffer[index] = code;
      index++;
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
  function packTo(value, theType, buffer) {
    var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    setUp_(theType);
    return writeBytes_(value, theType, buffer, index, index + theType.offset, validateNotUndefined, theType.be);
  }

  /**
   * Unpack a number from a byte buffer by index.
   * @param {!Uint8Array} buffer The byte buffer.
   * @param {!Object} theType The type definition.
   * @param {number=} index The buffer index to read.
   * @return {number}
   * @throws {Error} If the type definition is not valid
   */
  function unpackFrom(buffer, theType) {
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    setUp_(theType);
    if (theType.be) {
      endianness(buffer, theType.offset, index, index + theType.offset);
    }
    var value = reader_(buffer, index);
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

  /** @type {string} */
  var RANGE_EROR = "Range error";

  /**
   * A class to read and write to buffers.
   */

  var MiniBuffer = function () {
    function MiniBuffer() {
      classCallCheck(this, MiniBuffer);

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


    createClass(MiniBuffer, [{
      key: 'read',
      value: function read(buffer, typeDefinition) {
        var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        index = index === null ? this.head : index;
        /** @type {number} */
        var size = typeDefinition.bits / 8;
        if (index + size > buffer.length) {
          throw new Error(RANGE_EROR);
        }
        /** @type {number} */
        var num = unpackFrom(buffer, typeDefinition, index);
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

    }, {
      key: 'write',
      value: function write(buffer, typeDefinition, num) {
        var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

        index = index === null ? this.head : index;
        /** @type {number} */
        var size = typeDefinition.bits / 8;
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

    }, {
      key: 'readStr',
      value: function readStr(buffer, size) {
        var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        index = index === null ? this.head : index;
        size = index + size;
        if (size > buffer.length) {
          throw new Error(RANGE_EROR);
        }
        /** @type {string} */
        var str = '';
        for (; index < size; index++) {
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

    }, {
      key: 'writeStr',
      value: function writeStr(buffer, str) {
        var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : str.length;
        var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

        index = index === null ? this.head : index;
        /** @type {number} */
        var limit = index + size;
        if (limit > buffer.length) {
          throw new Error(RANGE_EROR);
        }
        this.head = packStringTo(str, buffer, index);
        if (this.head < index + size) {
          for (; this.head < limit; this.head++) {
            buffer[this.head] = 0;
          }
        }
      }
    }]);
    return MiniBuffer;
  }();

  return MiniBuffer;

})));
