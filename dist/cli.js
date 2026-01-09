"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const commander_1 = require("commander");
const generate_1 = require("./generate");
const render_1 = require("./render");
const program = new commander_1.Command();
exports.program = program;
program
    .name('qr')
    .description('Generate QR codes in your terminal')
    .version('1.0.0')
    .argument('[text]', 'Text or URL to encode')
    .option('-i, --invert', 'Invert colors (for light terminals)')
    .option('-l, --large', 'Use large mode (2 chars per module)')
    .option('-o, --output <file>', 'Save as PNG file')
    .action(async (text, options) => {
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
            await (0, generate_1.generateQRPng)(input, options.output);
            console.log(`QR code saved to ${options.output}`);
            return;
        }
        // Generate and render QR code
        const matrix = await (0, generate_1.generateQRMatrix)(input);
        const rendered = (0, render_1.renderQRCode)(matrix, {
            invert: options.invert,
            small: !options.large,
        });
        console.log(rendered);
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
