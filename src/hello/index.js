#!/usr/bin/env node
// --- Core Logic ---
// A "pure" function that is easy to test. It doesn't know about the
// command line; it just takes inputs and returns an output.
export function formatGreeting(name = 'World', shout = false) {
  let greeting = `Hello, ${name}!`;
  if (shout) {
    greeting = greeting.toUpperCase();
  }
  return greeting;
}

function showHelp() {
  console.log('Usage: node src/hello/index.js [name] [--shout] [--version]');
  console.log('Options:');
  console.log('  --shout    Make the greeting uppercase');
  console.log('  --version  Show version information');
}

// --- CLI Logic ---
// This part deals with the command line. It's a thin wrapper
// around our core logic.
export function run(argv = process.argv.slice(2)) {
  // Find the argument for the name (anything not starting with --)
  const nameArg = argv.find(arg => !arg.startsWith('--'));
  
  // Find the flag to shout
  const shoutArg = argv.includes('--shout');
  const versionArg = argv.includes('--version');

  // Validate flags - check for unknown flags
  const validFlags = ['--shout', '--version'];
  const unknownFlags = argv.filter(arg => arg.startsWith('--') && !validFlags.includes(arg));
  
  if (unknownFlags.length > 0) {
    console.error(`Error: Unknown flag(s): ${unknownFlags.join(', ')}`);
    showHelp();
    process.exitCode = 1;
    return 1;
  }

  if (versionArg) {
    console.log('Hello CLI v1.0.0');
    process.exitCode = 0;
    return 0;
  }

  if (shoutArg && !nameArg) {
    console.error('Error: --shout requires a name.');
    showHelp();
    process.exitCode = 1;
    return 1;
  }

  const message = formatGreeting(nameArg, shoutArg);
  console.log(message);
  process.exitCode = 0;
  return 0;
}

// This line makes the script runnable from the command line.
if (import.meta.url === `file://${process.argv[1]}`) {
  run();
}
