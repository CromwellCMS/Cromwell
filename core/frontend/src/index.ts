export { CromwellBlock } from './components/CromwellBlock/CromwellBlock';
export { CText } from './components/TextBlock/CText';
export { CHTML } from './components/HTMLBlock/CHTML';
export { CContainer } from './components/ContainerBlock/CContainer';
export { CImage } from './components/ImageBlock/CImage';
export { CPlugin } from './components/PluginBlock/CPlugin';
export { CGallery } from './components/GalleryBlock/CGallery';
export * from './components/Head/Head';
export * from './HOCs/FrontendPlugin';
export * from './constants';
export * from './apiClient';

export { default as Link } from 'next/link';

//@ts-ignore
import CromwellBlockStyles from './components/CromwellBlock/CromwellBlock.module.scss';
export const CromwellBlockCSSclass = CromwellBlockStyles.CromwellBlock;
