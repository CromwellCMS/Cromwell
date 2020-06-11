import { CromwellPageType, BasePageNames } from '@cromwell/core';
import { createGetStaticProps } from '../common/createGetStaticProps';
import { getPage } from '../common/getPage';

const IndexCore: CromwellPageType = getPage(BasePageNames.Index);

export const getStaticProps = createGetStaticProps(BasePageNames.Index);

export default IndexCore;
