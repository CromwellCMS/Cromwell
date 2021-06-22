import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import { resolve } from 'path';

export const sleep = (time: number) => new Promise(done => setTimeout(done, time * 1000));

export const createTask = async (name?: string, noInstall?: boolean, type?: string) => {
  if (!name) {
    console.error('You must provide App name, eg.: npx crw create my-app')
    return;
  }

  const dir = resolve(process.cwd(), name + '');
  await fs.ensureDir(dir);

  const pckg: any = {
    "name": name,
    "version": "1.0.0",
    "description": "",
    "keywords": [],
    "author": "",
    "files": [
      "build",
      "static",
      "cromwell.config.js"
    ],
  }

  if (type === 't') type = 'theme';
  if (type === 'p') type = 'plugin';

  if (type === 'theme' || type === 'plugin') {
    pckg.cromwell = {
      "type": type,
      "title": "",
      "image": "",
      "excerpt": "",
      "description": "",
      "author": "",
      "plugins": [],
      "frontendDependencies": [],
      "firstLoadedDependencies": []
    }
    if (type === 'plugin') {
      delete pckg.cromwell.firstLoadedDependencies;
    }

    pckg.scripts = {
      "build": "npx cromwell b",
      "watch": "npx cromwell b -w"
    }

    fs.outputFileSync(resolve(dir, '.gitignore'),
      `/.cromwell
/build
/public
node_modules/
*.tsbuildinfo`);

    fs.ensureDirSync(resolve(dir, 'static'));
  }

  fs.outputJSONSync(resolve(dir, 'package.json'), pckg, { spaces: 2 });


  if (!noInstall) {
    if (type === 'theme' || type === 'plugin') {

      spawnSync(`npm i @cromwell/cms @cromwell/core @cromwell/core-frontend @cromwell/core-backend @rollup/plugin-commonjs @rollup/plugin-json rollup-plugin-postcss rollup-plugin-terser rollup-plugin-ts-compiler react react-dom  -D`
        , [], { shell: true, stdio: 'inherit', cwd: dir });

    } else {
      spawnSync(`npm i @cromwell/cms @cromwell/theme-store @cromwell/theme-blog @cromwell/plugin-main-menu @cromwell/plugin-newsletter @cromwell/plugin-product-filter @cromwell/plugin-product-showcase --save-exact`
        , [], { shell: true, stdio: 'inherit', cwd: dir });
    }
  }


  // Theme boilerplate
  if (type === 'theme') {
    fs.outputFileSync(resolve(dir, 'cromwell.config.js'),
      `module.exports = {
  rollupConfig: () => {
    const commonjs = require('@rollup/plugin-commonjs');
    const json = require('@rollup/plugin-json');
    const postcss = require('rollup-plugin-postcss');
    const { terser } = require('rollup-plugin-terser');
    const typescript = require('rollup-plugin-ts-compiler');
    const tsSharedState = {};

    const getDefaultPlugins = () => [
      typescript({
        sharedState: tsSharedState,
        monorepo: true,
      }),
      commonjs(),
      json(),
    ];

    return {
      main: {
        plugins: [
          ...getDefaultPlugins(),
        ]
      },
      adminPanel: {
        plugins: [
          ...getDefaultPlugins(),
          terser({
            compress: {
              side_effects: false,
              negate_iife: false,
            }
          }),
          postcss({
            extract: false,
            modules: true,
            writeDefinitions: false,
            inject: true,
            use: ['sass'],
          }),
        ]
      },
    }
  },
  defaultPages: {
    index: 'index',
    category: 'category/[slug]',
    product: 'product/[slug]',
    post: 'blog/[slug]',
    tag: 'tag/[slug]',
    pages: 'pages/[slug]',
    account: 'account',
  },
  pages: [
    {
      id: "index",
      route: "index",
      name: "Home",
      title: "Home page",
      modifications: []
    },
  ],
};`);

    fs.outputFileSync(resolve(dir, 'src/pages/index.tsx'),
      `import { TCromwellPage, TGetStaticProps } from '@cromwell/core';
import React from 'react';

type IdexProps = {
  data: string;
}
const IndexPage: TCromwellPage<IdexProps> = (props) => (
  <div>
    <h1>Hello {props.data}</h1>
  </div>
)
    
export default IndexPage;
    
export const getStaticProps: TGetStaticProps = async (context): Promise<IdexProps> => {
  return {
    data: 'world'
  }
}`);

    fs.outputJSONSync(resolve(dir, 'tsconfig.json'), {
      "compilerOptions": {
        "target": "ES2019",
        "module": "ESNext",
        "baseUrl": ".",
        "jsx": "react",
        "strict": true,
        "esModuleInterop": true,
        "isolatedModules": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "strictPropertyInitialization": false,
        "resolveJsonModule": true,
        "importHelpers": true,
        "moduleResolution": "node",
        "skipLibCheck": true,
      },
      "exclude": [
        "node_modules",
        "build"
      ],
      "include": [
        "src/**/*.ts",
        "src/**/*.tsx"
      ]
    }, { spaces: 2 });

    console.log(`\n Created Theme boilerplate. Run\x1b[36m cd ${name} && npx cromwell b -w\x1b[0m to start development server`)
  }
}
