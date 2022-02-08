export const defaultGenericPageContent = `
import React from 'react';

const GenericPage = () => {
  return (
    <div></div>
  );
}

export default GenericPage;

export const getStaticProps = async (context) => {
  if (!context.pageConfig?.id || !context.pageConfig.route) return {
    notFound: true,
  }
  return {
    props: {}
  }
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
`;

export const tsConfigContent = `{
  "compilerOptions": {
    "baseUrl": ".",
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}`;

export const defaultCss = `
import '@cromwell/core-frontend/dist/_index.css';
import '@cromwell/renderer/build/editor-styles.css';
import 'pure-react-carousel/dist/react-carousel.es.css';
import 'react-image-lightbox/style.css';`