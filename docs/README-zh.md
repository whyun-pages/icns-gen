# icns-gen

[![npm version](https://img.shields.io/npm/v/icns-gen.svg)](https://www.npmjs.com/package/icns-gen)
[![Build Status](https://github.com/yunnysunny/icns-gen/actions/workflows/ci.yml/badge.svg)](https://github.com/yunnysunny/icns-gen/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/yunnysunny/icns-gen/badge.svg?branch=main)](https://coveralls.io/github/yunnysunny/icns-gen?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/icns-gen.svg)](https://www.npmjs.com/package/icns-gen)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Node.js Version](https://img.shields.io/node/v/icns-gen.svg)](https://nodejs.org)

一个用于从 PNG 图片生成 Apple ICNS（图标容器）文件的 Node.js 库。

## 安装

```bash
npm install icns-gen
# 或
pnpm install icns-gen
# 或
yarn add icns-gen
```

## 使用方法

### 基本用法

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

### 使用 Buffer

您也可以提供图片数据的 buffer 而不是文件路径：

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
    // ... 更多尺寸
];

await gen(assets, './output/icon.icns');
```

### CommonJS 用法

```javascript
const { gen, AssetSize } = require('icns-gen');

// 使用方法同上
```

## API

### `gen(assets: Asset[], output: string): Promise<void>`

从提供的资源生成 ICNS 文件。

#### 参数

- `assets`: 资源对象数组
  - `size`: 支持的尺寸之一（参见 AssetSize 枚举）
  - `path?`: PNG 文件路径（path 或 buffer 必须提供其一）
  - `buffer?`: 包含 PNG 数据的 Buffer（path 或 buffer 必须提供其一）
- `output`: 生成的 ICNS 文件的输出路径

#### 抛出异常

- `GenError` 错误码 `ASSET_PATH_OR_BUFFER_MUST_BE_SET`: 当既没有提供 path 也没有提供 buffer 时
- `GenError` 错误码 `ASSET_SIZE_NOT_SUPPORTED`: 当提供了不支持的尺寸时
- `GenError` 错误码 `ASSET_EMPTY`: 当提供的文件或 buffer 为空时

### `AssetSize`

支持的图标尺寸枚举：

```typescript
enum AssetSize {
    S32 = 32,    // 32x32 像素
    S64 = 64,    // 64x64 像素
    S128 = 128,  // 128x128 像素
    S256 = 256,  // 256x256 像素
    S512 = 512,  // 512x512 像素
    S1024 = 1024 // 1024x1024 像素
}
```

## 支持的图标类型

该库基于提供的尺寸生成以下图标类型：

| 尺寸 | 图标类型 | 描述 |
|------|----------|------|
| 32   | icp5     | 32x32 PNG 格式 |
| 64   | icp6, ic11 | 64x64 PNG 格式（ic11 是 32x32@2x Retina） |
| 128  | ic07, ic12 | 128x128 PNG 格式（ic12 是 64x64@2x Retina） |
| 256  | ic08     | 256x256 PNG 格式 |
| 512  | ic09, ic13 | 512x512 PNG 格式（ic13 是 256x256@2x Retina） |
| 1024 | ic10, ic14 | 1024x1024 PNG 格式（ic14 是 512x512@2x Retina） |

## 系统要求

- Node.js >= 14
- PNG 格式的图片，且尺寸必须与指定的尺寸完全一致

## 示例

```typescript
import { gen, AssetSize, GenError, GenErrorCode } from 'icns-gen';

try {
    await gen([
        { size: AssetSize.S32, path: './icons/icon-32.png' },
        { size: AssetSize.S128, path: './icons/icon-128.png' },
        { size: AssetSize.S512, path: './icons/icon-512.png' },
        { size: AssetSize.S1024, path: './icons/icon-1024.png' }
    ], './app.icns');
    
    console.log('ICNS 文件生成成功！');
} catch (error) {
    if (error instanceof GenError) {
        switch (error.code) {
            case GenErrorCode.ASSET_PATH_OR_BUFFER_MUST_BE_SET:
                console.error('请为每个资源提供 path 或 buffer');
                break;
            case GenErrorCode.ASSET_SIZE_NOT_SUPPORTED:
                console.error('提供的尺寸之一不被支持');
                break;
            case GenErrorCode.ASSET_EMPTY:
                console.error('提供的文件之一为空');
                break;
        }
    } else {
        console.error('意外错误：', error);
    }
}
```

## 许可证

MIT

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint
```
