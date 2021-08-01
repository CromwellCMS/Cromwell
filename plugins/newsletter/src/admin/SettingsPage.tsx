import { gql } from '@apollo/client';
import { LoadingStatus, PluginSettingsLayout } from '@cromwell/admin-panel';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button } from '@material-ui/core';
import React, { useState } from 'react';

import { NewsletterForm } from '../types';
import { useStyles } from './styles';

export function SettingsPage(props) {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);

    const exportData = async () => {
        if (isLoading) return;
        setIsLoading(true);
        const client = getGraphQLClient();

        try {
            const data = await client?.query({
                query: gql`
                    query pluginNewsletterExport {
                        pluginNewsletterExport {
                            email
                        }
                    }
                `,
            });
            const newsletters: NewsletterForm[] | undefined = data?.data?.pluginNewsletterExport;
            if (newsletters) {
                downloadFile('newsletter_export.csv', newsletters.map(n => n.email).join('\n'));
            }
        } catch (e) {
            console.error('Newsletter::exportData error: ', e)
        }
        setIsLoading(false);
    }

    return (
        <PluginSettingsLayout {...props} disableSave>
            {() => (
                <>
                    <p>Export all subscribers into CSV file</p>
                    <Button variant="contained" color="primary"
                        className={classes.saveBtn}
                        disabled={isLoading}
                        onClick={exportData}>Export data</Button>
                    <LoadingStatus isActive={isLoading} />
                </>
            )}
        </PluginSettingsLayout>
    )
}

function downloadFile(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();

    document.body.removeChild(element);
}