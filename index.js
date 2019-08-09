#! /usr/bin/env node
const colors = require("colors/safe");
const fs = require("fs");

function readModules(location) {
  const table = {};
  if (location.indexOf("package.json") !== -1) {
    const data = fs.readFileSync(location.replace(":dev", ""), "utf-8");
    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch (e) {
      parsed = false;
    }
    if (!parsed) {
      return;
    }

    const depsKey = location.indexOf(":dev") !== -1 ? "devDependencies" : "dependencies";
    const deps = parsed[depsKey] ? parsed[depsKey] : parsed.dependencies || parsed.devDependencies;
    return {
      name: `${location} {${depsKey}}`,
      deps
    };
  }

  return {
    name: location,
    deps: table
  };
}

const packagesToCompare = [];
for (let i = 2; i < process.argv.length; i + 1) {
  packagesToCompare.push(process.argv[i]);
}

if (packagesToCompare.length < 2) {
  console.error(colors.red("At least two packages.json must be provided"));
  process.exit(1);
}

const modules = packagesToCompare.map(readModules);

const keys = [...new Set(modules.map(module => Object.keys(module.deps)).reduce((x, y) => x.concat(y), []))].sort();

keys.forEach(baseKey => {
  const keyVersions = new Set();
  modules.forEach(module => {
    if (baseKey in module.deps) {
      keyVersions.add(module.deps[baseKey]);
    }
  });
  if (keyVersions.size > 1) {
    console.info(colors.red(`  "${baseKey}": "${[...keyVersions]}"`));
  } else {
    console.info(`  "${baseKey}": "${[...keyVersions]}"`);
  }
});
