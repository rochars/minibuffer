# Building minibuffer

Building is necessary to compile the minified version intended to run in web browsers and to generate API documentation.

Building works the same on all platforms:
```
npm run build
```
This will lint the sources, test the sources, compile a UMD version, compile a minified UMD version, test the minified UMD and generate documentation files.

There **must** be no errors or warnings during the build.

The compiled browser version is generated in the *dist/* folder.

The API documentation is generated in the *docs/* folder.

Mind that minibuffer uses Google Closure Compiler with compilation level set to ADVANCED, so properties that have not been exported will be renamed (and likely result in errors in the compiled browser version).
