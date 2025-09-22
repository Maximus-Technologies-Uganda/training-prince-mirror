#!/usr/bin/env node
import { convertTemperature } from './core.js';

function run() {
  const args = process.argv.slice(2);

  const tempRaw = (args[0] || '').trim();
  const tempArg = Number(tempRaw);
  const fromIndex = args.indexOf('--from');
  const toIndex = args.indexOf('--to');

  const fromUnitRaw = fromIndex !== -1 ? (args[fromIndex + 1] || '').trim() : null;
  const toUnitRaw = toIndex !== -1 ? (args[toIndex + 1] || '').trim() : null;
  const fromUnit = fromUnitRaw ? fromUnitRaw.toUpperCase() : null;
  const toUnit = toUnitRaw ? toUnitRaw.toUpperCase() : null;

  if (!Number.isFinite(tempArg) || tempRaw === '' || !fromUnit || !toUnit) 
  {
    console.log('--- Temperature Converter ---');
    console.error('Usage: node src/temp-converter/index.js <temperature> --from <C|F> --to <C|F>');
    console.error('Example: node src/temp-converter/index.js 100 --from C --to F');
    process.exitCode = 1;
    return;
  }

  try {
    const result = convertTemperature(tempArg, fromUnit, toUnit);
    // .toFixed(2) rounds the result to 2 decimal places
    console.log(`${tempArg}°${fromUnit} is ${result.toFixed(2)}°${toUnit}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

run();