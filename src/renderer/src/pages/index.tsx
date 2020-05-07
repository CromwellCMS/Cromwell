import { CromwellPage } from '@cromwell/core';
import { createGetStaticProps } from '../common/createGetStaticProps';
import { getPage } from '../common/getPage';

const IndexCore: CromwellPage = getPage('index');

export const getStaticProps = createGetStaticProps('index');

export default IndexCore;
