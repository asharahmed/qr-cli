export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export interface QRMatrix {
    data: boolean[][];
    size: number;
}
export interface GenerateOptions {
    errorCorrectionLevel?: ErrorCorrectionLevel;
    margin?: number;
    width?: number;
}
export declare function generateQRMatrix(text: string, options?: GenerateOptions): Promise<QRMatrix>;
export declare function generateQRPngBuffer(text: string, options?: GenerateOptions): Promise<Buffer>;
export declare function generateQRPngToFile(text: string, outputPath: string, options?: GenerateOptions): Promise<void>;
export declare function generateQRSvg(text: string, options?: GenerateOptions): Promise<string>;
