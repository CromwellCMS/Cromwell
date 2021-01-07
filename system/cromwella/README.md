# Cromwell CMS node modules manager (Cromwella) 

```sh
npm i @cromwell/cromwella
```

## 1. Manages hoisting installation of node_modules in multi-package repositories.

Simplified alternative of Lerna package manager.
Overall depends on 18 packages in opposite of 750+ for Lerna.

Forces to use same module verions across all packages in development environment. 

### Config
Place cromwella.json file in the root of your multi-package repository. Works same as lerna.json:

```json
{
  "packages": [
    "packages/*", 
    "src/**"
  ]
}
```

### Usage

Install all packages:
```sh
npx cromwella
```

### Options:

#### "--production" 
Install only dependencies from packages, without devDependencies.
```sh
npx cromwella --production
```

#### "--path=" 
Optional. Absolute path to the project root directory with cromwella.json config.
```sh
npx cromwella --path=/path/to/my/project
```

#### "-f"
```sh
npx cromwella -f
```
Will force to install different versions of modules in node_modules of local packages in development env. By default in "development" environment installation will be aborted with an error in such case.


## Node modules bundler & loader

Bundles node modules into specific format for Cromwell module loader. Similar to RequireJS.

```sh
npx cromwella b
``` 
Will scan over packages for frontendDependencies array and bundle each module in ./.cromwell/bundled-modules
Cromwell bundler plugins for Rollup and Webpack after building theme or plugin emit imports map which is supposed to be used with such bundled node modules via this cli command.

### Options:

#### "--production" 
```sh
npx cromwella b --production
``` 
Will enable production mode of webpack. Development by default.

### Rebundle
```sh
npx cromwella r
``` 
Will delete all bundled modules and bundle new. 
By default "cromwella b" command bundles only newly found modules that aren't exist in ./.cromwell/bundled-modules (caching)
