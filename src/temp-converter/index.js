#!/usr/bin/env node
import { convertTemperature } from './core.js';

function run() {
  const args = process.argv.slice(2);

  const tempArg = parseFloat(args[0]);
  const fromIndex = args.indexOf('--from');
  const toIndex = args.indexOf('--to');

  const fromUnit = fromIndex !== -1 ? args[fromIndex + 1]?.toUpperCase() : null;
  const toUnit = toIndex !== -1 ? args[toIndex + 1]?.toUpperCase() : null;

  if (isNaN(tempArg) || !fromUnit || !toUnit) {
    console.log('--- Temperature Converter ---');
    console.error('Usage: node <file> <temperature> --from <C|F> --to <C|F>');
    console.error('Example: node src/temp-converter/index.js 100 --from C --to F');
    return;
  }

  try {
    const result = convertTemperature(tempArg, fromUnit, toUnit);
    // .toFixed(2) rounds the result to 2 decimal places
    console.log(`${tempArg}°${fromUnit} is ${result.toFixed(2)}°${toUnit}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

run();