/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview Test the writeStr() method of MiniBuffer.
 * @see https://github.com/rochars/minibuffer
 */

var assert = assert || require('assert');
var MiniBuffer = MiniBuffer || require('./loader.js');
var BinaryDataTypes = BinaryDataTypes || require('binary-data-types');
var RANGE_EROR = /Range error/;

describe('writeStr()', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([0, 0, 253, 2, 0, 0, 0, 0]);

    // Write a value to the buffer
    mb.writeStr(file, 'aa');

    // Tests
    it('should have the head set to 2', function() {
        assert.equal(mb.head, 2);
    });
    it('original buffer should have been written', function() {
        assert.deepEqual(file, new Uint8Array([97, 97, 253, 2, 0, 0, 0, 0]));
    });
});
describe('writeStr() with size', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([0, 0, 253, 2, 0, 0, 0, 0]);

    // Write a value to the buffer
    mb.writeStr(file, 'aa', 3);

    // Tests
    it('should have the head set to 3', function() {
        assert.equal(mb.head, 3);
    });
    it('original buffer should have been written', function() {
        assert.deepEqual(file, new Uint8Array([97, 97, 0, 2, 0, 0, 0, 0]));
    });
});
describe('writeStr() with size and index', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([0, 0, 253, 2, 0, 0, 0, 0]);

    // Write a value to the buffer
    mb.writeStr(file, 'aa', 3, 1);

    // Tests
    it('should have the head set to 4', function() {
        assert.equal(mb.head, 4);
    });
    it('original buffer should have been written', function() {
        assert.deepEqual(file, new Uint8Array([0, 97, 97, 0, 0, 0, 0, 0]));
    });
});

// Limit
describe('writeStr() with length == buffer.length', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([0, 0, 253, 2, 0, 0, 0, 0]);

    // Write a value to the buffer
    mb.writeStr(file, 'aaaaaaaa');

    // Tests
    it('should have the head set to 2', function() {
        assert.equal(mb.head, 8);
    });
    it('original buffer should have been written', function() {
        assert.deepEqual(file, new Uint8Array([97, 97, 97, 97, 97, 97, 97, 97]));
    });
});
describe('writeStr() with size == buffer.length', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([0, 0, 253, 2, 0, 0, 0, 0]);

    // Write a value to the buffer
    mb.writeStr(file, 'aa', 8);

    // Tests
    it('should have the head set to 3', function() {
        assert.equal(mb.head, 8);
    });
    it('original buffer should have been written', function() {
        assert.deepEqual(file, new Uint8Array([97, 97, 0, 0, 0, 0, 0, 0]));
    });
});
describe('writeStr() with size + index == buffer.length', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([0, 0, 253, 2, 0, 0, 0, 1]);

    // Write a value to the buffer
    mb.writeStr(file, 'aa', 3, 5);

    // Tests
    it('should have the head set to 4', function() {
        assert.equal(mb.head, 8);
    });
    it('original buffer should have been written', function() {
        assert.deepEqual(file, new Uint8Array([0, 0, 253, 2, 0, 97, 97, 0]));
    });
});

// Errors
describe('writeStr() with invalid length', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([0, 0, 253, 2, 0, 0, 0, 0]);
    
    // Tests
    it('throws error on invalid length', function() {
        assert.throws(function() {
            mb.writeStr(file, 'aaaaaaaaa');
        }, RANGE_EROR);
    });
    it('original buffer should be untouched', function() {
        assert.deepEqual(file, new Uint8Array([0, 0, 253, 2, 0, 0, 0, 0]));
    });
    it('head should be where it was before the error', function() {
        assert.equal(mb.head, 0);
    });
});
describe('writeStr() with invalid size param', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([0, 0, 253, 2, 0, 0, 0, 0]);
    
    // Tests
    it('throws error on invalid size', function() {
        assert.throws(function() {
            mb.writeStr(file, 'aa', 9);
        }, RANGE_EROR);
    });
    it('original buffer should be untouched', function() {
        assert.deepEqual(file, new Uint8Array([0, 0, 253, 2, 0, 0, 0, 0]));
    });
    it('head should be where it was before the error', function() {
        assert.equal(mb.head, 0);
    });
});
describe('writeStr() with size and invalid index', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Create a buffer
    var file = new Uint8Array([0, 0, 253, 2, 0, 0, 0, 0]);

    // Tests
    it('throws error with invalid size + index', function() {
        assert.throws(function() {
          mb.writeStr(file, 'aa', 3, 6);
        }, RANGE_EROR);
    });
    it('original buffer should be untouched', function() {
        assert.deepEqual(file, new Uint8Array([0, 0, 253, 2, 0, 0, 0, 0]));
    });
    it('head should be where it was before the error', function() {
        assert.equal(mb.head, 0);
    });
});