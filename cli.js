#!/usr/bin/env node

'use strict';

const program = require('commander');
const fs      = require('fs');
const Parser  = require('./src/parser');

program
.option('-i, --indentation <depth>', 'Number of spaces to use for indentation.', process.cwd())
.option('-n, --ignore-formatting', 'Ignore formatting inconsistencies.')
.option('-f, --format', 'Format the given file.')
.version(require('./package.json').version, '-v, --version');

program
.on('--help', () => {
  console.log('');
  console.log('  Description:');
  console.log('');
  console.log('    Valdidates structure and formatting of HTML templates.');
  console.log('');
  console.log('    Lint files:');
  console.log('    $ htmlint path/to/some.html');
  console.log('');
  console.log('    Autoformat files:');
  console.log('    $ htmlint -f path/to/some.html');
  console.log('');
  console.log('    Made with ♥ by Panter (www.panter.ch).');
});

program.parse(process.argv);

let path;

if (program.args.length > 0) {
  path = program.args.length[0];
} else {
  console.log('No file specified. Consult --help for instructions.');
  process.exit(1);
}

const parser = new Parser(program);

parser.parse(fs.createReadStream(path)).on('end', () => {
  parser.issues.forEach((issue) => {
    console.log(issue.print());
  });
});
