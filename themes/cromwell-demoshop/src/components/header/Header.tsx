import { getCmsSettings, getThemeCustomConfigProp, TCurrency, TPagedParams, TProduct } from '@cromwell/core';
import { CHTML, CPlugin, getCStore, Link, CContainer, getGraphQLClient } from '@cromwell/core-frontend';
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
import { gql } from '@apollo/client';
import { productListStore } from '../../helpers/ProductListStore';
import commonStyles from '../../styles/common.module.scss';
import { TTopLink } from '../../types';
import styles from './Header.module.scss';
// import { debounce } from 'throttle-debounce';

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


export const Header = () => {
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

    useEffect(() => {
        cstore.addOnCartUpdatedCallback((cart) => {
            if (itemsInCart !== cart.length)
                setItemsInCart(cart.length);
        }, 'headerCart');
    }, []);

    const handleSearch = async (productName: string) => {
        const pagedParams: TPagedParams<TProduct> = {
            pageNumber: 1,
            pageSize: 10,
        }
        const filterParams = {
            nameSearch: productName
        }

        const client = getGraphQLClient();
        try {
            const data = await client?.query({
                query: gql`
            query getFilteredProductsFromCategory($categoryId: String!, $pagedParams: PagedParamsInput!, $filterParams: ProductFilterInput!, $withCategories: Boolean!) {
                getFilteredProductsFromCategory(categoryId: $categoryId, pagedParams: $pagedParams, filterParams: $filterParams) {
                    pagedMeta {
                        ...PagedMetaFragment
                    }
                    filterMeta {
                        minPrice
                        maxPrice
                    }
                    elements {
                        ...ProductFragment
                    }
                }
            }
            ${client?.ProductFragment}
            ${client?.PagedMetaFragment}
        `,
                variables: {
                    pagedParams,
                    withCategories: false,
                    filterParams,
                    categoryId: ' 1'
                }
            });

            return data?.data?.getFilteredProductsFromCategory

        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={`${styles.Header} ${commonStyles.text}`}>
            <div className={styles.topPanel}>
                <div className={`${commonStyles.content} ${styles.topPanelContent}`}>
                    <CContainer className={styles.leftBlock} id="header_11">
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
                    </CContainer>

                    <CContainer className={styles.rightBlock} id="header_12">
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
                    </CContainer>
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
                        <TextField id="outlined-basic" label="Search..."
                            variant="outlined" size="small"
                            onChange={(event) => handleSearch(event.currentTarget.value)} />
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
                <CContainer className={`${commonStyles.content} ${styles.mainMenuContent}`} id="header_13">
                    <CPlugin id="header_main_menu" />
                </CContainer>
            </div>
        </div>
    )
}
