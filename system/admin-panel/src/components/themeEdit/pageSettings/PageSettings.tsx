import { TPageInfo } from '@cromwell/core';
import { TextField } from '@material-ui/core';
import React, { useRef, useState } from 'react';

import styles from './PageSettings.module.scss';


export const PageSettings = (props: {
    initialPageConfig: TPageInfo;
    handlePageInfoChange: (page: TPageInfo) => void;
}) => {
    // const { editingPageConfig } = props;
    const initialPageConfig = useRef<TPageInfo>(props.initialPageConfig);
    const [editingPageConfig, setEditingPageConfig] = useState<TPageInfo>(props.initialPageConfig);

    if (props.initialPageConfig !== initialPageConfig.current) {
        initialPageConfig.current = props.initialPageConfig;
        setTimeout(() => {
            setEditingPageConfig(props.initialPageConfig);
        })
    }

    const handlePageSettingsChange = (prop: keyof TPageInfo, val: any) => {
        setEditingPageConfig(prev => {
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
        </div>
    )
}
