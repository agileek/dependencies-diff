#! /usr/bin/env node
const colors = require("colors/safe");
const { getDiffs } = require("./main");

const packagesToCompare = [];
for (let i = 2; i < process.argv.length; i++) {
  packagesToCompare.push(process.argv[i]);
}

const prodDependencies = packagesToCompare[0].indexOf(":dev") === -1;

const result = getDiffs(prodDependencies, packagesToCompare);

result.forEach(({ dependency, versions }) => {
  if (versions.length > 1) {
    console.info(colors.red(`  "${dependency}": "${versions}"`));
  } else {
    console.info(`  "${dependency}": "${versions}"`);
  }
});
