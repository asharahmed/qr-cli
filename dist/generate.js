"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRMatrix = generateQRMatrix;
exports.generateQRPng = generateQRPng;
const qrcode_1 = __importDefault(require("qrcode"));
async function generateQRMatrix(text) {
    const qr = await qrcode_1.default.create(text, { errorCorrectionLevel: 'M' });
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
async function generateQRPng(text, outputPath) {
    await qrcode_1.default.toFile(outputPath, text, {
        type: 'png',
        width: 400,
        margin: 2,
    });
}
