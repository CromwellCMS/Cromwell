import { TPageConfig } from '@cromwell/core';
import { TextField } from '@material-ui/core';
import React, { useRef, useState } from 'react';

import styles from './PageSettings.module.scss';


export const PageSettings = (props: {
    initialPageConfig: TPageConfig;
    handlePageInfoChange: (page: TPageConfig) => void;
}) => {
    // const { editingPageConfig } = props;
    const initialPageConfig = useRef<TPageConfig>(props.initialPageConfig);
    const [editingPageConfig, setEditingPageConfig] = useState<TPageConfig>(props.initialPageConfig);

    if (props.initialPageConfig !== initialPageConfig.current) {
        initialPageConfig.current = props.initialPageConfig;
        setTimeout(() => {
            setEditingPageConfig(props.initialPageConfig);
        })
    }

    const handlePageSettingsChange = (prop: keyof TPageConfig, val: any) => {
        setEditingPageConfig(prev => {
            if (initialPageConfig.current?.isVirtual && prop === 'route') {
                if (!val) val = '';
                val = val.replace('pages/', '');
                val = val.replace(/\W/g, '-');
                val = 'pages/' + val;
            }
            const next = Object.assign({}, prev, { [prop]: val });
            props.handlePageInfoChange(next);
            return next;
        });
    }


    return (
        <div className={styles.pageSettings}>
            <TextField label="Route" variant="outlined"
                disabled={!editingPageConfig.isVirtual}
                value={editingPageConfig.route ?? ''}
                className={styles.textField}
                onChange={(e) => { handlePageSettingsChange('route', e.target.value) }}
            />
            <TextField label="Name" variant="outlined"
                value={editingPageConfig.name ?? ''}
                className={styles.textField}
                onChange={(e) => { handlePageSettingsChange('name', e.target.value) }}
            />
            <TextField label="Meta title" variant="outlined"
                value={editingPageConfig.title ?? ''}
                className={styles.textField}
                onChange={(e) => { handlePageSettingsChange('title', e.target.value) }}
            />
            <TextField label="Meta description" variant="outlined"
                value={editingPageConfig.description ?? ''}
                className={styles.textField}
                onChange={(e) => { handlePageSettingsChange('description', e.target.value) }}
            />
            <TextField label="Head HTML" variant="outlined"
                value={editingPageConfig.headHtml ?? ''}
                className={styles.textField}
                multiline
                onChange={(e) => { handlePageSettingsChange('headHtml', e.target.value) }}
            />
            <TextField label="Footer HTML" variant="outlined"
                value={editingPageConfig.footerHtml ?? ''}
                className={styles.textField}
                multiline
                onChange={(e) => { handlePageSettingsChange('footerHtml', e.target.value) }}
            />
        </div>
    )
}
