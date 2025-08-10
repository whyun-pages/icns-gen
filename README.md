# icns-gen

[![npm version](https://img.shields.io/npm/v/icns-gen.svg)](https://www.npmjs.com/package/icns-gen)
[![Build Status](https://github.com/whyun-pages/icns-gen/actions/workflows/ci.yml/badge.svg)](https://github.com/whyun-pages/icns-gen/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/whyun-pages/icns-gen/badge.svg?branch=main)](https://coveralls.io/github/whyun-pages/icns-gen?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/icns-gen.svg)](https://www.npmjs.com/package/icns-gen)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Node.js Version](https://img.shields.io/node/v/icns-gen.svg)](https://nodejs.org)

A Node.js library for generating Apple ICNS (Icon Container) files from PNG images.

## Installation

```bash
npm install icns-gen
# or
pnpm install icns-gen
# or
yarn add icns-gen
```

## Usage

### Basic Usage

```typescript
import { gen, AssetSize } from 'icns-gen';

const assets = [
    {
        size: AssetSize.S32,  // 32x32
        path: './icon-32.png'
    },
    {
        size: AssetSize.S64,  // 64x64
        path: './icon-64.png'
    },
    {
        size: AssetSize.S128, // 128x128
        path: './icon-128.png'
    },
    {
        size: AssetSize.S256, // 256x256
        path: './icon-256.png'
    },
    {
        size: AssetSize.S512, // 512x512
        path: './icon-512.png'
    },
    {
        size: AssetSize.S1024, // 1024x1024
        path: './icon-1024.png'
    }
];

await gen(assets, './output/icon.icns');
```

### Using Buffers

You can also provide image data as buffers instead of file paths:

```typescript
import { readFileSync } from 'fs';
import { gen, AssetSize } from 'icns-gen';

const assets = [
    {
        size: AssetSize.S32,
        buffer: readFileSync('./icon-32.png')
    },
    {
        size: AssetSize.S64,
        buffer: readFileSync('./icon-64.png')
    }
    // ... more sizes
];

await gen(assets, './output/icon.icns');
```

### CommonJS Usage

```javascript
const { gen, AssetSize } = require('icns-gen');

// Same usage as above
```

## API

### `gen(assets: Asset[], output: string): Promise<void>`

Generates an ICNS file from the provided assets.

#### Parameters

- `assets`: Array of asset objects
  - `size`: One of the supported sizes (see AssetSize enum)
  - `path?`: Path to the PNG file (either path or buffer must be provided)
  - `buffer?`: Buffer containing PNG data (either path or buffer must be provided)
- `output`: Output path for the generated ICNS file

#### Throws

- `GenError` with code `ASSET_PATH_OR_BUFFER_MUST_BE_SET`: When neither path nor buffer is provided
- `GenError` with code `ASSET_SIZE_NOT_SUPPORTED`: When an unsupported size is provided
- `GenError` with code `ASSET_EMPTY`: When the provided file or buffer is empty

### `AssetSize`

Enum of supported icon sizes:

```typescript
enum AssetSize {
    S32 = 32,    // 32x32 pixels
    S64 = 64,    // 64x64 pixels
    S128 = 128,  // 128x128 pixels
    S256 = 256,  // 256x256 pixels
    S512 = 512,  // 512x512 pixels
    S1024 = 1024 // 1024x1024 pixels
}
```

## Supported Icon Types

The library generates the following icon types based on the provided sizes:

| Size | Icon Types | Description |
|------|------------|-------------|
| 32   | icp5       | 32x32 PNG format |
| 64   | icp6, ic11 | 64x64 PNG format (ic11 is 32x32@2x Retina) |
| 128  | ic07, ic12 | 128x128 PNG format (ic12 is 64x64@2x Retina) |
| 256  | ic08       | 256x256 PNG format |
| 512  | ic09, ic13 | 512x512 PNG format (ic13 is 256x256@2x Retina) |
| 1024 | ic10, ic14 | 1024x1024 PNG format (ic14 is 512x512@2x Retina) |

## Requirements

- Node.js >= 14
- PNG format images with the exact dimensions specified

## Example

```typescript
import { gen, AssetSize, GenError, GenErrorCode } from 'icns-gen';

try {
    await gen([
        { size: AssetSize.S32, path: './icons/icon-32.png' },
        { size: AssetSize.S128, path: './icons/icon-128.png' },
        { size: AssetSize.S512, path: './icons/icon-512.png' },
        { size: AssetSize.S1024, path: './icons/icon-1024.png' }
    ], './app.icns');
    
    console.log('ICNS file generated successfully!');
} catch (error) {
    if (error instanceof GenError) {
        switch (error.code) {
            case GenErrorCode.ASSET_PATH_OR_BUFFER_MUST_BE_SET:
                console.error('Please provide either a path or buffer for each asset');
                break;
            case GenErrorCode.ASSET_SIZE_NOT_SUPPORTED:
                console.error('One of the provided sizes is not supported');
                break;
            case GenErrorCode.ASSET_EMPTY:
                console.error('One of the provided files is empty');
                break;
        }
    } else {
        console.error('Unexpected error:', error);
    }
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint
```

## TODO
- [] Command line tool
