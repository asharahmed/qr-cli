#!/usr/bin/env node
import { program } from './cli';

program.parseAsync(process.argv).catch((error) => {
  console.error('Error:', (error as Error).message);
  process.exit(1);
});
