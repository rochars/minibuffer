/*
 * https://github.com/rochars/minibuffer
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview rollup configuration file.
 */

import closure from 'rollup-plugin-closure-compiler-js';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import fs from 'fs';

// Read externs definitions
const externsSrc = fs.readFileSync('./externs/minibuffer.js', 'utf8');

// License notes
const license = '/*!\n'+
  'https://github.com/rochars/minibuffer\n' +
  'Copyright (c) 2018 Rafael da Silva Rocha.' +
  '\n */\n';

export default [
  // cjs, es
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/minibuffer.cjs.js',
        name: 'minibuffer',
        footer: 'module.exports.default = MiniBuffer;',
        format: 'cjs'
      },
      {
        file: 'dist/minibuffer.js',
        format: 'es'
      }
    ],
    plugins: [
      resolve(),
      commonjs()
    ]
  },
  // browser
  {
    input: 'index.js',
    output: [
      {
        name: 'mb',
        format: 'iife',
        file: 'dist/minibuffer.min.js',
        banner: license,
        footer: 'window["MiniBuffer"]=mb;'
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      closure({
        languageIn: 'ECMASCRIPT6',
        languageOut: 'ECMASCRIPT3',
        compilationLevel: 'ADVANCED',
        warningLevel: 'VERBOSE',
        externs: [{src:externsSrc}]
      })
    ]
  }
];
