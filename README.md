# dependencies-diff
Shows a diff of dependencies between N packages.json

## Install
```sh
npm i -g dependencies-diff
```

## Usage
```sh
# Use packages
dependencies-diff /foo/bar/package.json /path/to/comparing/node_modules

# Specify devDependencies in packages
package-diff package.json:dev /other/package.json
```

<img src="http://i.imgur.com/t62kyql.jpg">
