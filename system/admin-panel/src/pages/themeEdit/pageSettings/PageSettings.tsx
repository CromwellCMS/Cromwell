import { TPageConfig } from '@cromwell/core';
import { TextField } from '@material-ui/core';
import React from 'react';

import styles from './PageSettings.module.scss';

export const PageSettings = (props: {
    pageConfig: TPageConfig;
    handlePageInfoChange: (page: TPageConfig) => void;
}) => {
    const { pageConfig } = props;

    const handlePageSettingsChange = (prop: keyof TPageConfig, val: any) => {
        if (pageConfig?.isVirtual && prop === 'route') {
            if (!val) val = '';
            val = val.replace('pages/', '');
            val = val.replace(/\W/g, '-');
            val = 'pages/' + val;
        }
        const next = Object.assign({}, pageConfig, { [prop]: val });
        props.handlePageInfoChange(next);
    }

    return (
        <div className={styles.pageSettings}>
            <TextField label="Route" variant="outlined"
                disabled={!pageConfig.isVirtual}
                value={pageConfig.route ?? ''}
                className={styles.textField}
                onChange={(e) => { handlePageSettingsChange('route', e.target.value) }}
            />
            <TextField label="Name" variant="outlined"
                value={pageConfig.name ?? ''}
                className={styles.textField}
                onChange={(e) => { handlePageSettingsChange('name', e.target.value) }}
            />
            <TextField label="Meta title" variant="outlined"
                value={pageConfig.title ?? ''}
                className={styles.textField}
                onChange={(e) => { handlePageSettingsChange('title', e.target.value) }}
            />
            <TextField label="Meta description" variant="outlined"
                value={pageConfig.description ?? ''}
                className={styles.textField}
                onChange={(e) => { handlePageSettingsChange('description', e.target.value) }}
            />
            <TextField label="Head HTML" variant="outlined"
                value={pageConfig.headHtml ?? ''}
                className={styles.textField}
                multiline
                onChange={(e) => { handlePageSettingsChange('headHtml', e.target.value) }}
            />
            <TextField label="Footer HTML" variant="outlined"
                value={pageConfig.footerHtml ?? ''}
                className={styles.textField}
                multiline
                onChange={(e) => { handlePageSettingsChange('footerHtml', e.target.value) }}
            />
        </div>
    )
}
