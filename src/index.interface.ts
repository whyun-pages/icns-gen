/**
 * 
 * 标识      逻辑尺寸        物理尺寸
 * 'icp5'	32x32 PNG格式	32x32
 * 'icp6'	64x64 PNG格式	64x64
 * 'ic07'	128x128 PNG格式	128x128
 * 'ic08'	256x256 PNG格式	256x256
 * 'ic09'	512x512 PNG格式	512x512
 * 'ic10'	1024x1024 PNG格式 (Retina)	1024x1024
 * 'ic11'	32x32 PNG格式 (Retina)	64x64
 * 'ic12'	64x64 PNG格式 (Retina)	128x128
 * 'ic13'	256x256 PNG格式 (Retina)	512x512
 * 'ic14'	512x512 PNG格式 (Retina)	1024x1024
 */
export enum AssetSize {
    S32 = 32,
    S64 = 64,
    S128 = 128,
    S256 = 256,
    S512 = 512,
    S1024 = 1024,
}
export interface Asset {
    size: AssetSize;
    path?: string;
    buffer?: Buffer;
}