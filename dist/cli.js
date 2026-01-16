"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const commander_1 = require("commander");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const generate_1 = require("./generate");
const render_1 = require("./render");
const package_json_1 = __importDefault(require("../package.json"));
const program = new commander_1.Command();
exports.program = program;
program
    .name('qr')
    .description('Generate QR codes in your terminal')
    .version(package_json_1.default.version)
    .argument('[text]', 'Text or URL to encode')
    .option('-i, --invert', 'Invert colors (for light terminals)')
    .option('-l, --large', 'Use large mode (2 chars per module)')
    .addOption(new commander_1.Option('-e, --error <level>', 'Error correction level')
    .choices(['L', 'M', 'Q', 'H'])
    .default('M'))
    .option('--format <format>', 'Output format: text, png, svg')
    .option('--size <px>', 'PNG size in pixels', (value) => Number.parseInt(value, 10))
    .option('--margin <px>', 'Quiet zone margin in modules', (value) => Number.parseInt(value, 10))
    .option('--raw', 'Do not trim input')
    .option('--quiet', 'Suppress non-essential output')
    .option('-o, --output <file>', 'Save output to file, or use "-" for stdout')
    .action(async (text, options) => {
    try {
        // Read from stdin if no text provided
        let input = text;
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
        const errorLevel = options.error;
        const format = resolveFormat(options.format, options.output);
        const outputPath = options.output;
        if (options.size !== undefined && (Number.isNaN(options.size) || options.size <= 0)) {
            throw new Error('Invalid --size value. Use a positive integer.');
        }
        if (options.margin !== undefined && (Number.isNaN(options.margin) || options.margin < 0)) {
            throw new Error('Invalid --margin value. Use 0 or a positive integer.');
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
                const buffer = await (0, generate_1.generateQRPngBuffer)(normalizedInput, generateOptions);
                await writeStdout(buffer);
                return;
            }
            await ensureWritableFilePath(outputPath);
            await (0, generate_1.generateQRPngToFile)(normalizedInput, outputPath, generateOptions);
            if (!options.quiet) {
                console.log(`QR code saved to ${outputPath}`);
            }
            return;
        }
        if (format === 'svg') {
            const svg = await (0, generate_1.generateQRSvg)(normalizedInput, generateOptions);
            if (outputPath && outputPath !== '-') {
                await ensureWritableFilePath(outputPath);
                await promises_1.default.writeFile(outputPath, svg, 'utf8');
                if (!options.quiet) {
                    console.log(`QR code saved to ${outputPath}`);
                }
            }
            else {
                await writeStdout(svg + '\n');
            }
            return;
        }
        // Default: render QR code in terminal
        const matrix = await (0, generate_1.generateQRMatrix)(normalizedInput, generateOptions);
        const rendered = (0, render_1.renderQRCode)(matrix, {
            invert: options.invert,
            small: !options.large,
        });
        if (outputPath && outputPath !== '-') {
            await ensureWritableFilePath(outputPath);
            await promises_1.default.writeFile(outputPath, rendered + '\n', 'utf8');
            if (!options.quiet) {
                console.log(`QR code saved to ${outputPath}`);
            }
            return;
        }
        await writeStdout(rendered + '\n');
    }
    catch (error) {
        console.error('Error generating QR code:', error.message);
        process.exit(1);
    }
});
async function readStdin() {
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
function resolveFormat(format, output) {
    if (format) {
        const normalized = format.toLowerCase();
        if (normalized === 'text' || normalized === 'png' || normalized === 'svg') {
            return normalized;
        }
        throw new Error('Invalid --format value. Use text, png, or svg.');
    }
    if (output && output !== '-') {
        const ext = path_1.default.extname(output).toLowerCase();
        if (ext === '.png')
            return 'png';
        if (ext === '.svg')
            return 'svg';
    }
    return 'text';
}
async function ensureWritableFilePath(filePath) {
    const dir = path_1.default.dirname(filePath);
    try {
        const dirStat = await promises_1.default.stat(dir);
        if (!dirStat.isDirectory()) {
            throw new Error(`Output directory is not a directory: ${dir}`);
        }
    }
    catch (error) {
        const err = error;
        if (err.code === 'ENOENT') {
            throw new Error(`Output directory does not exist: ${dir}`);
        }
        throw error;
    }
    try {
        const fileStat = await promises_1.default.stat(filePath);
        if (fileStat.isDirectory()) {
            throw new Error(`Output path is a directory: ${filePath}`);
        }
    }
    catch (error) {
        const err = error;
        if (err.code !== 'ENOENT') {
            throw error;
        }
    }
}
function writeStdout(data) {
    return new Promise((resolve, reject) => {
        process.stdout.write(data, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
