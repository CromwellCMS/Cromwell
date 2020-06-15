
    import { CromwellPageType } from '@cromwell/core';
    import { createGetStaticProps } from '../../common/createGetStaticProps';
    import { getPage } from '../../common/getPage';

    /* eslint-disable @typescript-eslint/camelcase */
    const some_page_Page: CromwellPageType = getPage('some_page');

    export const getStaticProps = createGetStaticProps('some_page', '/pages/some_page');

    /* eslint-disable @typescript-eslint/camelcase */
    export default some_page_Page;
    