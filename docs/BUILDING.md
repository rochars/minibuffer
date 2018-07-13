# Building minibuffer

Building works the same on all platforms:
```
npm run build
```

There **must** be no errors or warnings during the build.

The dist files are generated in the *dist/* folder.

The API documentation is generated in the *docs/api* folder.

Mind that minibuffer uses Google Closure Compiler with compilation level set to ADVANCED, so properties that have not been exported will be renamed (and likely result in errors in the compiled browser version).
