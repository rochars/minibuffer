/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview Old tests. Those are the first tests for minibuffer.
 * @see https://github.com/rochars/minibuffer
 */

var minibuffer = minibuffer || require('../../test/loader.js');
var assert = assert || require('assert');
var uInt24 = {"bits": 24};
var float16 = {"bits": 16, "fp": true};
var float32 = {"bits": 32, "fp": true};
var float64 = {"bits": 64, "fp": true};
var int32 = {"bits": 32, "signed": true};
var uInt2 = {"bits": 2};
var int2 = {"bits": 2, "signed": true};
var int4 = {"bits": 4, "signed": true};
var uInt4 = {"bits": 4};
var uInt32BE = {"bits": 32, "be": true};
var uInt32 = {"bits": 32};
var uInt40BE = {"bits": 40, "be": true};
var uInt40 = {"bits": 40};
var uInt24 = {"bits": 24};
var uInt48BE = {"bits": 48, "be": true};
var uInt48 = {"bits": 48};
var uInt53 = {"bits": 53};
var int53 = {"bits": 53, "signed": true};
var int48BE = {"bits": 48, "signed": true, "be": true};
var int48 = {"bits": 48, "signed": true};
var int40BE = {"bits": 40, "signed": true, "be": true};
var int40 = {"bits": 40, "signed": true};
var int16 = {"bits": 16, "signed": true};
var uInt16 = {"bits": 16};
var int8 = {"bits": 8, "signed": true};
var uInt8 = {"bits": 8};

describe('Emulate old browser with binary32 and binary64', function() {
    var global = global || {};
    var tmp = global.Uint8Array;
    it('pack pi as 3.1415926535897931', function() {
        global.Uint8Array = undefined;
        assert.deepEqual(
            minibuffer.pack(3.1415926535897931, float64), 
            [0x18,0x2d,0x44,0x54,0xfb,0x21,0x09,0x40]);
        global.Uint8Array = tmp;
    });
    it('unpack pi as 3.1415926535897931', function() {
        global.Uint8Array = undefined;
        assert.equal(
            minibuffer.unpack(
                [0x18,0x2d,0x44,0x54,0xfb,0x21,0x09,0x40],
                float64).toFixed(15), 
            '3.141592653589793');
        global.Uint8Array = tmp;
    });
    it('pack pi as 3.1415927410', function() {
        global.Uint8Array = undefined;
        assert.deepEqual(
            minibuffer.pack(3.1415927410, float32), 
            [0xdb,0x0F,0x49,0x40]);
        global.Uint8Array = tmp;
    });
    it('unpack pi as 3.1415927410', function() {
        global.Uint8Array = undefined;
        assert.equal(
            minibuffer.unpack([0xdb,0x0F,0x49,0x40], float32).toFixed(10), 
            '3.1415927410');
        global.Uint8Array = tmp;
    });
});

describe('interface', function() {

    // pack
    it('pack true uInt16 (1, 0)', function() {
        assert.deepEqual(
            minibuffer.pack(true, uInt16),
            [1, 0]);
    });
    it('pack false uInt16 (0, 0)', function() {
        assert.deepEqual(
            minibuffer.pack(false, uInt16),
            [0, 0]);
    });
    //it('pack null uInt16 (0, 0)', function() {
    //    assert.deepEqual(
    //        minibuffer.pack(null, uInt16),
    //        [0, 0]);
    //});
    it('pack uInt16 (65535, 16)', function() {
        assert.deepEqual(
            minibuffer.pack(65535, uInt16),
            [255,255]);
    });
    it('pack float32 (2.1474836, 16)', function() {
        assert.deepEqual(
            minibuffer.pack(2.1474836, float32),
            [95,112,9,64]);
    });
    it('pack int4 (-1)', function() {
        assert.deepEqual(minibuffer.pack(-1, int4),
            [15]);
    });
    it('pack uInt4 (15)', function() {
        assert.deepEqual(minibuffer.pack(15, uInt4),
            [15]);
    });
    it('pack uInt8 (254)', function() {
        assert.deepEqual(minibuffer.pack(254, uInt8),
            [254]);
    });
    it('pack uInt8 (255)', function() {
        assert.deepEqual(minibuffer.pack(255, uInt8),
            [255]);
    });
    it('pack int8 (-1)', function() {
        assert.deepEqual(minibuffer.pack(-1, int8),
            [255]);
    });
    it('pack int8 (-2)', function() {
        assert.deepEqual(minibuffer.pack(-2, int8),
            [254]);
    });

    // unpack
    it('unpack uInt16', function() {
        assert.deepEqual(
            minibuffer.unpack([255, 255], uInt16),
            65535);
    });
    it('unpack float16', function() {
        assert.equal(
            minibuffer.unpack([85, 53], float16).toFixed(5),
            0.33325);
    });
    it('unpack int2', function() {
        assert.equal(minibuffer.unpack([3], int2), -1);
    });
    it('unpack uInt2', function() {
        assert.equal(minibuffer.unpack([3], uInt2), 3);
    });
    it('unpack uInt16', function() {
        assert.equal(
            minibuffer.unpack([255,255], uInt16),
            65535);
    });

    // packArray
    it('packArray uInt16', function() {
        assert.deepEqual(
            minibuffer.packArray([65535, 0], uInt16),
            [255, 255, 0, 0]);
    });
    it('packArray int32', function() {
        assert.deepEqual(
            minibuffer.packArray([-2147483648, 2147483647], int32),
            [0,0,0,128,255,255,255,127]);
    });
    it('packArray float32', function() {
        assert.deepEqual(minibuffer.packArray([-1, 1], float32),
            [0,0,128,191,0,0,128,63]);
    });

    // unpackArray
    it('unpackArray uInt16', function() {
        assert.deepEqual(minibuffer.unpackArray(
            [255, 255, 0, 0], uInt16),
            [65535, 0]);
    });
    it('unpackArray uInt2', function() {
        assert.deepEqual(minibuffer.unpackArray([3], uInt2), [3]);
    });
    it('unpackArray float64', function() {
        assert.deepEqual(
            minibuffer.unpackArray([0,0,0,0,0,0,240,63], float64), [1]);
    });
});

describe('unpackArray behaviour tests', function() {
    it('Returns a empty array if not enough bytes (32-bit)', function() {
        assert.deepEqual(
            minibuffer.unpackArray([95,112,9], float32),
            []);
    });
    it('Ignores extra bytes for 32-bit values', function() {
        assert.deepEqual(
            minibuffer.unpackArray(
                [0,0,0,128, 255,255,255,127,255,128], int32),
            [-2147483648,2147483647]);
    });
    it('Ignores extra bytes for 24-bit values',
            function() {
        assert.deepEqual(
            minibuffer.unpackArray([0,0,0,255,255,255,255],uInt24),
            [0,16777215]);
    });
    it('Returns a empty array if not enough bytes (24-bit)', function() {
        assert.deepEqual(
            minibuffer.unpackArray([255,255], uInt24),
            []);
    });
});

describe('Errors', function() {
    var testFunc;
    // Integer error messages on invalid input
    it('thows error if packing something other than Number, Boolean or null', function() {
        testFunc = function() {
            minibuffer.pack({some: 'thing'}, uInt16);
        };
        assert.throws(testFunc, Error);
    });
    it("undefined value", function () {
        testFunc = function() {
            minibuffer.pack(undefined, {"bits": 8});
        };
        assert.throws(testFunc, /Argument is not a valid number at input index 0/);
    });
    it("null value", function () {
        testFunc = function() {
            minibuffer.pack(null, {"bits": 8});
        };
        assert.throws(testFunc, /Argument is not a valid number at input index 0/);
    });
    it("string value", function () {
        testFunc = function() {
            minibuffer.pack('c', {"bits": 8});
        };
        assert.throws(testFunc, /Argument is not a valid number at input index 0/);
    });
    it("undefined value, index 1", function () {
        testFunc = function() {
            minibuffer.packArray([0, undefined], {"bits": 8});
        };
        assert.throws(testFunc, /Argument is not a valid number at input index 1/);
    });
    it("Infinity value, index 1", function () {
        testFunc = function() {
            minibuffer.packArray([0, Infinity], {"bits": 8});
        };
        assert.throws(testFunc, /Argument is not a integer at input index 1/);
    });
    it("-Infinity value, index 1", function () {
        testFunc = function() {
            minibuffer.packArray([0, -Infinity], {"bits": 8});
        };
        assert.throws(testFunc, /Argument is not a integer at input index 1/);
    });
    it("NaN value, index 1", function () {
        testFunc = function() {
            minibuffer.packArray([0, NaN], {"bits": 8});
        };
        assert.throws(testFunc, /Argument is not a integer at input index 1/);
    });
    it("char, index 1", function () {
        testFunc = function() {
            minibuffer.packArray([0, 'a'], {"bits": 8});
        };
        assert.throws(testFunc, /Argument is not a valid number at input index 1/);
    });

    // Floating-point error messages on invalid input
    it('thows error if packing something other than Number or Boolean (float)', function() {
        testFunc = function() {
            minibuffer.pack({some: 'thing'}, {"bits": 32, "fp": true});
        };
        assert.throws(testFunc, Error);
    });
    it("undefined value", function () {
        testFunc = function() {
            minibuffer.pack(undefined, {"bits": 32, "fp": true});
        };
        assert.throws(testFunc, /Argument is not a valid number at input index 0/);
    });
    it("null value", function () {
        testFunc = function() {
            minibuffer.pack(null, {"bits": 32, "fp": true});
        };
        assert.throws(testFunc, /Argument is not a valid number at input index 0/);
    });
    it("string value", function () {
        testFunc = function() {
            minibuffer.pack('c', {"bits": 32, "fp": true});
        };
        assert.throws(testFunc, /Argument is not a valid number at input index 0/);
    });
    it("undefined value, index 1", function () {
        testFunc = function() {
            minibuffer.packArray([0, undefined], {"bits": 32, "fp": true});
        };
        assert.throws(testFunc, /Argument is not a valid number at input index 1/);
    });
    it("char, index 1", function () {
        testFunc = function() {
            minibuffer.packArray([0, 'a'], {"bits": 32, "fp": true});
        };
        assert.throws(testFunc, /Argument is not a valid number at input index 1/);
    });
    
    // Bad buffer length on unpack
    it("Bad buffer length on unpack, missing a byte", function () {
        testFunc = function() {
            minibuffer.unpack([1], {"bits": 16});
        };
        assert.throws(testFunc, /Bad buffer length/);
    });
    it("Bad buffer length on unpack, zero bytes", function () {
        testFunc = function() {
            minibuffer.unpack([], {"bits": 16});
        };
        assert.throws(testFunc, /Bad buffer length/);
    });

    // integer overflow
    it("8-bit overflow, positive", function () {
        testFunc = function() {
            minibuffer.pack(256, {"bits": 8});
        };
        assert.throws(testFunc, /Overflow at input index 0/);
    });
    it("8-bit overflow, negative", function () {
        testFunc = function() {
            minibuffer.pack(-1, {"bits": 8});
        };
        assert.throws(testFunc, /Overflow at input index 0/);
    });
    it("8-bit overflow, negative, index 2", function () {
        testFunc = function() {
            minibuffer.packArray([1, -1], {"bits": 8});
        };
        assert.throws(testFunc, /Overflow at input index 1/);
    });
    it("4-bit overflow on unpack", function () {
        testFunc = function() {
            minibuffer.unpack([255], {"bits": 4});
        };
        assert.throws(testFunc, /Overflow at output index 0/);
    });
    it("4-bit overflow on unpack, output index = 1", function () {
        testFunc = function() {
            minibuffer.unpackArray([15, 255], {"bits": 4});
        };
        assert.throws(testFunc, /Overflow at output index 1/);
    });
    
    // Invalid types
    it("undefined type", function () {
        testFunc = function() {
            console.log(minibuffer.pack(2));
        };
        assert.throws(testFunc, /Unsupported type/);
    });
    it("type is a empty array", function () {
        testFunc = function() {
            console.log(minibuffer.pack(2, []));
        };
        assert.throws(testFunc, /Unsupported type/);
    });
    it("type is a empty object", function () {
        testFunc = function() {
            console.log(minibuffer.pack(2, {}));
        };
        assert.throws(testFunc, /Unsupported type/);
    });
    it("type is a number", function () {
        testFunc = function() {
            console.log(minibuffer.pack(2, 1));
        };
        assert.throws(testFunc, /Unsupported type/);
    });
    it("More than 64 bits", function () {
        testFunc = function() {
            minibuffer.pack(2, {"bits": 65});
        };
        assert.throws(testFunc, /Unsupported type/);
    });
    it("Less than 1 bit (0)", function () {
        testFunc = function() {
            minibuffer.pack(2, {"bits": 0});
        };
        assert.throws(testFunc, /Unsupported type/);
    });
    it("Less than 1 bit (-1)", function () {
        testFunc = function() {
            minibuffer.pack(2, {"bits": -1});
        };
        assert.throws(testFunc, /Unsupported type/);
    });
    it("17 float (-1)", function () {
        testFunc = function() {
            minibuffer.pack(2, {"bits": 17, "fp": true});
        };
        assert.throws(testFunc, /Unsupported type/);
    });
});
