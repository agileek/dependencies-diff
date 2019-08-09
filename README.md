# dependencies-diff
[![Build Status](https://travis-ci.org/agileek/dependencies-diff.svg)](https://travis-ci.org/agileek/dependencies-diff)

Shows a diff of dependencies between N packages.json

Useful when migrating to yarn workspaces

## Install
```sh
npm i -g dependencies-diff
```

## Usage
```sh
# Use packages
dependencies-diff /foo/bar/package.json /path/to/comparing/node_modules

# Specify devDependencies in packages
dependencies-diff --dev package.json /other/package.json
```


