/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview Test the read() method of MiniBuffer.
 * @see https://github.com/rochars/minibuffer
 */

var assert = assert || require('assert');
var MiniBuffer = MiniBuffer || require('./loader.js');
var BinaryDataTypes = BinaryDataTypes || require('binary-data-types');
var RANGE_EROR = /Range error/;

// Little endian
describe('read: 16-bit LE', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([255, 255, 253, 2, 0, 0, 0, 0]);

    // Read a value from the buffer
    var result = mb.read(file, BinaryDataTypes.uInt16);

    // Tests
    it('should read the first value in the buffer', function() {
        assert.equal(result, 65535);
    });
    it('should have the head set to 2', function() {
        assert.equal(mb.head, 2);
    });
    it('should have kept the original buffer untouched', function() {
        assert.deepEqual(file, new Uint8Array([255, 255, 253, 2, 0, 0, 0, 0]));
    });
});
describe('read: 16-bit LE from index', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([255, 255, 253, 2, 0, 0, 0, 0]);

    // Read a value from the buffer
    var result = mb.read(file, BinaryDataTypes.uInt16, 2);

    // Tests
    it('should read the first value in the buffer', function() {
        assert.equal(result, 765);
    });
    it('should have the head set to 4', function() {
        assert.equal(mb.head, 4);
    });
    it('should have kept the original buffer untouched', function() {
        assert.deepEqual(file, new Uint8Array([255, 255, 253, 2, 0, 0, 0, 0]));
    });
});
describe('read: 16-bit LE with index + word size == buffer.length - word size',
        function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([255, 255, 1, 1, 0, 0, 253, 2]);

    // Read a value from the buffer
    var result = mb.read(file, BinaryDataTypes.uInt16, 6);

    // Tests
    it('should read the last value in the buffer', function() {
        assert.equal(result, 765);
    });
    it('should have the head set to 8', function() {
        assert.equal(mb.head, 8);
    });
    it('should have kept the original buffer untouched', function() {
        assert.deepEqual(file, new Uint8Array([255, 255, 1, 1, 0, 0, 253, 2]));
    });
});
describe('read: 16-bit LE 2x', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([255, 255, 253, 2, 0, 0, 0, 0]);

    // Read a value from the buffer
    var result = mb.read(file, BinaryDataTypes.uInt16);
    var result2 = mb.read(file, BinaryDataTypes.uInt16);

    // Tests
    it('should read the first value in the buffer', function() {
        assert.equal(result, 65535);
    });
    it('should read the second value in the buffer', function() {
        assert.equal(result2, 765);
    });
    it('should have the head set to 4', function() {
        assert.equal(mb.head, 4);
    });
    it('should have kept the original buffer untouched', function() {
        assert.deepEqual(file, new Uint8Array([255, 255, 253, 2, 0, 0, 0, 0]));
    });
});

// Little endian errors
describe('read: 16-bit LE with index + word size > buffer.length - word size',
        function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([255, 255, 1, 1, 0, 0, 253, 2]);

    // Tests
    it('throws error on index + word size > buffer.length - word size ',
            function() {
        assert.throws(function() {
            console.log(mb.read(file, BinaryDataTypes.uInt16, 7));
        }, RANGE_EROR);
    });
    it('should have kept the original buffer untouched', function() {
        assert.deepEqual(file, new Uint8Array([255, 255, 1, 1, 0, 0, 253, 2]));
    });
});

// Big endian
describe('read: 16-bit BE', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([255, 255, 2, 253, 0, 0, 0, 0]);

    // Read a value from the buffer
    var result = mb.read(file, BinaryDataTypes.uInt16BE);

    // Tests
    it('should read the first value in the buffer', function() {
        assert.equal(result, 65535);
    });
    it('should have the head set to 2', function() {
        assert.equal(mb.head, 2);
    });
    it('should have kept the original buffer untouched', function() {
        assert.deepEqual(file, new Uint8Array([255, 255, 2, 253, 0, 0, 0, 0]));
    });
});

describe('read: 16-bit BE from index', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([255, 255, 2, 253, 0, 0, 0, 0]);

    // Read a value from the buffer
    var result = mb.read(file, BinaryDataTypes.uInt16BE, 2);

    // Tests
    it('should read the first value in the buffer', function() {
        assert.equal(result, 765);
    });
    it('should have the head set to 4', function() {
        assert.equal(mb.head, 4);
    });
    it('should have kept the original buffer untouched', function() {
        assert.deepEqual(file, new Uint8Array([255, 255, 2, 253, 0, 0, 0, 0]));
    });
});
