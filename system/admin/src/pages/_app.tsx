import '../styles/base.css';
import '../styles/global.scss';
import '@cromwell/core-frontend/dist/_index.css';
import '@helpers/Draggable/Draggable.css';
import '@helpers/importDependencies';
import '@uiw/react-textarea-code-editor/esm/style/index.css';
import 'pure-react-carousel/dist/react-carousel.es.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import 'rsuite/dist/rsuite.min.css';

import dynamic from 'next/dynamic';
import React from 'react';

const Layout = dynamic(() => import('@components/layout/Layout'), { ssr: false });

export default function CustomApp() {
  return <Layout />;
}
