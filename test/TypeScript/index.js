"use strict";
/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */
exports.__esModule = true;
/**
 * @fileoverview TypeScript tests.
 * @see https://github.com/rochars/minibuffer
 */
var index_js_1 = require("../../index.js");
var typeDefinition = { bits: 16 };
var buffer = new Uint8Array([255, 255]);
var num = 2;
var str = 'ab';
var mb = new index_js_1["default"]();
mb.head = 0;
mb.read(buffer, typeDefinition);
mb.head = 0;
mb.write(buffer, typeDefinition, num);
mb.head = 0;
mb.writeStr(buffer, str);
mb.clear();
mb.readStr(buffer, 2);
