[![Build Status](https://travis-ci.org/panter/htmlint.svg?branch=master)](https://travis-ci.org/panter/htmlint)

# htmlint
Lints HTML snippets.

![linting example](demo.gif?raw=true)

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

## VIM integration

See [ALE fork](https://github.com/kaethorn/ale).

## Planned Features
- Autoformat according to formatting rules.
