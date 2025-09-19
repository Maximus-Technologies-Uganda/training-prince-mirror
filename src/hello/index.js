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

// --- CLI Logic ---
// This part deals with the command line. It's a thin wrapper
// around our core logic.
function runCli() {
  // process.argv contains the command line arguments. The first two are 'node'
  // and the file path, so the real arguments start at index 2.
  const args = process.argv.slice(2);
  
  // Find the argument for the name (anything not starting with --)
  const nameArg = args.find(arg => !arg.startsWith('--'));
  
  // Find the flag to shout
  const shoutArg = args.includes('--shout');

  const message = formatGreeting(nameArg, shoutArg);
  console.log(message);
}

// This line makes the script runnable from the command line.
runCli();
