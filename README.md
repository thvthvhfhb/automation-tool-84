# automation-tool-84

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

automation-tool-84 is a Node.js command-line tool for running custom JavaScript automations. It helps developers execute repetitive tasks such as data processing, file management, and API interactions with minimal configuration.

## Features
- Define tasks using standard JavaScript with async support
- Run scripts sequentially or in parallel from a single command
- Built-in utilities for file operations and HTTP requests
- Automatic logging with execution reports and error details

## Installation

```bash
npm install -g automation-tool-84
```

For local setup:

```bash
git clone https://github.com/Developer/automation-tool-84.git
cd automation-tool-84
npm install
```

## Usage

Create a file `task.js`:

```js
module.exports = async () => {
  console.log('Starting automation...');
  // Add your task logic here
};
```

Execute the script:

```bash
automation-tool-84 run task.js
```

## License

MIT © Developer