#! /usr/bin/env node
const colors = require("colors/safe");
const { getDiffs } = require("./main");

const parameters = [];
for (let i = 2; i < process.argv.length; i++) {
  parameters.push(process.argv[i]);
}

const packagesToCompare = parameters.filter(parameter => parameter !== "--dev");

const result = getDiffs(packagesToCompare.length === parameters.length, packagesToCompare);

result.forEach(({ dependency, versions }) => {
  if (versions.length > 1) {
    console.info(colors.red(`  "${dependency}": "${versions}"`));
  } else {
    console.info(`  "${dependency}": "${versions}"`);
  }
});
