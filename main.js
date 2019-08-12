#! /usr/bin/env node
const fs = require("fs");
const cliOptions = ["--dev", "--prod", "--both", "--ci"];

function readModules(dependencies, location) {
  const data = fs.readFileSync(location, "utf-8");
  const parsed = JSON.parse(data);
  let deps = {};
  switch (dependencies) {
    case OptionsEnum.prod:
      deps = { ...parsed.dependencies };
      break;
    case OptionsEnum.dev:
      deps = { ...parsed.devDependencies };
      break;
    case OptionsEnum.both:
      deps = { ...parsed.dependencies, ...parsed.devDependencies };
      break;
  }
  return {
    name: `${location}`,
    deps
  };
}

const OptionsEnum = Object.freeze({ dev: "devDependencies", prod: "prodDependencies", both: "both" });
function getDiffs(dependencies = OptionsEnum.prod, packages) {
  if (packages.length < 2) {
    console.error(red(`At least two packages.json must be provided ${process.argv}`));
    process.exit(1);
  }

  const modules = packages.map(currentPackage => readModules(dependencies, currentPackage)).filter(module => module.deps !== undefined);
  const keys = [...new Set(modules.map(module => Object.keys(module.deps)).reduce((x, y) => x.concat(y), []))].sort();
  const result = [];
  keys.forEach(baseKey => {
    const keyVersions = new Set();
    modules.forEach(module => {
      if (baseKey in module.deps) {
        keyVersions.add(module.deps[baseKey]);
      }
    });
    result.push({ dependency: baseKey, versions: [...keyVersions] });
  });
  return result;
}

function parseArgs(commandLineArguments) {
  const parameters = [];
  for (let i = 2; i < commandLineArguments.length; i++) {
    parameters.push(commandLineArguments[i]);
  }
  const packagesToCompare = parameters.filter(parameter => !cliOptions.includes(parameter));

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
  return { packagesToCompare, option };
}
function red(textMessage) {
  return `\x1b[31m${textMessage}\x1b[0m`;
}
function displayResults(ci, results) {
  let differenceFound = false;
  results.forEach(({ dependency, versions }) => {
    if (versions.length > 1) {
      differenceFound = true;
      console.info(red(`  "${dependency}": "${versions}"`));
    } else {
      if (!ci) {
        console.info(`  "${dependency}": "${versions}"`);
      }
    }
  });
  if (differenceFound && ci) {
    process.exit(1);
  }
}

module.exports = { getDiffs, OptionsEnum, parseArgs, displayResults };
