import { CromwellPageType } from '@cromwell/core';
import { createGetStaticProps } from '../../common/createGetStaticProps';
import { createGetStaticPaths } from '../../common/createGetStaticPaths';
import { getPage } from '../../common/getPage';

const ProductCore: CromwellPageType = getPage('product');

export const getStaticProps = createGetStaticProps('product');

export const getStaticPaths = createGetStaticPaths('Product');

export default ProductCore;