[![Build Status](https://travis-ci.org/panter/htmlint.svg?branch=master)](https://travis-ci.org/panter/htmlint)

# htmlint
Lints HTML snippets.

## Features
- Detects inconsistent tag structure.

## Installation

```shell
npm install htmlinter
```

## Usage

### From the command line
```shell
node node_modules/htmlint path/to/some.html
```

### From a script

#### Lint strings
```js
const htmlint = require('./htmlint');
htmlint.checkString('<a></b>').then((issues) => {
  issues.forEach((issue) => {
    console.log(issue.print());
  });
});

// Output:
// Closing tag mismatch for <b> detected at line 1, column 4
// Unclosed element for <a> detected at line 1, column 1
```

#### Lint files
```js
const htmlint = require('./htmlint');
htmlint.checkString('path/to/some.html').then((issues) => {
  issues.forEach((issue) => {
    console.log(issue.print());
  });
});
```

## Planned Features
- [ ] Formatting checks and rules.
- [ ] VIM integration (e.g. via ALE).
