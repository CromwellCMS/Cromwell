import { CromwellPageType, BasePageNames } from '@cromwell/core';
import { createGetStaticProps } from '../../common/createGetStaticProps';
import { createGetStaticPaths } from '../../common/createGetStaticPaths';
import { getPage } from '../../common/getPage';

const ProductCore: CromwellPageType = getPage(BasePageNames.Product);

export const getStaticProps = createGetStaticProps(BasePageNames.Product);

export const getStaticPaths = createGetStaticPaths('Product');

export default ProductCore;