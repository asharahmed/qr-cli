"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRMatrix = generateQRMatrix;
exports.generateQRPngBuffer = generateQRPngBuffer;
exports.generateQRPngToFile = generateQRPngToFile;
exports.generateQRSvg = generateQRSvg;
const qrcode_1 = __importDefault(require("qrcode"));
async function generateQRMatrix(text, options = {}) {
    const qr = await qrcode_1.default.create(text, {
        errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
    });
    const size = qr.modules.size;
    const data = [];
    for (let y = 0; y < size; y++) {
        const row = [];
        for (let x = 0; x < size; x++) {
            row.push(qr.modules.get(x, y) === 1);
        }
        data.push(row);
    }
    return { data, size };
}
async function generateQRPngBuffer(text, options = {}) {
    return qrcode_1.default.toBuffer(text, {
        type: 'png',
        width: options.width ?? 400,
        margin: options.margin ?? 2,
        errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
    });
}
async function generateQRPngToFile(text, outputPath, options = {}) {
    await qrcode_1.default.toFile(outputPath, text, {
        type: 'png',
        width: options.width ?? 400,
        margin: options.margin ?? 2,
        errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
    });
}
async function generateQRSvg(text, options = {}) {
    return qrcode_1.default.toString(text, {
        type: 'svg',
        margin: options.margin ?? 2,
        errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
    });
}
