# Constitution for the Quote CLI

## Core Principles
- The CLI must be user-friendly and provide clear instructions.
- The code must be split into a testable "core" logic file (`core.js`) and a thin "CLI" wrapper (`index.js`).
- All core logic must be covered by unit tests.
- Error handling must be robust, providing clear messages and a non-zero exit code on failure.

## Key Features
1.  By default, the CLI should fetch a random quote from the data source.
2.  The CLI must support a `--by <author>` flag to fetch a quote by a specific author.
3.  The author search should be case-insensitive.
4.  The CLI must handle cases where an author is not found.