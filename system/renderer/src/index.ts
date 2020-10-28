import { importRendererDeps } from './helpers/importRendererDeps';
importRendererDeps();

export { createGetStaticProps } from './common/createGetStaticProps';
export { createGetStaticPaths } from './common/createGetStaticPaths';
export { getPage } from './common/getPage';
export { checkCMSConfig, fsRequire } from './helpers/checkCMSConfig';
export { importRendererDepsFrontend } from './helpers/importRendererDeps';
