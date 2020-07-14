import { getAppCustomConfigTextProp, getAppCustomConfigProp, isServer } from '@cromwell/core';
import { Link, CHTMLBlock } from '@cromwell/core-frontend';
import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';
import { TTopLink } from '../../types';
import MuiTextField from '@material-ui/core/TextField';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';

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
    const currencyOptions: string[] | undefined = getAppCustomConfigProp('store/currencyOptions');
    const logoHref: string | undefined = getAppCustomConfigProp('header/logo');
    const contactPhone: string | undefined = getAppCustomConfigProp('header/contactPhone');
    const classes = useStyles();

    let _currency = !isServer() ? window.localStorage.getItem('storeCurrency') : null;
    if ((!_currency || _currency === "") && currencyOptions && Array.isArray(currencyOptions) && currencyOptions.length > 0) {
        _currency = currencyOptions[0];
    }

    let _itemsInCart: string | number | null = !isServer() ? window.localStorage.getItem('itemsInCart') : null;
    if (typeof _itemsInCart === 'string') _itemsInCart = parseInt(_itemsInCart);
    if (_itemsInCart && isNaN(_itemsInCart)) _itemsInCart = null;
    if (!_itemsInCart) _itemsInCart = 0;

    const [currency, setCurrency] = React.useState<string | null>(_currency);
    const [itemsInCart, setItemsInCart] = React.useState<number>(_itemsInCart);

    const handleCurrencyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const val = event.target.value as string
        setCurrency(val);
        window.localStorage.setItem('storeCurrency', val);
    };

    const handleCartClick = () => {

    }

    return (
        <div className={`${styles.Header} ${commonStyles.text}`}>
            <div className={commonStyles.content}>
                <div className={styles.topPanel}>
                    <div className={styles.leftBlock}>
                        <CHTMLBlock id="header_01" className={styles.currencyOption}>
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
                        </CHTMLBlock>
                        <CHTMLBlock id="header_02">
                            <div className={styles.languageOption}>

                            </div>
                        </CHTMLBlock>
                    </div>

                    <div className={styles.rightBlock}>
                        <CHTMLBlock id="header_03" className={styles.welcomeMessage}>
                            <p>{getAppCustomConfigTextProp('header/welcomeMessage')}</p>
                        </CHTMLBlock>
                        <CHTMLBlock id="header_04" className={styles.topPanelLinks}>
                            <>
                                {topLinks && topLinks.map(l => (
                                    <div className={styles.topPanelLink}>
                                        <Link href={l.href} key={l.href}>
                                            <a className={commonStyles.link}>{l.title}</a>
                                        </Link>
                                    </div>
                                ))}
                            </>
                        </CHTMLBlock>
                    </div>
                </div>

                <div className={styles.mainPanel}>
                    <img className={styles.logo} src={logoHref} alt="logo" />
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
        </div>
    )
}
