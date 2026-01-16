#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("./cli");
cli_1.program.parseAsync(process.argv).catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
});
