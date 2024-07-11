# Cromwell CMS node modules manager

## Node modules bundler & loader

Bundles node modules into specific format for Cromwell module loader. Similar to RequireJS.

```sh
yarn cromwell bm
```

Will scan over packages for frontendDependencies array and bundle each module in ./.cromwell/bundled-modules
Cromwell bundler plugins for Rollup and Webpack after building theme or plugin emit imports map which is supposed to be used with such bundled node modules via this cli command.

### Options:

#### "--production"

```sh
yarn cromwell bm --production
```

Will enable production mode of webpack. Development by default.

### Rebundle

```sh
yarn cromwell bm -r
```

Will delete all bundled modules and bundle new.
By default "cromwella b" command bundles only newly found modules that aren't exist in ./.cromwell/bundled-modules (caching)

## Hoisting installation of node_modules in multi-package repositories.

### Deprecated. Use Yarn now.

Simplified alternative of Lerna package manager.
Overall depends on 18 packages in opposite of 750+ for Lerna.

Forces to use same module verions across all packages in development environment.

### Config

Place cromwella.json file in the root of your multi-package repository. Works same as lerna.json:

```json
{
  "packages": ["packages/*", "src/**"]
}
```

### Usage

```sh
yarn cromwell install
```

### Options:

#### "--production"

Install only dependencies from packages, without devDependencies.

```sh
yarn cromwell install --production
```

#### "--path="

Optional. Absolute path to the project root directory with cromwella.json config.

```sh
yarn cromwell install --path=/path/to/my/project
```

#### "-f"

```sh
yarn cromwell install -f
```

Will force to install different versions of modules in node_modules of local packages in development env. By default in "development" environment installation will be aborted with an error in such case.
