#!/usr/bin/env node

/**
 * author: Pieter Heyvaert (pheyvaer.heyvaert@ugent.be)
 * Ghent University - imec - IDLab
 */

const program = require('commander');
const path = require('path');
const fs = require('fs');
const r2y = require('../lib/rml2yarrrml.js');
const pkginfo = require('pkginfo');
const N3 = require('n3');
const namespaces = require('prefix-ns').asMap();

namespaces.ql = 'http://semweb.mmlab.be/ns/ql#';

pkginfo(module, 'version');

program.version(module.exports.version);
program.option('-i, --input <input>', 'input file');
program.option('-o, --output <output>', 'output file (default: stdout)');
program.parse(process.argv);

if (!program.input) {
  console.error('Please provide an input file.');
} else {
  if (!path.isAbsolute(program.input)) {
    program.input = path.join(process.cwd(), program.input);
  }

  try {
    const inputData = fs.readFileSync(program.input, 'utf8');

    if (program.format) {
      program.format = program.format.toUpperCase();
    }

    const parser = N3.Parser();
    const quads = [];

    parser.parse(inputData, (err, quad, prefixes) => {
      if (quad) {
        quads.push(quad);
      } else if (err) {
        console.error('There is a problem with your input.');
        process.exit(1);
      } else {
        r2y(quads, prefixes).then(str => {
          if (program.output) {
            if (!path.isAbsolute(program.output)) {
              program.output = path.join(process.cwd(), program.output);
            }

            try {
              fs.writeFileSync(program.output, str);
            } catch (e) {
              console.error(`The RML could not be written to the output file ${program.output}`);
            }
          } else {
            console.log(str);
          }
        });
      }
    });

  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error(`The input file ${program.input} is not found.`);
    } else if (e.code === 'INVALID_YAML') {
      console.error(`The input file contains invalid YAML.`);
      console.error(`line ${e.parsedLine}: ${e.message}`);
    } else {
      console.error(e);
    }
  }
}
