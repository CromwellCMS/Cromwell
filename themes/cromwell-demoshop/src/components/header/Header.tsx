import { getAppCustomConfigTextProp, getAppCustomConfigProp } from '@cromwell/core';
import { Link } from '@cromwell/core-frontend';
import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// @ts-ignore
import styles from './Header.module.scss';
// @ts-ignore
import commonStyles from '../../styles/common.module.scss';

type TTopLink = {
    title: string;
    href: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);

export default function Header() {
    const topLinks: TTopLink[] | undefined = getAppCustomConfigProp('header/topLinks');
    const currencyOptions: string[] | undefined = getAppCustomConfigProp('store/currencyOptions');
    const classes = useStyles();

    const [currency, setCurrency] = React.useState<string | null>(null);
    useEffect(() => {
        let currency = window.localStorage.getItem('storeCurrency');
        if ((!currency || currency === "") && currencyOptions && Array.isArray(currencyOptions) && currencyOptions.length > 0) {
            currency = currencyOptions[0];
        }
        setCurrency(currency);
    }, [])

    const handleCurrencyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const val = event.target.value as string
        setCurrency(val);
        window.localStorage.setItem('storeCurrency', val);
    };

    return (
        <div className={`${styles.Header} ${commonStyles.text}`}>
            <div className={commonStyles.content}>
                <div className={styles.topPanel}>
                    <div className={styles.leftBlock}>
                        <div className={styles.currencyOption}>
                            <FormControl className={classes.formControl}>
                                <Select
                                    value={currency}
                                    onChange={handleCurrencyChange}
                                >
                                    {currencyOptions && currencyOptions.map(c => (
                                        <MenuItem value={c} key={c}>{c}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className={styles.languageOption}>

                        </div>
                    </div>

                    <div className={styles.rightBlock}>
                        <p>{getAppCustomConfigTextProp('header/welcomeMessage')}</p>
                        <div className={styles.topPanelLinks}>
                            {topLinks && topLinks.map(l => (
                                <div className={styles.topPanelLink}>
                                    <Link href={l.href} key={l.href}><a>{l.title}</a></Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
