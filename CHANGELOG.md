# CHANGELOG

## version 0.2.0 (unreleased)
- No UMD; lib distributed as a ES module, CJS module and browser script.
- Add the clear() method to the MiniBuffer API; set the header to 0

## version 0.1.4 (2018-07-13)
- Fix documentation issues.

## version 0.1.3 (2018-07-13)
- Only change the head position if no errors are throw

## version 0.1.2 (2018-07-12)
- Fix head on read()

## version 0.1.1 (2018-07-12)
- Remove unecessary dependencies from package.json

## version 0.1.0 (2018-07-12)
- Add writeStr() to write ASCII strings to buffers
- Add readStr() to read ASCII strings from buffers
- Add buffer index validation on read() and write(); throws 'Range error'

## version 0.0.3 (2018-07-12)
- Fix head on write()
- Fix TypeScript definition file

## version 0.0.2 (2018-07-12)
- Fix package.json "bin" field

## version 0.0.1 (2018-07-12)
- MiniBuffer.read() to read numbers from buffers
- MiniBuffer.write() to write numbers to buffers