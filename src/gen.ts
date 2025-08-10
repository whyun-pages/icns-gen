import { open, readFile } from 'fs/promises';
import { Asset, AssetSize } from './index.interface';
const size2typesRecord: Record<AssetSize, string[]> = {
    32: ['icp5'],
    64: ['icp6', 'ic11'],
    128: ['ic07', 'ic12'],
    256: ['ic08'],
    512: ['ic09', 'ic13'],
    1024: ['ic10', 'ic14'],
};

export enum GenErrorCode {
    ASSET_PATH_OR_BUFFER_MUST_BE_SET = 'ASSET_PATH_OR_BUFFER_MUST_BE_SET',
    ASSET_EMPTY = 'ASSET_EMPTY',
    ASSET_SIZE_NOT_SUPPORTED = 'ASSET_SIZE_NOT_SUPPORTED',
}

export class GenError extends Error {
    public constructor(message: string, public readonly code: GenErrorCode) {
        super(message);
        this.code = code;
    }
}

/**
 * 
 *
 */
export async function gen(assets: Asset[], output: string): Promise<void> {
    const fd = await open(output, 'w+');
    async function genError(code: GenErrorCode, message: string) {
        await fd.close();
        throw new GenError(message, code);
    }
    let position = 0;
    fd.write(Buffer.from([0x69, 0x63, 0x6E, 0x73]), 0, 4, position);
    position += 4;
    position += 4;// 跳过总长度, 4字节
    for (const asset of assets) {
        const {size, path, buffer} = asset;
        const types = size2typesRecord[size];
        if (!types) {
            await genError(
                GenErrorCode.ASSET_SIZE_NOT_SUPPORTED,
                `size ${size} not supported`
            );
        }
        if (!buffer && !path) {
            await genError(
                GenErrorCode.ASSET_PATH_OR_BUFFER_MUST_BE_SET,
                'asset path or buffer must been set'
            );
        }
        const content = buffer || await readFile(path!);
        if (content.length === 0) {
            await genError(GenErrorCode.ASSET_EMPTY, `file ${path} is empty`);
        }
        const bufferLength = Buffer.alloc(4);
        bufferLength.writeUInt32BE(content.length + 8, 0);
        for (const type of types) {
            await fd.write(Buffer.from(type), 0, 4, position);
            position += 4;
            await fd.write(bufferLength, 0, 4, position);
            position += 4;
            await fd.write(content, 0, content.length, position);
            position += content.length;
        }
    }
    const bufferLength = Buffer.alloc(4);
    bufferLength.writeUInt32BE(position, 0);
    await fd.write(bufferLength, 0, 4, 4);
    await fd.close();
}

