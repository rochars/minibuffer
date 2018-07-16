/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview Test if the MiniBuffer API is available.
 * @see https://github.com/rochars/minibuffer
 */

var assert = assert || require('assert');
var MiniBuffer = MiniBuffer || require('../loader.js');

describe('Check if API is available', function() {
    
    it("should create a MiniBuffer instance", function() {
        assert.ok(new MiniBuffer()); 
    });
    it("should have a head set to zero", function() {
        let minibuffer = new MiniBuffer();
        assert.equal(minibuffer.head, 0);
    });
    it("should have the read method", function() {
        let minibuffer = new MiniBuffer();
        assert.equal(minibuffer.read.constructor, Function);
    });
    it("should have the write method", function() {
        let minibuffer = new MiniBuffer();
        assert.equal(minibuffer.write.constructor, Function);
    });
});
