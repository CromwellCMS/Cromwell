import { getCmsSettings, getThemeCustomConfigProp } from '@cromwell/core';
import { CPlugin, Link } from '@cromwell/core-frontend';
import {
    createStyles,
    makeStyles,
    Select as MuiSelect,
    TextField as MuiTextField,
    Theme,
    withStyles,
} from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';

import commonStyles from '../../styles/common.module.scss';
import { TTopLink } from '../../types';
import styles from './Header.module.scss';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: 0,
        }
    }),
);

const Select = withStyles({
    root: {
        width: '300px',
        fontSize: '1em',
        padding: '4px'
    }
})(MuiSelect);

const TextField = withStyles({
    root: {
        paddingTop: '0',
        paddingBottom: '0',
        fontWeight: 300,
        width: "100%"
    },
})(MuiTextField);


const Header = observer(() => {
    const cmsConfig = getCmsSettings();

    return (
        <div className={`${styles.Header} ${commonStyles.text}`}>
            <div className={styles.mainMenu}>
                <div className={`${commonStyles.content} ${styles.mainMenuContent}`}>
                    <div className={styles.logoWrapper}>
                        <Link href="/">
                            <img className={styles.logo} src={cmsConfig?.logo} alt="logo" />
                        </Link>
                    </div>
                    <CPlugin id="header_main_menu" pluginName={"@cromwell/plugin-main-menu"} />
                    <div className={styles.search}>
                        <TextField id="outlined-basic" label="Search..." variant="outlined" size="small" />
                    </div>
                </div>
            </div>
        </div>
    )
})

export default Header;
