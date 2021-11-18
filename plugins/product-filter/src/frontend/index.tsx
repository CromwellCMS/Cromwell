import { TGetPluginStaticProps } from '@cromwell/core';
import { withRouter } from 'next/router';

import Filter from './components/Filter';
import { TProductFilterData } from './service';


let HocComp = Filter;
if (withRouter) {
    HocComp = withRouter(HocComp);
}

export default HocComp;

export const getStaticProps: TGetPluginStaticProps = async (context): Promise<TProductFilterData> => {
    const { pluginSettings } = context ?? {};
    const slug = context?.params?.slug ?? null;

    return {
        slug,
        pluginSettings,
    }
}