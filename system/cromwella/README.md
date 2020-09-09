# Cromwella package manager.

```sh
npm i @cromwell/cromwella
```

Simplified version of Lerna package manager.
Overall depends on 18 packages in opposite of 750+ for Lerna.
Forces to use same module verions across all packages in development environment. 

## Usage

Install all packages:
```sh
npx cromwella
```

Install only "dependencies" without "devDependencies":
```sh
npx cromwella --env=production
```

Args:
- "--path" optional, path to project root directory
- "--env" optional, can be: "development" or "production". "development" by default. In "production" env will be installed only dependencies from packages. In "development" devDependencies additionally.
- "-f" will force to install different versions of modules in node_modules of local packages in development env. By default in "development" environment installation will be aborted with an error in such case.