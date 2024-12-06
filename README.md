# heic-convert

> Convert HEIC/HEIF images to JPEG and PNG

[![ci][ci.svg]][ci.link]
[![npm-downloads][npm-downloads.svg]][npm.link]
[![npm-version][npm-version.svg]][npm.link]

[ci.svg]: https://github.com/qs-coder/heic-convert/actions/workflows/ci.yml/badge.svg
[ci.link]: https://github.com/qs-coder/heic-convert/actions/workflows/ci.yml
[npm-downloads.svg]: https://img.shields.io/npm/dm/@qs-coder/heic-convert.svg
[npm.link]: https://www.npmjs.com/package/@qs-coder/heic-convert
[npm-version.svg]: https://img.shields.io/npm/v/@qs-coder/heic-convert.svg

## Install

```bash
npm install @qs-coder/heic-convert
```

## Usage

You can convert the first image in a HEIC, or convert all images in the file. In both cases, the options are the same.

### options object

* `buffer` - a Node [`Buffer`](https://nodejs.org/api/buffer.html) or a [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) - the HEIC image to convert
* `format` - string - either `JPEG` or `PNG`
* `quality` - number between `0` and `1`, optional - the lossy compression quality to be used when converting to jpeg.

## Usage in NodeJS

Convert the main image in a HEIC to JPEG

```javascript
const { promisify } = require('util');
const fs = require('fs');
const convert = require('@qs-coder/heic-convert');

(async () => {
  const inputBuffer = await promisify(fs.readFile)('/path/to/my/image.heic');
  const outputBuffer = await convert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 1
  });

  await promisify(fs.writeFile)('./result.jpg', outputBuffer);
})();
```

Convert the main image in a HEIC to PNG

```javascript
const { promisify } = require('util');
const fs = require('fs');
const convert = require('@qs-coder/heic-convert');

(async () => {
  const inputBuffer = await promisify(fs.readFile)('/path/to/my/image.heic');
  const outputBuffer = await convert({
    buffer: inputBuffer,
    format: 'PNG'
  });

  await promisify(fs.writeFile)('./result.png', outputBuffer);
})();
```

Convert all images in a HEIC

```javascript
const { promisify } = require('util');
const fs = require('fs');
const convert = require('@qs-coder/heic-convert');

(async () => {
  const inputBuffer = await promisify(fs.readFile)('/path/to/my/image.heic');
  const images = await convert.all({
    buffer: inputBuffer,
    format: 'JPEG'
  });

  for (let idx in images) {
    const image = images[idx];
    const outputBuffer = await image.convert();
    await promisify(fs.writeFile)(`./result-${idx}.jpg`, outputBuffer);
  }
})();
```

The work to convert an image is done when calling `image.convert()`, so if you only need one of the images in a multi-image file, you can convert just that one from the `images` array and skip doing any work for the remaining images.

_Note that while the converter returns a Promise and is overall asynchronous, a lot of work is still done synchronously, so you should consider using a worker thread in order to not block the main thread in highly concurrent production environments._

## Usage in the browser

While the NodeJS version of `heic-convert` may be compiled for use in the browser with something like `webpack`, [not all build tools necessarily like to compile all modules well](https://github.com/qs-coder/heic-convert/issues/29). However, what further complicates things is that this module uses pure-javascript implementations of a jpeg and png encoder. But the browser has its own native encoders! Let's just use those instead of including a ton of extra code in your bundle.

When compiling a client-side project, use:

```javascript
const convert = require('@qs-coder/heic-convert/browser');
```

This is currently only supported in the main thread. Support for workers may be added in the future, but if you need it sooner, please create an issue or even a PR!

## Related

* [heic-cli](https://github.com/qs-coder/heic-cli) - convert heic/heif images to jpeg or png from the command line
* [heic-decode](https://github.com/qs-coder/heic-decode) - decode heic images to raw image data
* [libheif-js](https://github.com/qs-coder/libheif-js) - libheif as a pure-javascript npm module
