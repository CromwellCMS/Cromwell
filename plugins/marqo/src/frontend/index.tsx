import { TFrontendPluginProps, TGetPluginStaticProps } from '@cromwell/core';
import React from 'react';

import { SettingsType } from '../types';
import { SimilarProducts } from './components/SimilarProducts';

type MarqoPluginProps = {
  configured?: boolean;
  pluginSettings?: any;
};

export type InstanceSettings = {
  autoLoadFirstPageAfter?: number;
  excludeIds?: number[];
  limit?: number;
};

export default function MarqoPlugin(props: TFrontendPluginProps<MarqoPluginProps, InstanceSettings>): JSX.Element {
  if (!props?.data?.configured) return <></>;
  return (
    <SimilarProducts
      autoLoadFirstPageAfter={props.instanceSettings?.autoLoadFirstPageAfter}
      limit={props.instanceSettings?.limit}
      excludeIds={props.instanceSettings?.excludeIds}
    />
  );
}

export const getStaticProps: TGetPluginStaticProps<MarqoPluginProps> = async (context) => {
  // slug of a product page
  const settings: SettingsType = context.pluginSettings ?? {};
  return {
    props: {
      configured: !!(settings.index_name && settings.marqo_url),
    },
  };
};
