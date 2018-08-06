/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview Test 32-bit integers, signed and unsigned.
 * @see https://github.com/rochars/minibuffer
 */

var minibuffer = minibuffer || require('../../test/loader.js');
var assert = assert || require('assert');
var uInt32 = {"bits": 32};
var int32 = {"bits": 32, "signed": true};
var uInt32BE = {"bits": 32, "be": true};
var int32BE = {"bits": 32, "signed": true, "be": true};

describe('pack int32', function() {     
    it('pack 2147483647 (max)', function() {
        assert.deepEqual(
            minibuffer.pack(2147483647, int32),
            [255,255,255,127]);
    });
    it('unpack 2147483647 (max)', function() {
        assert.deepEqual(
            minibuffer.unpack([255,255,255,127], int32),
            2147483647);
    });
    it('pack -2147483648 (min)', function() {
        assert.deepEqual(
            minibuffer.pack(-2147483648, int32),
            [0,0,0,128]);
    });
    it('unpack -2147483648 (min)', function() {
        assert.deepEqual(
            minibuffer.unpack([0,0,0,128], int32),
            -2147483648);
    });
    it('pack min + 1', function() {
        assert.deepEqual(
            minibuffer.pack(-2147483647, int32),
            [1,0,0,128]);
    });
    it('unpack min + 1', function() {
        assert.deepEqual(
            minibuffer.unpack([1,0,0,128], int32),
            -2147483647);
    });
    it('pack min + 2', function() {
        assert.deepEqual(
            minibuffer.pack(-2147483646, int32),
            [2,0,0,128]);
    });
    it('unpack min + 2', function() {
        assert.deepEqual(
            minibuffer.unpack([2,0,0,128], int32),
            -2147483646);
    });
    it('pack min + 3', function() {
        assert.deepEqual(
            minibuffer.pack(-2147483645, int32),
            [3,0,0,128]);
    });
    it('unpack min + 3', function() {
        assert.deepEqual(
            minibuffer.unpack([3,0,0,128], int32),
            -2147483645);
    });
    it('pack 0', function() {
        assert.deepEqual(
            minibuffer.pack(0, int32),
            [0,0,0,0]);
    });
    it('unpack 0', function() {
        assert.deepEqual(
            minibuffer.unpack([0,0,0,0], int32),
            0);
    });
    it('pack -125', function() {
        assert.deepEqual(
            minibuffer.pack(-125, int32),
            [131,255,255,255]);
    });
    it('unpack -125', function() {
        assert.deepEqual(
            minibuffer.unpack([131,255,255,255], int32),
            -125);
    });
    it('pack -1', function() {
        assert.deepEqual(
            minibuffer.pack(-1, int32),
            [255, 255, 255, 255]);
    });
    it('unpack -1', function() {
        assert.deepEqual(
            minibuffer.unpack([255, 255, 255, 255], int32),
            -1);
    });
    it('pack -2', function() {
        assert.deepEqual(
            minibuffer.pack(-2, int32),
            [254, 255, 255, 255]);
    });
    it('unpack -2', function() {
        assert.deepEqual(
            minibuffer.unpack([254, 255, 255, 255], int32),
            -2);
    });
    it('pack -3', function() {
        assert.deepEqual(
            minibuffer.pack(-3, int32),
            [253, 255, 255, 255]);
    });
    it('unpack -3', function() {
        assert.deepEqual(
            minibuffer.unpack([253, 255, 255, 255], int32),
            -3);
    });
});

describe('32-bit integers, unsigned', function() {     
    it('pack 0', function() {
        assert.deepEqual(
            minibuffer.pack(0, uInt32), 
            [0,0,0,0]);
    });
    it('unpack 0', function() {
        assert.deepEqual(
            minibuffer.unpack([0,0,0,0], uInt32), 
            0);
    });
    it('pack 2147483647', function() {
        assert.deepEqual(
            minibuffer.pack(2147483647, uInt32),
            [255,255,255,127]);
    });
    it('unpack 2147483647', function() {
        assert.deepEqual(
            minibuffer.unpack([255,255,255,127], uInt32),
            2147483647);
    });
    it('pack 4294967295', function() {
        assert.deepEqual(
            minibuffer.pack(4294967295, uInt32),
            [255,255,255,255]);
    });
    it('unpack 4294967295', function() {
        assert.deepEqual(
            minibuffer.unpack([255,255,255,255], uInt32),
            4294967295);
    });

    // packArray with random values
    it('pack [0, 0]', function() {
        assert.deepEqual(
            minibuffer.packArray([0, 0], uInt32), 
            [0,0,0,0,0,0,0,0]);
    });
    it('unpack [0, 0]', function() {
        assert.deepEqual(
            minibuffer.unpackArray([0,0,0,0,0,0,0,0], uInt32), 
            [0, 0]);
    });
    it('packArray [0, 4294967295]', function() {
        assert.deepEqual(
            minibuffer.packArray([0, 4294967295], uInt32),
            [0,0,0,0,255,255,255,255]);
    });
    it('unpackArray [0, 4294967295]', function() {
        assert.deepEqual(
            minibuffer.unpackArray([0,0,0,0,255,255,255,255], uInt32),
            [0, 4294967295]);
    });
     it('unpack [-2147482648]', function() {
        assert.deepEqual(
            minibuffer.unpackArray([232,3,0,128], int32),
            [-2147482648]);
    });
     it('pack [-2147482648]', function() {
        assert.deepEqual(
            minibuffer.packArray([-2147482648], int32),
            [232,3,0,128]);
    });
    it('unpack [-32768]', function() {
        assert.deepEqual(
            minibuffer.unpackArray([0,128,255,255], int32),
            [-32768]);
    });
    it('pack [-32768]', function() {
        assert.deepEqual(
            minibuffer.packArray([-32768], int32),
            [0,128,255,255]);
    });

    // big endian
    it('pack [0, 0] BE', function() {
        assert.deepEqual(
            minibuffer.packArray([0, 0], uInt32BE),
            [0, 0, 0, 0, 0, 0, 0, 0]);
    });
    it('pack [1, 1]', function() {
        assert.deepEqual(
            minibuffer.packArray([1, 1], uInt32),
            [1, 0, 0, 0, 1, 0, 0, 0]);
    });
    it('unpack [1, 1]', function() {
        assert.deepEqual(
            minibuffer.unpackArray([1, 0, 0, 0, 1, 0, 0, 0], uInt32),
            [1, 1]);
    });
    it('pack [1, 1] BE', function() {
        assert.deepEqual(
            minibuffer.packArray([1, 1], uInt32BE),
            [0, 0, 0, 1, 0,0, 0, 1]);
    });
    it('pack [1, 1] BE', function() {
        assert.deepEqual(
            minibuffer.unpackArray([0, 0, 0, 1, 0,0, 0, 1], uInt32BE),
            [1, 1]);
    });
    it('pack [-2147483648,2147483647] BE', function() {
        assert.deepEqual(
            minibuffer.packArray([-2147483648,2147483647], int32BE),
            [128,0,0,0, 127,255,255,255]);
    });
    it('unpack [-2147483648,2147483647] BE', function() {
        assert.deepEqual(
            minibuffer.unpackArray([128,0,0,0, 127,255,255,255], int32BE),
            [-2147483648,2147483647]);
    });
    it('unpack [0, 0] BE', function() {
        assert.deepEqual(
            minibuffer.unpackArray([0, 0, 0, 0, 0, 0, 0, 0], int32BE),
            [0, 0]);
    });
    it('unpack [1, 1]', function() {
        assert.deepEqual(
            minibuffer.unpackArray([1, 0, 0, 0, 1, 0, 0, 0], int32),
            [1, 1]);
    });
    it('unpack [1, 1] BE', function() {
        assert.deepEqual(
            minibuffer.unpackArray([0, 0, 0, 1, 0,0, 0, 1], int32BE),
            [1, 1]);
    });
    it('unpack [1] BE', function() {
        assert.deepEqual(
            minibuffer.unpackArray([0, 0, 0, 1], int32BE),
            [1]);
    });
});
