import {
    getCmsSettings,
    getThemeCustomConfig,
    getThemeCustomConfigProp,
    TCurrency,
} from '@cromwell/core';
import { CHTML, CPlugin, getCStore, Link } from '@cromwell/core-frontend';
import {
    createStyles,
    FormControl,
    ListItem,
    makeStyles,
    MenuItem,
    Select as MuiSelect,
    TextField as MuiTextField,
    Theme,
    withStyles,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';

import { productListStore } from '../../helpers/ProductListStore';
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


const Header = () => {
    const topLinks: TTopLink[] | undefined = getThemeCustomConfigProp('header/topLinks');
    const cmsConfig = getCmsSettings();
    const currencies: TCurrency[] = cmsConfig?.currencies ?? [];
    const logoHref: string | undefined = getThemeCustomConfigProp('header/logo');
    const contactPhone: string | undefined = getThemeCustomConfigProp('header/contactPhone');
    const classes = useStyles();
    const cstore = getCStore();
    const [itemsInCart, setItemsInCart] = useState(cstore.getCart().length);
    const [currency, setCurrency] = React.useState<string | null | undefined>(cstore.getActiveCurrencyTag());

    const handleCurrencyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const val = event.target.value as string;
        setCurrency(val);
        cstore.setActiveCurrency(val);
    };

    const handleCartClick = () => {
        productListStore.isCartOpen = true;
    }
    const CustomConfig = getThemeCustomConfig();

    useEffect(() => {
        cstore.addOnCartUpdatedCallback((cart) => {
            if (itemsInCart !== cart.length)
                setItemsInCart(cart.length);
        }, 'headerCart');
    }, []);

    return (
        <div className={`${styles.Header} ${commonStyles.text}`}>
            <div className={styles.topPanel}>
                <div className={`${commonStyles.content} ${styles.topPanelContent}`}>
                    <div className={styles.leftBlock}>
                        <CHTML id="header_01" className={styles.currencyOption}>
                            <FormControl className={styles.formControl}>
                                <Select
                                    className={styles.select}
                                    value={currency}
                                    onChange={handleCurrencyChange}
                                >
                                    {currencies && Array.isArray(currencies) && currencies.map(curr => (
                                        <MenuItem value={curr.tag} key={curr.tag}>{curr.tag}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </CHTML>
                        <CHTML id="header_02">
                            <div className={styles.languageOption}>

                            </div>
                        </CHTML>
                    </div>

                    <div className={styles.rightBlock}>
                        <CHTML id="header_03" className={styles.welcomeMessage}>
                            <p>{getThemeCustomConfigProp('header/welcomeMessage')}</p>
                        </CHTML>
                        <CHTML id="header_04" className={styles.topPanelLinks}>
                            <>
                                {topLinks && topLinks.map(l => (
                                    <div className={styles.topPanelLink} key={l.href}>
                                        <Link href={l.href} key={l.href}>
                                            <a className={commonStyles.link}>{l.title}</a>
                                        </Link>
                                    </div>
                                ))}
                            </>
                        </CHTML>
                    </div>
                </div>
            </div>

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
                    <div className={styles.phone}>
                        <p className={styles.phoneActionTip}>Call us now!</p>
                        <a href={`tel:${contactPhone}`} className={commonStyles.link}>{contactPhone}</a>
                    </div>
                    <ListItem button className={styles.cart} onClick={handleCartClick} >
                        <div className={styles.cartIcon}></div>
                        <div className={styles.cartExpandBlock}>
                            <p className={styles.itemsInCart}>{itemsInCart}</p>
                            <ExpandMoreIcon className={styles.cartExpandIcon} />
                        </div>
                    </ListItem>
                </div>
            </div>
            <div className={styles.mainMenu}>
                <div className={`${commonStyles.content} ${styles.mainMenuContent}`}>
                    <CPlugin id="header_main_menu" />
                </div>
            </div>
        </div>
    )
}

export default Header;
