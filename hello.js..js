const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if '--shout' was typed in the terminal
const shouldShout = process.argv.includes('--shout');

rl.question('What is your name? ', (name) => {
  let greeting = `Hello, ${name}!`;

  // If the --shout flag was found, make the greeting uppercase
  if (shouldShout) {
    greeting = greeting.toUpperCase();
  }

  console.log(greeting);
  rl.close();
});

