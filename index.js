#! /usr/bin/env node
const { getDiffs, parseArgs, displayResults } = require("./main");

const { packagesToCompare, option } = parseArgs(process.argv);
const results = getDiffs(option, packagesToCompare);

displayResults(process.env.CI, results);
