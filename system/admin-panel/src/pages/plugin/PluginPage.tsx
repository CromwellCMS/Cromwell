import { CPlugin } from '@cromwell/core-frontend';
import React from 'react';

import styles from './PluginPage.module.scss';

const PluginPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pluginName = urlParams.get('pluginName');

    return (
        <CPlugin id={pluginName}
            pluginName={pluginName}
            className={styles.PluginPage}
        />
    )
}

export default PluginPage;
