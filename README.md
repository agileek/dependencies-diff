# diff-packages
[![Build Status](https://travis-ci.org/agileek/diff-packages.svg)](https://travis-ci.org/agileek/diff-packages)

Shows a diff of dependencies between N packages.json

Useful when migrating to yarn workspaces

## Install
```sh
npm i -g diff-packages (Or use npx)
```

## Usage
```sh
# Use packages
diff-packages /foo/bar/package.json /path/to/comparing/node_modules

# Specify devDependencies in packages
diff-packages --dev package.json /other/package.json

# Want to see both ?
diff-packages --both package.json /other/package.json

# Want to fail on pour CI?
CI=true diff-packages --both package.json /other/package.json
```


