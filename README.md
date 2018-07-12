# minibuffer
Copyright (c) 2018 Rafael da Silva Rocha.  
https://github.com/rochars/minibuffer

[![NPM version](https://img.shields.io/npm/v/minibuffer.svg?style=for-the-badge)](https://www.npmjs.com/package/minibuffer) [![Docs](https://img.shields.io/badge/API-docs-blue.svg?style=for-the-badge)](https://rochars.github.io/minibuffer/api/) [![Tests](https://img.shields.io/badge/tests-online-blue.svg?style=for-the-badge)](https://rawgit.com/rochars/minibuffer/master/test/browser.html)  
[![Codecov](https://img.shields.io/codecov/c/github/rochars/minibuffer.svg?style=flat-square)](https://codecov.io/gh/rochars/minibuffer) [![Unix Build](https://img.shields.io/travis/rochars/minibuffer.svg?style=flat-square)](https://travis-ci.org/rochars/minibuffer) [![Windows Build](https://img.shields.io/appveyor/ci/rochars/minibuffer.svg?style=flat-square&logo=appveyor)](https://ci.appveyor.com/project/rochars/minibuffer) [![Scrutinizer](https://img.shields.io/scrutinizer/g/rochars/minibuffer.svg?style=flat-square&logo=scrutinizer)](https://scrutinizer-ci.com/g/rochars/minibuffer/)

A minimalist buffer reader and writer.

- **MIT-licensed**
- **Use it out of the box in the browser**
- **Use it out of the box in Node**
- **Use it out of the box with [TypeScript](https://www.typescriptlang.org/)**
- **Less than 3kb minified + compressed, less than 6kb minified**
- Made with **[Closure Compiler](https://github.com/google/closure-compiler)** in mind (works great with others, too)

## Install

### NPM
To use it in your programs:
```
npm install minibuffer
```

### Yarn
To use it in your programs:
```
yarn add minibuffer
```

### GitHub
This is not recommended as it will also include test and build assets in your installation. If this is what you want, you can:
```
git clone https://github.com/rochars/minibuffer
```

And then import/require what you want from the *minibuffer* folder:
```
const minibuffer = require('./minibuffer/dist/minibuffer.umd.js');
```

You can also download one of the files in the *./dist* folder:  
https://github.com/rochars/minibuffer/tree/master/dist

## Use

### Node
If you installed via [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com), require MiniBuffer from **minibuffer**:
```javascript
const MiniBuffer = require('minibuffer');
let mb = new MiniBuffer();
```

### ES module
Import MiniBuffer from **minibuffer.js** in the *./dist* folder of this package:
```javascript
import MiniBuffer from './dist/minibuffer.js';
let mb = new MiniBuffer();
```

### Browser
Use the compiled file in the */dist* folder of this package:
```html
<script src="./dist/minibuffer.min.js"></script>
<script>
  var mb = new MiniBuffer();
</script>
```

Or get it from the [jsDelivr](https://cdn.jsdelivr.net/npm/minibuffer) CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/minibuffer"></script>
```

Or get it from [unpkg](https://unpkg.com/minibuffer):
```html
<script src="https://unpkg.com/minibuffer"></script>
```

Or as a module from [jspm](https://jspm.io):
```html
<script type="module">
  import MiniBuffer from 'https://dev.jspm.io/minibuffer';
  console.log(new MiniBuffer());
</script>
```

## API
```javascript
/**
 * A class to read and write to buffers.
 */
class MiniBuffer {}

/**
 * @type {number}
 */
MiniBuffer.head = 0;

/**
 * Read a number from a buffer.
 * @param {!Uint8Array} buffer The bufefr.
 * @param {!Object} typeDefinition The type definition.
 * @return {number} The number.
 */
MiniBuffer.read(buffer, typeDefinition) {}

/**
 * Write a number to a buffer.
 * @param {!Uint8Array} buffer The buffer.
 * @param {!Object} typeDefinition The type definition.
 * @param {number} num The number to write.
 * @param {?number=} index The buffer index to write.
 */
MiniBuffer.write(buffer, typeDefinition, num, index=null) {}
```

### Type definitions
Types are user-defined objects like this:
```javascript
const float32 = {
  bits: 32, // required
  signed: true, // optional, defaults to false
  float: true, // optional, defaults to false
  be: false // optional, defaults to false, true for big-endian
}
```

There is a standard set of types that can be installed:
```
npm install binary-data-types
```

## Distribution
This library is a ES module also distributed as a CommonJS module, UMD module and a compiled script for browsers. It works out of the box in Node when installed with ```npm install minibuffer```. It includes a [TypeScript](https://www.typescriptlang.org/) definition file.

If you use the [Closure Compiler](https://github.com/google/closure-compiler), this package includes a externs file: **./externs/minibuffer.js**.

### If you are using this lib in a browser:

You may load both **./dist/minibuffer.umd.js** and **./dist/minibuffer.min.js** in the browser with ```<script>``` tags. Ideally you should use **minibuffer.min.js**. You can load it via the https://unpkg.com and https://www.jsdelivr.com/ CDNs:

[unpkg](https://unpkg.com/minibuffer):
```html
<script src="https://unpkg.com/minibuffer"></script>
```

[jsDelivr](https://cdn.jsdelivr.net/npm/minibuffer):
```html
<script src="https://cdn.jsdelivr.net/npm/minibuffer"></script>
```

### If you are using this lib as a dependency:

- The **CommonJS** dist is **./dist/minibuffer.cjs.js**. It is the dist file used by Node. It is served in the "main" field of package.json and is the source you are running when you **npm install minibuffer**. It is not compiled or minified.

- The **UMD** module is **./dist/minibuffer.umd.js**. It is transpiled to ES5 and compatible with Node, AMD and browsers. It is served in the "browser" field of package.json.

- The **browser-only** dist is **./dist/minibuffer.min.js**. It is transpiled to ES5 and compiled. It is used in the "unpkg" and "jsdelivr" fields of package.json.

- The **ES6 bundle** is **./dist/minibuffer.js**, served as "es2015" in package.json. It is not compiled/minified.

- **./index.js** is served as "module" in package.json. This should be the entry point for bundlers.

If your module bundler is using "browser" as the entry point **your dist should work the same** but will be a larger file.

## Contributing to minibuffer
**minibuffer** welcomes all contributions from anyone willing to work in good faith with other contributors and the community. No contribution is too small and all contributions are valued.

See [CONTRIBUTING.md](https://github.com/rochars/minibuffer/blob/master/docs/CONTRIBUTING.md) for details.

### Style guide
**minibuffer** code should follow the Google JavaScript Style Guide:  
https://google.github.io/styleguide/jsguide.html

### Code of conduct
This project is bound by a Code of Conduct: The [Contributor Covenant, version 1.4](https://github.com/rochars/minibuffer/blob/master/docs/CODE_OF_CONDUCT.md), also available at https://www.contributor-covenant.org/version/1/4/code-of-conduct.html

### LICENSE
Copyright (c) 2018 Rafael da Silva Rocha.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
