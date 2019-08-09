#! /usr/bin/env node
const colors = require("colors/safe");
const fs = require("fs");

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
    console.error(colors.red(`At least two packages.json must be provided ${process.argv}`));
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

module.exports = { getDiffs, OptionsEnum };
