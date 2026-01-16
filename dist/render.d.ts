import { QRMatrix } from './generate';
export interface RenderOptions {
    invert?: boolean;
    small?: boolean;
    border?: number;
}
export declare function renderQRCode(matrix: QRMatrix, options?: RenderOptions): string;
