import { Command, Option } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import {
  ErrorCorrectionLevel,
  generateQRMatrix,
  generateQRPngBuffer,
  generateQRPngToFile,
  generateQRSvg,
} from './generate';
import { renderQRCode } from './render';
import pkg from '../package.json';

const program = new Command();

program
  .name('qr')
  .description('Generate QR codes in your terminal')
  .version(pkg.version)
  .argument('[text]', 'Text or URL to encode')
  .option('-f, --file <path>', 'Read input from a file')
  .option('-i, --invert', 'Invert colors (for light terminals)')
  .option('-l, --large', 'Use large mode (2 chars per module)')
  .addOption(
    new Option('-e, --error <level>', 'Error correction level')
      .choices(['L', 'M', 'Q', 'H'])
      .default('M')
  )
  .option('--format <format>', 'Output format: text, png, svg')
  .option('--size <px>', 'PNG size in pixels', (value) => Number.parseInt(value, 10))
  .option('--margin <px>', 'Quiet zone margin in modules', (value) => Number.parseInt(value, 10))
  .option('--border <modules>', 'Text output quiet zone (modules)', (value) =>
    Number.parseInt(value, 10)
  )
  .option('--raw', 'Do not trim input')
  .option('--quiet', 'Suppress non-essential output')
  .option('-o, --output <file>', 'Save output to file, or use "-" for stdout')
  .action(async (text: string | undefined, options) => {
    try {
      // Read from stdin if no text provided
      let input = text;

      if (options.file) {
        input = await fs.readFile(options.file, 'utf8');
      }

      if (!input) {
        input = await readStdin();
      }

      if (input === '') {
        console.error('Error: No input provided');
        console.error('Usage: qr <text> or echo "text" | qr');
        process.exit(1);
      }

      const normalizedInput = options.raw ? input : input.trim();
      if (!options.raw && normalizedInput === '') {
        console.error('Error: No input provided');
        console.error('Usage: qr <text> or echo "text" | qr');
        process.exit(1);
      }

      const errorLevel = String(options.error).toUpperCase() as ErrorCorrectionLevel;
      const format = resolveFormat(options.format, options.output);
      const outputPath: string | undefined = options.output;
      const border = options.border;

      if (options.size !== undefined && (Number.isNaN(options.size) || options.size <= 0)) {
        throw new Error('Invalid --size value. Use a positive integer.');
      }

      if (options.margin !== undefined && (Number.isNaN(options.margin) || options.margin < 0)) {
        throw new Error('Invalid --margin value. Use 0 or a positive integer.');
      }

      if (border !== undefined && (Number.isNaN(border) || border < 0)) {
        throw new Error('Invalid --border value. Use 0 or a positive integer.');
      }

      const generateOptions = {
        errorCorrectionLevel: errorLevel,
        width: options.size,
        margin: options.margin,
      };

      if (format === 'png') {
        if (!outputPath || outputPath === '-') {
          if (process.stdout.isTTY) {
            throw new Error('Refusing to write PNG to terminal. Use -o <file> or pipe output.');
          }
          const buffer = await generateQRPngBuffer(normalizedInput, generateOptions);
          await writeStdout(buffer);
          return;
        }

        await ensureWritableFilePath(outputPath);
        await generateQRPngToFile(normalizedInput, outputPath, generateOptions);
        if (!options.quiet) {
          console.log(`QR code saved to ${outputPath}`);
        }
        return;
      }

      if (format === 'svg') {
        const svg = await generateQRSvg(normalizedInput, generateOptions);
        if (outputPath && outputPath !== '-') {
          await ensureWritableFilePath(outputPath);
          await fs.writeFile(outputPath, svg, 'utf8');
          if (!options.quiet) {
            console.log(`QR code saved to ${outputPath}`);
          }
        } else {
          await writeStdout(svg + '\n');
        }
        return;
      }

      // Default: render QR code in terminal
      const matrix = await generateQRMatrix(normalizedInput, generateOptions);
      const rendered = renderQRCode(matrix, {
        invert: options.invert,
        small: !options.large,
        border: border,
      });

      if (outputPath && outputPath !== '-') {
        await ensureWritableFilePath(outputPath);
        await fs.writeFile(outputPath, rendered + '\n', 'utf8');
        if (!options.quiet) {
          console.log(`QR code saved to ${outputPath}`);
        }
        return;
      }

      await writeStdout(rendered + '\n');
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

  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
      }
    });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

export { program };

function resolveFormat(format: string | undefined, output: string | undefined): 'text' | 'png' | 'svg' {
  if (format) {
    const normalized = format.toLowerCase();
    if (normalized === 'text' || normalized === 'png' || normalized === 'svg') {
      return normalized;
    }
    throw new Error('Invalid --format value. Use text, png, or svg.');
  }

  if (output && output !== '-') {
    const ext = path.extname(output).toLowerCase();
    if (ext === '.png') return 'png';
    if (ext === '.svg') return 'svg';
  }

  return 'text';
}

async function ensureWritableFilePath(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);

  try {
    const dirStat = await fs.stat(dir);
    if (!dirStat.isDirectory()) {
      throw new Error(`Output directory is not a directory: ${dir}`);
    }
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      throw new Error(`Output directory does not exist: ${dir}`);
    }
    throw error;
  }

  try {
    const fileStat = await fs.stat(filePath);
    if (fileStat.isDirectory()) {
      throw new Error(`Output path is a directory: ${filePath}`);
    }
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== 'ENOENT') {
      throw error;
    }
  }
}

function writeStdout(data: string | Buffer): Promise<void> {
  return new Promise((resolve, reject) => {
    process.stdout.write(data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
