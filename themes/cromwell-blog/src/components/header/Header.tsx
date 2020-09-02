import { getAppCustomConfigProp, getCmsConfig } from '@cromwell/core';
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

// @ts-ignore
import commonStyles from '../../styles/common.module.scss';
import { TTopLink } from '../../types';
// @ts-ignore
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
    const topLinks: TTopLink[] | undefined = getAppCustomConfigProp('header/topLinks');
    const cmsConfig = getCmsConfig();
    const currencyOptions: string[] = cmsConfig && cmsConfig.currencyOptions ? cmsConfig.currencyOptions : [];
    const logoHref: string | undefined = getAppCustomConfigProp('header/logo');

    return (
        <div className={`${styles.Header} ${commonStyles.text}`}>
            <div className={styles.mainPanel}>
                <div className={`${commonStyles.content} ${styles.mainPanelContent}`}>
                    <div className={styles.logo}>
                        <Link href="/">
                            <img className={styles.logo} src={logoHref} alt="logo" />
                        </Link>
                    </div>
                    <div className={styles.search}>
                        <TextField id="outlined-basic" label="Search..." variant="outlined" size="small" />
                    </div>
                </div>
            </div>
            <div className={styles.mainMenu}>
                <div className={`${commonStyles.content} ${styles.mainMenuContent}`}>
                    <CPlugin id="header_main_menu" />
                </div>
            </div>
        </div>
    )
})

export default Header;
