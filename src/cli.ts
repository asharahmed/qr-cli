import { Command } from 'commander';
import { generateQRMatrix, generateQRPng } from './generate';
import { renderQRCode } from './render';

const program = new Command();

program
  .name('qr')
  .description('Generate QR codes in your terminal')
  .version('1.0.0')
  .argument('[text]', 'Text or URL to encode')
  .option('-i, --invert', 'Invert colors (for light terminals)')
  .option('-l, --large', 'Use large mode (2 chars per module)')
  .option('-o, --output <file>', 'Save as PNG file')
  .action(async (text: string | undefined, options) => {
    try {
      // Read from stdin if no text provided
      let input = text;
      if (!input) {
        input = await readStdin();
      }

      if (!input || input.trim() === '') {
        console.error('Error: No input provided');
        console.error('Usage: qr <text> or echo "text" | qr');
        process.exit(1);
      }

      input = input.trim();

      // Generate PNG if output specified
      if (options.output) {
        await generateQRPng(input, options.output);
        console.log(`QR code saved to ${options.output}`);
        return;
      }

      // Generate and render QR code
      const matrix = await generateQRMatrix(input);
      const rendered = renderQRCode(matrix, {
        invert: options.invert,
        small: !options.large,
      });

      console.log(rendered);
    } catch (error) {
      console.error('Error generating QR code:', (error as Error).message);
      process.exit(1);
    }
  });

async function readStdin(): Promise<string> {
  // Check if stdin is a TTY (interactive terminal)
  if (process.stdin.isTTY) {
    return '';
  }

  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
      }
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
  });
}

export { program };
