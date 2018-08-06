/*
 * Copyright (c) 2018 Rafael da Silva Rocha.
 */

/**
 * @fileoverview rollup configuration file.
 * @see https://github.com/rochars/minibuffer
 */

import closure from 'rollup-plugin-closure-compiler-js';
import {terser} from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import fs from 'fs';

// Externs
const externsFile = fs.readFileSync('./externs/minibuffer.js', 'utf8');

// Polyfills for the UMD
const polyfills = fs.readFileSync('./scripts/polyfills.js', 'utf8');

// GCC UMD wrapper
const outputWrapper =
  "typeof module!=='undefined'?module.exports=exports :" +
  "typeof define==='function'&&define.amd?define(['exports'],exports) :" +
  "typeof global!=='undefined'?global.minibuffer=exports:null; return exports;})();";

export default [
  // ES6 bundle
  {
    input: 'index.js',
    output: [
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
  // ES6 bundle, minified
  {
    input: 'dist/minibuffer.js',
    output: [
      {
        file: 'dist/minibuffer.min.js',
        format: 'es'
      },
    ],
    plugins: [
      terser({
          compress: {
            dead_code: true,
            unsafe: true
          }
      })
    ]
  },
  // UMD, ES3, polyfills included, minified
  {
    input: 'dist/minibuffer.js',
    output: [
      {
        file: 'dist/minibuffer.umd.js',
        name: 'minibuffer',
        format: 'cjs',
        strict: false,
        banner: 'var exports=exports||{};'
      }
    ],
    plugins: [
      closure({
        languageIn: 'ECMASCRIPT6',
        languageOut: 'ECMASCRIPT3',
        compilationLevel: 'ADVANCED',
        warningLevel: 'VERBOSE',
        outputWrapper: ';var minibuffer=(function(exports){' +
          polyfills + '%output%' +
          outputWrapper,
        assumeFunctionWrapper: true,
        rewritePolyfills: true,
        externs: [{src: externsFile + 'exports={};'}]
      }),
      terser({
        compress: {
          dead_code: true,
          unsafe: true
        }
      })
    ]
  },
];
