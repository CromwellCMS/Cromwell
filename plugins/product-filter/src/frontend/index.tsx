import { TGetPluginStaticProps } from '@cromwell/core';
import { withRouter } from 'next/router';

import Filter from './components/Filter';
import { TProductFilterSettings, TPluginProductFilterData } from '../types';

let HocComp = Filter;
if (withRouter) {
  HocComp = withRouter(HocComp);
}

export default HocComp;

export const getStaticProps: TGetPluginStaticProps<TPluginProductFilterData, TProductFilterSettings> = async (
  context,
) => {
  const { pluginSettings } = context ?? {};
  const slug = context?.params?.slug ?? null;

  return {
    props: {
      slug,
      pluginSettings,
    },
  };
};
