import { gql } from '@apollo/client';
import { getStoreItem, TAdminPanelPluginProps } from '@cromwell/core';
import { getGraphQLClient, getRestAPIClient } from '@cromwell/core-frontend';
import { Button } from '@material-ui/core';
import React, { useState } from 'react';

import { TSettings } from '../types';
import { useStyles } from './styles';

export default function index(props: TAdminPanelPluginProps<TSettings>) {
    const { pluginName, globalSettings } = props;
    const classes = useStyles();
    const [isLoading, setIsloading] = useState(false);
    const apiClient = getRestAPIClient();

    const handleSave = async () => {
        setIsloading(true);
        const _settings = globalSettings ?? {};

        try {
            await apiClient?.savePluginSettings(pluginName, _settings);
            getStoreItem('notifier')?.success?.('Saved!');

        } catch (e) {
            console.error(e);
            getStoreItem('notifier')?.error?.('Failed to save');
        }
        setIsloading(false);
    }

    const exportData = async () => {
        if (isLoading) return;

        setIsloading(true);
        const client = getGraphQLClient('plugin');
        try {
            const data = await client?.query({
                query: gql`
                    query pluginNewsletterExport {
                        pluginNewsletterExport
                    }
                `,
            });
            const emails: string[] | undefined = data?.data?.pluginNewsletterExport;
            if (emails) {
                downloadFile('newsletter_export.csv', emails.join('\n'));
            }
        } catch (e) {
            console.error('Newsletter::exportData error: ', e)
        }
        setIsloading(false);
    }

    return (
        <div className={`${classes.paper} ${classes.content}`}>
            <h1 style={{ marginBottom: '10px' }}>Newsletter plugin</h1>

            <Button variant="contained" color="primary"
                className={classes.saveBtn}
                disabled={isLoading}
                onClick={exportData}>Export data</Button>

            {/* <Button variant="contained" color="primary"
                className={classes.saveBtn}
                size="large"
                onClick={handleSave}>Save</Button> */}
        </div>
    )
}

function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}