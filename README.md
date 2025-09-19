# Week 1 CLI Projects

> How to review me:
> - Go to GitHub Actions → latest run for `review-packet` on `development`.
> - Download the artifact named `review-packet`.
> - Open `review-artifacts/index.html` for the Coverage Index and links.

### Installation
- **Clone the repository**
- **Navigate into the project directory**
- **Install dependencies**

```bash
npm install
```

### Running Tests
Run the full test suite:

```bash
npm test
```

### Usage Examples

#### Hello CLI
- **Default greeting**

```bash
node src/hello/index.js
```

- **Greeting with a name**

```bash
node src/hello/index.js Alice
```

- **Greeting with a name and --shout flag**

```bash
node src/hello/index.js Alice --shout
```

- **Run via npx (after building/publishing or with `npm link`)**

```bash
npx . hello-cli Alice --shout
```

#### Stopwatch CLI
- **Start the stopwatch (resets any previous state)**

```bash
node src/stopwatch/index.js start
```

- **Record a lap**

```bash
node src/stopwatch/index.js lap
```

- **Run via npx**

```bash
npx . stopwatch-cli start
npx . stopwatch-cli lap
```

#### Temperature Converter CLI
- **Convert Celsius to Fahrenheit**

```bash
node src/temp-converter/index.js 100 --from C --to F
```

- **Convert Fahrenheit to Celsius**

```bash
node src/temp-converter/index.js 32 --from F --to C
```

- **Example that would cause an error (identical units)**

```bash
node src/temp-converter/index.js 100 --from C --to C
```

- **Run via npx**

```bash
npx . temp-cli 100 --from C --to F
```

If invalid or identical units are provided, the CLI will print an error message.
