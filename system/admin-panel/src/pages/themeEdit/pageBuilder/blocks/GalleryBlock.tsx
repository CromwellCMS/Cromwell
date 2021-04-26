import { TCromwellBlockData } from '@cromwell/core';
import { Tooltip } from '@material-ui/core';
import { Power as PowerIcon } from '@material-ui/icons';
import React, { useState } from 'react';

import ImagePicker from '../../../../components/imagePicker/ImagePicker';
import { useForceUpdate } from '../../../../helpers/forceUpdate';
import styles from './BaseBlock.module.scss';
import { BaseMenu, TBaseMenuProps } from './BaseMenu';

export function GalleryBlock(props: TBaseMenuProps) {
    const forceUpdate = useForceUpdate();

    const handleChange = (key: keyof TCromwellBlockData['image'], value: string) => {
        const data = props.block?.getData();
        props.block?.props.image
        if (!data.image) data.image = {};
        data[key] = value;
        props.modifyData?.(data);
        forceUpdate();
    }

    return (
        <>
            <BaseMenu
                {...props}
                icon={(
                    <Tooltip title="Plugin block">
                        <PowerIcon />
                    </Tooltip>
                )}
                settingsContent={(
                    <div>
                        <h3 className={styles.settingsTitle}>Gallery settings</h3>
                        <ImagePicker
                            onChange={(val) => handleChange('src', val)}
                        />
                    </div>
                )}
            />
            {props?.block?.getDefaultContent()}
        </>
    );
}

