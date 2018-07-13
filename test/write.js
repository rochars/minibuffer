/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview Test the write() method of MiniBuffer.
 * @see https://github.com/rochars/minibuffer
 */

var assert = assert || require('assert');
var MiniBuffer = MiniBuffer || require('./loader.js');
var BinaryDataTypes = BinaryDataTypes || require('binary-data-types');
var RANGE_EROR = /Range error/;

// Little endian
describe('write: 16-bit LE', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([0, 0, 253, 2, 0, 0, 0, 0]);

    // Write a value to the buffer
    var result = mb.write(file, BinaryDataTypes.uInt16, 65535);

    // Tests
    it('should have the head set to 2', function() {
        assert.equal(mb.head, 2);
    });
    it('original buffer should have been written', function() {
        assert.deepEqual(file, new Uint8Array([255, 255, 253, 2, 0, 0, 0, 0]));
    });
});
describe('write: 16-bit LE to index', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([255, 255, 0, 0, 0, 0, 0, 0]);

    // Write a value to the buffer
    var result = mb.write(file, BinaryDataTypes.uInt16, 765, 2);

    // Tests
    it('should have the head set to 4', function() {
        assert.equal(mb.head, 4);
    });
    it('original buffer should have been written', function() {
        assert.deepEqual(file, new Uint8Array([255, 255, 253, 2, 0, 0, 0, 0]));
    });
});
describe('write: 16-bit LE to index == buffer.length - word size', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([255, 255, 0, 0, 0, 0, 0, 0]);

    // Write a value to the buffer
    var result = mb.write(file, BinaryDataTypes.uInt16, 765, 6);

    // Tests
    it('should have the head set to 8', function() {
        assert.equal(mb.head, 8);
    });
    it('original buffer should have been written', function() {
        assert.deepEqual(file, new Uint8Array([255, 255, 0, 0, 0, 0, 253, 2]));
    });
});

// Little endian errors
describe('write: 16-bit LE to index > buffer.length - word size', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([255, 255, 0, 0, 0, 0, 0, 0]);

    // Tests
    it('throws error on index > buffer.length - word size', function() {
        assert.throws(function() {
            console.log(mb.write(file, BinaryDataTypes.uInt16, 765, 7));
        }, RANGE_EROR);
    });
    it('original buffer should be untouched', function() {
        assert.deepEqual(file, new Uint8Array([255, 255, 0, 0, 0, 0, 0, 0]));
    });
});

// Big endian
describe('write: 16-bit BE', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([0, 0, 253, 2, 0, 0, 0, 0]);

    // Write a value to the buffer
    mb.write(file, BinaryDataTypes.uInt16BE, 65535);

    // Tests
    it('should have the head set to 2', function() {
        assert.equal(mb.head, 2);
    });
    it('original buffer should have been written', function() {
        assert.deepEqual(file, new Uint8Array([255, 255, 253, 2, 0, 0, 0, 0]));
    });
});
describe('write: 16-bit BE to index', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([255, 255, 0, 0, 0, 0, 0, 0]);

    // Write a value to the buffer
    mb.write(file, BinaryDataTypes.uInt16BE, 765, 2);

    // Tests
    it('should have the head set to 4', function() {
        assert.equal(mb.head, 4);
    });
    it('original buffer should have been written', function() {
        assert.deepEqual(file, new Uint8Array([255, 255, 2, 253, 0, 0, 0, 0]));
    });
});
describe('write: 16-bit BE to index, 2 times', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([255, 255, 0, 0, 0, 0, 0, 0]);

    // Write a value to the buffer
    mb.write(file, BinaryDataTypes.uInt16BE, 765, 2);

    // Write another value to the buffer
    mb.write(file, BinaryDataTypes.uInt16BE, 765);

    // Tests
    it('should have the head set to 6', function() {
        assert.equal(mb.head, 6);
    });
    it('original buffer should have been written', function() {
        assert.deepEqual(file, new Uint8Array([255, 255, 2, 253, 2, 253, 0, 0]));
    });
});
