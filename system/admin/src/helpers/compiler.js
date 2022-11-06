const { getAdminPanelDir, isExternalForm } = require('@cromwell/core-backend');
const { resolve } = require('path');
const { spawn } = require('child_process');
const normalizePath = require('normalize-path');

let handleError, cyan, stderr;
const loadConfigFile = require('rollup/dist/shared/loadConfigFile.js');
handleError = loadConfigFile.handleError;
cyan = loadConfigFile.cyan;
stderr = loadConfigFile.stderr;

const runWebpackCompiler = () => {
  const webpack = require('webpack');
  const webpackConfig = require(resolve(getAdminPanelDir(), 'webpack.config.js'));
  const compiler = webpack(webpackConfig);

  compiler.hooks.watchRun.tap('adminPanelStart', () => {
    stderr(cyan('\nStart bundling (no type-check) at ' + new Date() + '\n'));
  });
  compiler.hooks.done.tap('adminPanelDone', () => {
    setTimeout(() => {
      stderr(cyan('\nBundle created (no type-check) at ' + new Date() + '\n'));
    }, 100);
  });

  compiler.watch({}, (err, stats) => {
    if (err) console.error(err);
    console.log(
      stats?.toString({
        // eslint-disable-line
        chunks: false,
        colors: true,
      }),
    );
  });
  // app.use(require("webpack-dev-middleware")(compiler, {
  //     publicPath: webpackConfig.output.publicPath
  // }));

  // app.use(require("webpack-hot-middleware")(compiler));
};

const runRollupCompiler = () => {
  const proc = spawn(
    `node --max-old-space-size=4096 --max_old_space_size=4096 ${normalizePath(
      resolve(getAdminPanelDir(), 'src/helpers/compiler.js'),
    )} run-rollup`,
    [],
    { shell: true, stdio: 'pipe', cwd: getAdminPanelDir() },
  );

  if (proc.stderr && proc.stderr.on) {
    proc.stderr.on('data', (data) => {
      console.error(data.toString ? data.toString() : data);
    });
  }
  if (proc.stdout && proc.stdout.on) {
    proc.stdout.on('data', (data) => {
      console.log(data.toString ? data.toString() : data); // eslint-disable-line
    });
  }
};

const runRollupCompilerChildProc = () => {
  const { watch: rollupWatch } = require('rollup');
  const commonjs = require('@rollup/plugin-commonjs');
  const { nodeResolve } = require('@rollup/plugin-node-resolve');
  const typescript = require('rollup-plugin-ts-compiler');

  const watcher = rollupWatch({
    input: resolve(getAdminPanelDir(), 'src/app.ts'),
    output: [
      {
        dir: resolve(getAdminPanelDir(), 'build/temp'),
        format: 'cjs',
      },
    ],
    watch: {
      skipWrite: true,
    },
    external: (id) => {
      if (isExternalForm(id)) return true;
      if (id.endsWith('.css') || id.endsWith('.scss')) return true;
      return false;
    },
    plugins: [
      typescript(),
      nodeResolve({
        preferBuiltins: false,
      }),
      commonjs(),
    ],
  });
  watcher.on('event', onRollupEvent);
};

const onRollupEvent = (event) => {
  switch (event.code) {
    case 'ERROR':
      handleError(event.error, true);
      break;

    case 'BUNDLE_START':
      stderr(cyan(`\nStart type check (TSC)...\n`));
      break;

    case 'END':
      stderr(cyan(`\nEnd type check (TSC)`));
  }
};

const start = () => {
  const scriptName = process.argv[2];

  if (scriptName === 'run-webpack') {
    runWebpackCompiler();
  }
  if (scriptName === 'run-rollup') {
    runRollupCompilerChildProc();
  }
};
start();

module.exports.runWebpackCompiler = runWebpackCompiler;
module.exports.runRollupCompiler = runRollupCompiler;
