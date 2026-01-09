import QRCode from 'qrcode';

export interface QRMatrix {
  data: boolean[][];
  size: number;
}

export async function generateQRMatrix(text: string): Promise<QRMatrix> {
  const qr = await QRCode.create(text, { errorCorrectionLevel: 'M' });
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

export async function generateQRPng(text: string, outputPath: string): Promise<void> {
  await QRCode.toFile(outputPath, text, {
    type: 'png',
    width: 400,
    margin: 2,
  });
}
