/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview Test the clear() method of MiniBuffer.
 * @see https://github.com/rochars/minibuffer
 */

var assert = assert || require('assert');
var MiniBuffer = MiniBuffer || require('../loader.js');

// Little endian
describe('clear', function() {

    // Create a MiniBuffer
    var mb = new MiniBuffer();

    // Set a header position and then clear()
    mb.head = 2;
    mb.clear();

    // Tests
    it('should have the head set to 0', function() {
        assert.equal(mb.head, 0);
    });
});
