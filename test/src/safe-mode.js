/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview Test unpacking values in safe mode.
 * In safe mode the input array length must be compatible with the
 * byte length of the type that is being unpacked.
 * @see https://github.com/rochars/minibuffer
 */

var minibuffer = minibuffer || require('../../test/loader.js');
var assert = assert || require('assert');
var uInt16 = {"bits": 16};

describe('safe mode', function() {
    it('throws "Bad buffer size error" when on safe mode and extra bytes',
            function() {
        var f = function(){
            var buffer = [255,255,255];
            var r = minibuffer.unpackArray(
                buffer, uInt16, 0, buffer.length, true);
            console.log(r);
        }
        assert.throws(f, /Bad buffer length/);
    });
    it('throws "Bad buffer size error" when on safe mode and not enough bytes',
            function() {
        var f = function(){
            var buffer = [255];
            var r = minibuffer.unpackArray(
                buffer, uInt16, 0, buffer.length, true);
            console.log(r);
        }
        assert.throws(f, /Bad buffer length/);
    });
    it('throws "Bad buffer size error" when on safe mode and input len = 0',
            function() {
        var f = function(){
            var buffer = [];
            var r = minibuffer.unpackArray(
                buffer, uInt16, 0, buffer.length, true);
            console.log(r);
        }
        assert.throws(f, /Bad buffer length/);
    });
});
