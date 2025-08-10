import * as path from 'path';
import { existsSync, readFileSync } from 'fs';
import { AssetSize, gen, GenErrorCode } from '../src';
import { rm } from 'fs/promises';

describe('test-gen-icns', () => {
    const assets = Object.keys(AssetSize).filter(size => !isNaN(Number(size))).map(size => {
        return {
            size: Number(size),
            path: path.join(__dirname, `../build/icon-${size}.png`)
        };
    });
    it('test-png files', async() => {
        const output = path.join(__dirname, 'output/icon.icns');
        await rm(output, {force: true});
        await gen(assets, output);
        expect(existsSync(output)).toBe(true);
    });
    it('test-png buffer', async() => {
        const bufferAssets = assets.map(asset => {
            return {
                ...asset,
                buffer: readFileSync(asset.path)
            };
        });
        const output = path.join(__dirname, 'output/icon2.icns');
        await rm(output, {force: true});
        await gen(bufferAssets, output);
        expect(existsSync(output)).toBe(true);
    });
    it('params empty test', async() => {
        const output = path.join(__dirname, 'output/icon3.icns');

        await expect(gen([{size: 32}], output)).rejects.toMatchObject(
            expect.objectContaining({
                code: GenErrorCode.ASSET_PATH_OR_BUFFER_MUST_BE_SET
            })
        );
    });
    it('params size not supported test', async() => {
        const output = path.join(__dirname, 'output/icon4.icns');
        await expect(gen([{size: 1000 as AssetSize}], output)).rejects.toMatchObject(
            expect.objectContaining({
                code: GenErrorCode.ASSET_SIZE_NOT_SUPPORTED
            })
        );
    });
    it('params buffer empty test', async() => {
        const output = path.join(__dirname, 'output/icon5.icns');
        await expect(gen([{size: 32, buffer: Buffer.from('')}], output)).rejects.toMatchObject(
            expect.objectContaining({
                code: GenErrorCode.ASSET_EMPTY
            })
        );
    });
});

