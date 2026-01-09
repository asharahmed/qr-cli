export interface QRMatrix {
    data: boolean[][];
    size: number;
}
export declare function generateQRMatrix(text: string): Promise<QRMatrix>;
export declare function generateQRPng(text: string, outputPath: string): Promise<void>;
