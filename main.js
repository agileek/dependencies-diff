#! /usr/bin/env node
const colors = require("colors/safe");
const fs = require("fs");

function readModules(prodDependencies, location) {
  const data = fs.readFileSync(location, "utf-8");
  const parsed = JSON.parse(data);

  const deps = prodDependencies ? parsed.dependencies : parsed.devDependencies;
  return {
    name: `${location}`,
    deps
  };
}

function getDiffs(prodDependencies = true, packages) {
  if (packages.length < 2) {
    console.error(colors.red(`At least two packages.json must be provided ${process.argv}`));
    process.exit(1);
  }

  const modules = packages.map(currentPackage => readModules(prodDependencies, currentPackage));

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

module.exports = { getDiffs };
