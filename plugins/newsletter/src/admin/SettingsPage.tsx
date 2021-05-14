import { gql } from '@apollo/client';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button } from '@material-ui/core';
import React, { useState } from 'react';

import { NewsletterForm } from '../types';
import { useStyles } from './styles';

export function SettingsPage() {
    const classes = useStyles();
    const [isLoading, setIsloading] = useState(false);

    const exportData = async () => {
        if (isLoading) return;

        setIsloading(true);
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
        setIsloading(false);
    }

    return (
        <div className={`${classes.paper} ${classes.content}`}>
            <h1 style={{ marginBottom: '10px' }}>Newsletter plugin</h1>

            <Button variant="contained" color="primary"
                className={classes.saveBtn}
                disabled={isLoading}
                onClick={exportData}>Export data</Button>
        </div>
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