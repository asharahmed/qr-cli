import QRCode from 'qrcode';

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

export async function generateQRMatrix(
  text: string,
  options: GenerateOptions = {}
): Promise<QRMatrix> {
  const qr = await QRCode.create(text, {
    errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
  });
  const size = qr.modules.size;
  const data: boolean[][] = [];

  for (let y = 0; y < size; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < size; x++) {
      row.push(qr.modules.get(x, y) === 1);
    }
    data.push(row);
  }

  return { data, size };
}

export async function generateQRPngBuffer(
  text: string,
  options: GenerateOptions = {}
): Promise<Buffer> {
  return QRCode.toBuffer(text, {
    type: 'png',
    width: options.width ?? 400,
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
  });
}

export async function generateQRPngToFile(
  text: string,
  outputPath: string,
  options: GenerateOptions = {}
): Promise<void> {
  await QRCode.toFile(outputPath, text, {
    type: 'png',
    width: options.width ?? 400,
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
  });
}

export async function generateQRSvg(
  text: string,
  options: GenerateOptions = {}
): Promise<string> {
  return QRCode.toString(text, {
    type: 'svg',
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
  });
}
