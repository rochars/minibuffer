/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview TypeScript tests.
 * @see https://github.com/rochars/minibuffer
 */

import MiniBuffer from '../../index.js';

let typeDefinition = {bits: 16};
let buffer = new Uint8Array([255,255]);
let num = 2;
let str = 'ab'

let mb = new MiniBuffer();
mb.head = 0;
mb.read(buffer, typeDefinition);
mb.head = 0;
mb.write(buffer, typeDefinition, num);
mb.head = 0;
mb.writeStr(buffer, str);
mb.clear();
mb.readStr(buffer, 2);