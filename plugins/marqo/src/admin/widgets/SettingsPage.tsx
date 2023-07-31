import {
  PluginSettingsLayout,
  TextFieldWithTooltip,
  TextButton,
  LoadingStatus,
  Box,
  toast,
  askConfirmation,
} from '@cromwell/admin-panel';
import { TPluginSettingsProps } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import React from 'react';

import { SettingsType } from '../../types';

export function SettingsPage(props: TPluginSettingsProps<SettingsType>) {
  const [syncing, setSyncing] = React.useState(false);

  const updateData = async () => {
    if (syncing) return;
    setSyncing(true);
    const result: any = await getRestApiClient()?.post(`plugin-marqo/update-data`, {}).catch(console.error);
    if (result?.success) {
      toast.success('Data updated');
    } else {
      toast.error('Failed to update data. ' + (result?.message || ''));
    }
    setSyncing(false);
  };

  const deleteData = async (indexName: string) => {
    const confirm = await askConfirmation({
      title: `Are you sure you want to delete current index ${indexName}?`,
    });
    if (!confirm) return;

    if (syncing) return;
    setSyncing(true);
    const result: any = await getRestApiClient()?.post(`plugin-marqo/delete-data`, {}).catch(console.error);
    if (result?.success) {
      toast.success('Index deleted');
    } else {
      toast.error('Failed to delete index. ' + (result?.message || ''));
    }
    setSyncing(false);
  };

  return (
    <PluginSettingsLayout<SettingsType> {...props}>
      {({ pluginSettings, changeSetting }) => (
        <>
          <TextFieldWithTooltip
            sx={{ mb: 4 }}
            tooltipText="Marqo server URL, eg: http://localhost:8882"
            label="Marqo server URL"
            placeholder="http://localhost:8882"
            value={pluginSettings?.marqo_url ?? ''}
            fullWidth
            onChange={(event) => changeSetting('marqo_url', event.target.value)}
          />
          <TextFieldWithTooltip
            sx={{ mb: 4 }}
            tooltipText="Read about Marqo Index"
            tooltipLink="https://docs.marqo.ai/0.0.21/API-Reference/indexes/"
            label="Marqo Index name"
            placeholder="my-first-index"
            value={pluginSettings?.index_name ?? ''}
            fullWidth
            onChange={(event) => changeSetting('index_name', event.target.value)}
          />
          <TextFieldWithTooltip
            sx={{ mb: 4 }}
            tooltipText="Add secret to use in headers:  { 'Authorization': 'Bearer ${secret}' }"
            label="Auth secret"
            value={pluginSettings?.secret ?? ''}
            fullWidth
            onChange={(event) => changeSetting('secret', event.target.value)}
          />
          <Box sx={{ display: 'flex' }}>
            <TextButton onClick={updateData} disabled={syncing} sx={{ mr: 2 }}>
              Add/Update data
            </TextButton>
            <TextButton
              onClick={() => deleteData(pluginSettings?.index_name || '')}
              disabled={!pluginSettings?.index_name || syncing}
            >
              Delete data
            </TextButton>
          </Box>
          <LoadingStatus isActive={syncing} />
        </>
      )}
    </PluginSettingsLayout>
  );
}
