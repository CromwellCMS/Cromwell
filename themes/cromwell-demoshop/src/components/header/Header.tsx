import { getAppCustomConfigTextProp, getAppCustomConfigProp, getCmsConfig, isServer, setStoreItem } from '@cromwell/core';
import { Link, CHTML, CContainer, CPlugin, getGlobalCurrency, setGlobalCurrency } from '@cromwell/core-frontend';
import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core';
import {
    MenuItem,
    FormControl,
    Select as MuiSelect,
    TextField as MuiTextField,
    ListItem,
    IconButton
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { TTopLink } from '../../types';

// @ts-ignore
import styles from './Header.module.scss';
// @ts-ignore
import commonStyles from '../../styles/common.module.scss';

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


export default function Header() {


    const topLinks: TTopLink[] | undefined = getAppCustomConfigProp('header/topLinks');
    const cmsConfig = getCmsConfig();
    const currencyOptions: string[] = cmsConfig && cmsConfig.currencyOptions ? cmsConfig.currencyOptions : [];
    const logoHref: string | undefined = getAppCustomConfigProp('header/logo');
    const contactPhone: string | undefined = getAppCustomConfigProp('header/contactPhone');
    const classes = useStyles();

    let _itemsInCart: string | number | null = !isServer() ? window.localStorage.getItem('itemsInCart') : null;
    if (typeof _itemsInCart === 'string') _itemsInCart = parseInt(_itemsInCart);
    if (_itemsInCart && isNaN(_itemsInCart)) _itemsInCart = null;
    if (!_itemsInCart) _itemsInCart = 0;

    const [currency, setCurrency] = React.useState<string | null | undefined>(getGlobalCurrency());
    const [itemsInCart, setItemsInCart] = React.useState<number>(_itemsInCart);

    const handleCurrencyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const val = event.target.value as string
        setCurrency(val);
        setGlobalCurrency(val);
    };

    const handleCartClick = () => {

    }

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
                                    {currencyOptions && currencyOptions.map(c => (
                                        <MenuItem value={c} key={c}>{c}</MenuItem>
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
                            <p>{getAppCustomConfigTextProp('header/welcomeMessage')}</p>
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
