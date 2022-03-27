import { TPageConfig, TThemeConfig } from '@cromwell/core';
import { Autocomplete, TextField, Tooltip } from '@mui/material';
import React, { useRef } from 'react';
import { Select } from '../../../components/select/Select';

import styles from './PageSettings.module.scss';

export const PageSettings = (props: {
    pageConfig: TPageConfig;
    handlePageInfoChange: (page: TPageConfig) => void;
    themeConfig?: TThemeConfig;
}) => {
    const { pageConfig, themeConfig } = props;
    const genericPages = themeConfig?.genericPages ?? [{ route: "pages/[slug]", name: "default" }];
    const pageLayout = useRef(pageConfig?.layoutRoute ?? genericPages[0].route);

    const handlePageSettingsChange = (prop: keyof TPageConfig, val: any) => {
        if (pageConfig?.isVirtual && prop === 'route') {
            if (!val) val = '';
            const prefix = pageLayout.current.replace('[slug]', '');
            val = val.replace(prefix, '');
            val = val.replace(/\W/g, '-');
            val = prefix + val;
        }
        const next = Object.assign({}, pageConfig, { [prop]: val, layoutRoute: pageLayout.current });
        props.handlePageInfoChange(next);
    }

    const changeLayout = (route: string) => {
        pageLayout.current = route;
        handlePageSettingsChange('route', pageConfig.route);
    }

    return (
        <div className={styles.pageSettings}>
            {pageConfig?.isVirtual && !!genericPages?.length && genericPages.length > 1 && (
                <Select
                    label="Layout name"
                    value={pageLayout.current}
                    options={genericPages.map(p => ({ label: p.name, value: p.route }))}
                    onChange={(event) => changeLayout(event.target.value as string)}
                    className={styles.textField}
                />
            )}
            <TextField label="Route" variant="outlined"
                disabled={!pageConfig?.isVirtual}
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
            <Autocomplete
                multiple
                freeSolo
                options={[]}
                className={styles.textField}
                value={pageConfig?.keywords ?? []}
                getOptionLabel={(option) => option as any}
                onChange={(e, newVal) => {
                    handlePageSettingsChange('keywords', newVal);
                }}
                renderInput={(params) => (
                    <Tooltip title="Press ENTER to add">
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Meta keywords"
                        />
                    </Tooltip>
                )}
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
