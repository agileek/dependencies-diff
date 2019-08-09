#! /usr/bin/env node
const colors = require("colors/safe");
const { getDiffs, OptionsEnum } = require("./main");

const parameters = [];
for (let i = 2; i < process.argv.length; i++) {
  parameters.push(process.argv[i]);
}

const packagesToCompare = parameters.filter(parameter => parameter !== "--dev" && parameter !== "--prod" && parameter !== "--both");

const optionUsed = packagesToCompare.length !== parameters.length;

let option = OptionsEnum.prod;
if (optionUsed) {
  if (parameters.find(parameter => parameter === "--both")) {
    option = OptionsEnum.both;
  }
  if (parameters.find(parameter => parameter === "--dev")) {
    option = OptionsEnum.dev;
  }
}

const result = getDiffs(option, packagesToCompare);

result.forEach(({ dependency, versions }) => {
  if (versions.length > 1) {
    console.info(colors.red(`  "${dependency}": "${versions}"`));
  } else {
    console.info(`  "${dependency}": "${versions}"`);
  }
});
