import { getRestApiClient } from '@cromwell/core-frontend';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Button, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import React, { useState } from 'react';

import { LoadingStatus } from '../../../components/loadBox/LoadingStatus';
import { toast } from '../../../components/toast/toast';
// import { TTabProps } from '../Settings';
import styles from '../Settings.module.scss';

export default function SEO(props: any) {
    const { settings, changeSettings } = props;
    const [buildingSitemap, setBuildingSitemap] = useState(false);

    const buildSitemap = async () => {
        setBuildingSitemap(true);
        try {
            await getRestApiClient().buildSitemap();
            toast.success('Sitemap has been rebuilt');
        } catch (e) {
            toast.error('Failed to rebuild Sitemap');
            console.error(e)
        }
        setBuildingSitemap(false);
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} >
                <TextField
                    multiline
                    maxRows={8}
                    fullWidth
                    variant="outlined"
                    label="robots.txt"
                    value={settings?.robotsContent}
                    onChange={(e) => changeSettings('robotsContent', e.target.value)}
                />

            </Grid>
            <Grid item xs={12} >
                <div>
                    <Button
                        disabled={buildingSitemap}
                        color="primary"
                        variant="contained"
                        className={styles.exportBtn}
                        size="small"
                        onClick={buildSitemap}
                    >Rebuild Sitemap</Button>
                    <Tooltip title="Open Sitemap">
                        <IconButton
                            style={{ marginLeft: '10px' }}
                            onClick={() => window.open('/default_sitemap.xml', '_blank')}>
                            <OpenInNewIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </Grid>
            <LoadingStatus isActive={buildingSitemap} />
        </Grid>
    )
}
