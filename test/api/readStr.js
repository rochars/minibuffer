/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview Test the readStr() method of MiniBuffer.
 * @see https://github.com/rochars/minibuffer
 */

var assert = assert || require('assert');
var MiniBuffer = MiniBuffer || require('../loader.js');
var BinaryDataTypes = BinaryDataTypes || require('binary-data-types');
var RANGE_EROR = /Range error/;

// ZSTRs
describe('readStr() ZSTR', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([97, 97, 98, 99, 0, 0, 0, 0]);

    // Read a value from the buffer
    var result = mb.readStr(file, -1);

    // Tests
    it('should have the head set to 4', function() {
        assert.equal(mb.head, 4);
    });
    it('should have read a string "aab"', function() {
        assert.equal(result, 'aabc');
    });
    it('original buffer should be untouched', function() {
        assert.deepEqual(file, new Uint8Array([97, 97, 98, 99, 0, 0, 0, 0]));
    });
});
// read non-zstr strings
describe('readStr()', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([97, 97, 98, 2, 0, 0, 0, 0]);

    // Read a value from the buffer
    var result = mb.readStr(file, 2);

    // Tests
    it('should have the head set to 2', function() {
        assert.equal(mb.head, 2);
    });
    it('should have read a string "aa"', function() {
        assert.equal(result, 'aa');
    });
    it('original buffer should be untouched', function() {
        assert.deepEqual(file, new Uint8Array([97, 97, 98, 2, 0, 0, 0, 0]));
    });
});
describe('readStr() with index', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([97, 97, 98, 2, 0, 0, 0, 0]);

    // Read a value from the buffer
    var result = mb.readStr(file, 2, 1);

    // Tests
    it('should have the head set to 3', function() {
        assert.equal(mb.head, 3);
    });
    it('should have read a string "ab"', function() {
        assert.equal(result, 'ab');
    });
    it('original buffer should be untouched', function() {
        assert.deepEqual(file, new Uint8Array([97, 97, 98, 2, 0, 0, 0, 0]));
    });
});

// Limits
describe('readStr() with size == buffer.length ', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([97, 97, 98, 97, 97, 99, 97, 97]);

    // Read a value from the buffer
    var result = mb.readStr(file, 8);

    // Tests
    it('should have the head set to 2', function() {
        assert.equal(mb.head, 8);
    });
    it('should have read a string "aabaacaa"', function() {
        assert.equal(result, 'aabaacaa');
    });
    it('original buffer should be untouched', function() {
        assert.deepEqual(file, new Uint8Array([97, 97, 98, 97, 97, 99, 97, 97]));
    });
});
describe('readStr() with size + index == buffer.length', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([97, 97, 98, 97, 97, 99, 97, 97]);

    // Read a value from the buffer
    var result = mb.readStr(file, 3, 5);

    // Tests
    it('should have the head set to 8', function() {
        assert.equal(mb.head, 8);
    });
    it('should have read a string "caa"', function() {
        assert.equal(result, 'caa');
    });
    it('original buffer should be untouched', function() {
        assert.deepEqual(file, new Uint8Array([97, 97, 98, 97, 97, 99, 97, 97]));
    });
});

// Errors
describe('readStr() with invalid size', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([97, 97, 98, 2, 0, 0, 0, 0]);

    // Tests
    it('throws error on invalid size', function() {
        assert.throws(function() {
            // Read a value from the buffer
            console.log(mb.readStr(file, 10));
        }, RANGE_EROR);
    });
    it('original buffer should be untouched', function() {
        assert.deepEqual(file, new Uint8Array([97, 97, 98, 2, 0, 0, 0, 0]));
    });
    it('head should be where it was before the error', function() {
        assert.equal(mb.head, 0);
    });
});
describe('readStr() with size + index', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([97, 97, 98, 2, 0, 0, 0, 0]);

    // Tests
    it('throws error on invalid size + index', function() {
        assert.throws(function() {
            // Read a value from the buffer
            var result = mb.readStr(file, 3, 6);
        }, RANGE_EROR);
    });
    it('original buffer should be untouched', function() {
        assert.deepEqual(file, new Uint8Array([97, 97, 98, 2, 0, 0, 0, 0]));
    });
    it('head should be where it was before the error', function() {
        assert.equal(mb.head, 0);
    });
});