/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview Test 16-bit integers, signed and unsigned.
 * @see https://github.com/rochars/minibuffer
 */

var minibuffer = minibuffer || require('../../test/loader.js');
var assert = assert || require('assert');
var int8 = {"bits": 8, "signed": true};
var uInt8 = {"bits": 8};

describe('8-bit integers, signed', function() { 
    it('pack 255', function() {
        assert.deepEqual(
            minibuffer.pack(-1, int8),
            [255]);
    });
    it('unpack 255', function() {
        assert.deepEqual(
            minibuffer.unpack([255], int8),
            -1);
    });
    it('pack 127', function() {
        assert.deepEqual(
            minibuffer.pack(127, int8),
            [127]);
    });
    it('unpack 127', function() {
        assert.deepEqual(
            minibuffer.unpack([127], int8),
            127);
    });
    it('pack 128', function() {
        assert.deepEqual(
            minibuffer.pack(-128, int8),
            [128]);
    });
    it('unpack 128', function() {
        assert.deepEqual(
            minibuffer.unpack([128], int8),
            -128);
    });
    it('pack 5', function() {
        assert.deepEqual(
            minibuffer.pack(5, int8),
            [5]);
    });
    it('unpack 5', function() {
        assert.deepEqual(
            minibuffer.unpack([5], int8),
            5);
    });
    it('pack -128', function() {
        assert.deepEqual(
            minibuffer.pack(-128, int8),
            [128]);
    });
    it('unpack -128', function() {
        assert.deepEqual(
            minibuffer.unpack([128], int8),
            -128);
    });
    it('pack -127', function() {
        assert.deepEqual(
            minibuffer.pack(-127, int8),
            [129]);
    });
    it('unpack -127', function() {
        assert.deepEqual(
            minibuffer.unpack([129], int8),
            -127);
    });
    it('pack -126', function() {
        assert.deepEqual(
            minibuffer.pack(-126, int8),
            [130]);
    });
    it('unpack -126', function() {
        assert.deepEqual(
            minibuffer.unpack([130], int8),
            -126);
    });
    it('pack -125', function() {
        assert.deepEqual(
            minibuffer.pack(-125, int8),
            [131]);
    });
    it('unpack -125', function() {
        assert.deepEqual(
            minibuffer.unpack([131], int8),
            -125);
    });
    it('pack -1', function() {
        assert.deepEqual(
            minibuffer.pack(-1, int8),
            [255]);
    });
    it('unpack -1', function() {
        assert.deepEqual(
            minibuffer.unpack([255], int8),
            -1);
    });
    it('pack -2', function() {
        assert.deepEqual(
            minibuffer.pack(-2, int8),
            [254]);
    });
    it('unpack -2', function() {
        assert.deepEqual(
            minibuffer.unpack([254], int8),
            -2);
    });
    it('pack -3', function() {
        assert.deepEqual(
            minibuffer.pack(-3, int8),
            [253]);
    });
    it('unpack -3', function() {
        assert.deepEqual(
            minibuffer.unpack([253], int8),
            -3);
    });

    // packArray
    it('should turn 2 8-bit signed int to 2 bytes (0s)', function() {
        assert.deepEqual(
            minibuffer.packArray([0, 0], uInt8),
            [0, 0]);
    });
    it('pack [-128, 127] (min, max)', function() {
        assert.deepEqual(
            minibuffer.packArray([-128, 127], int8),
            [128, 127]);
    });
    it('unpack [-128, 127] (min, max)', function() {
        assert.deepEqual(
            minibuffer.unpackArray([128, 127], int8),
            [-128, 127]);
    });
    it('packArray [-1, 5]', function() {
        assert.deepEqual(
            minibuffer.packArray([-1, 5], int8),
            [255, 5]);
    });
    it('unpack [-1, 5]', function() {
        assert.deepEqual(
            minibuffer.unpackArray([255, 5], int8),
            [-1, 5]);
    });
});

describe('8-bit integers, unsigned', function() {    
    it('pack 0', function() {
        assert.deepEqual(
            minibuffer.pack(0, uInt8),
            [0]);
    });
    it('unpack 0', function() {
        assert.deepEqual(
            minibuffer.unpack([0], uInt8),
            0);
    });
    it('pack 255', function() {
        assert.deepEqual(
            minibuffer.pack(255, uInt8),
            [255]);
    });
    it('unpack 255', function() {
        assert.deepEqual(
            minibuffer.unpack([255], uInt8),
            255);
    });
    it('pack 1', function() {
        assert.deepEqual(
            minibuffer.pack(1, uInt8),
            [1]);
    });
    it('unpack 1', function() {
        assert.deepEqual(
            minibuffer.unpack([1], uInt8),
            1);
    });
});
