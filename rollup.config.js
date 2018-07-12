/*
 * https://github.com/rochars/minibuffer
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview rollup configuration file.
 */

import closure from 'rollup-plugin-closure-compiler-js';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

// Read externs definitions
const fs = require('fs');
const externsSrc = fs.readFileSync('./externs/minibuffer.js', 'utf8');

// License notes
const licenseSrc = fs.readFileSync('./LICENSE', 'utf8');
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
  // umd
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/minibuffer.umd.js',
        name: 'MiniBuffer',
        format: 'umd',
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      babel()
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
        languageOut: 'ECMASCRIPT5',
        compilationLevel: 'ADVANCED',
        warningLevel: 'VERBOSE',
        externs: [{src:externsSrc}]
      })
    ]
  }
];
