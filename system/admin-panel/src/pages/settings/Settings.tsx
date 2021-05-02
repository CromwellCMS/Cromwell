import { TCmsSettings, TCurrency, setStoreItem } from '@cromwell/core';
import { getRestAPIClient, getCStore } from '@cromwell/core-frontend';
import {
    Badge,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from '@material-ui/core';
import { Add as AddIcon, DeleteForever as DeleteForeverIcon, DragIndicator as DragIndicatorIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

import ImagePicker from '../../components/imagePicker/ImagePicker';
import { toast } from '../../components/toast/toast';
import { launguages } from '../../constants/launguages';
import { timezones } from '../../constants/timezones';
import { NumberFormatCustom } from '../../helpers/NumberFormatCustom';
import commonStyles from '../../styles/common.module.scss';
import styles from './Settings.module.scss';

const ResponsiveGridLayout = WidthProvider(Responsive);


const SettingsPage = () => {
    const [settings, setSettings] = useState<TCmsSettings | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cstore = getCStore();

    const client = getRestAPIClient();
    useEffect(() => {
        getConfig();
    }, []);

    const changeSettigns = (key: keyof TCmsSettings, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    }


    const getConfig = async () => {
        setIsLoading(true);
        try {
            const settings = await client.getAdvancedCmsSettings();
            if (settings) setSettings(settings);
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    }

    const saveConfig = async () => {
        setIsLoading(true);
        try {
            const newConfig = await client.updateCmsConfig({
                protocol: settings.protocol,
                defaultPageSize: settings.defaultPageSize,
                currencies: settings.currencies,
                timezone: settings.timezone,
                language: settings.language,
                favicon: settings.favicon,
                logo: settings.logo,
                headerHtml: settings.headerHtml,
                footerHtml: settings.footerHtml,
                defaultShippingPrice: settings.defaultShippingPrice,
                smtpConnectionString: settings.smtpConnectionString,
                sendFromEmail: settings.sendFromEmail,
            });
            toast.success?.('Settings saved');
            setSettings(newConfig);
            setStoreItem('cmsSettings', newConfig);
        } catch (e) {
            console.error(e);
            toast.error('Failed to save settings');
        }
        setIsLoading(false);
    }

    const handleTextFieldChange = (key: keyof TCmsSettings) => (event: React.ChangeEvent<{ value: string }>) => {
        changeSettigns(key, event.target.value);
    }

    const currencies = (settings?.currencies ?? []);

    const handleDeleteCurrency = (tag: string) => {
        changeSettigns('currencies', currencies.filter(curr => curr.tag !== tag));
    }

    const handleAddCurrency = () => {
        changeSettigns('currencies', [...currencies, {
            tag: 'new',
            id: currencies.length + 1 + '',
        }]);

    }

    return (
        <div className={styles.SettingsPage}>
            <div className={styles.header}>
                <p className={commonStyles.pageTitle}>settings</p>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={saveConfig}
                    size="small"
                >Save</Button>
            </div>
            <div className={styles.list}>
                <Grid container spacing={3}>
                    <Grid item xs={12} className={styles.subheader}  >
                        <h3>General</h3>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl className={styles.field} fullWidth>
                            <InputLabel>Timezone</InputLabel>
                            <Select
                                fullWidth
                                value={settings?.timezone ?? 0}
                                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                    changeSettigns('timezone', parseInt(event.target.value as string));
                                }}
                            >
                                {timezones.map(timezone => (
                                    <MenuItem value={timezone.value} key={timezone.value}>{timezone.text}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl className={styles.field} fullWidth>
                            <InputLabel>Language</InputLabel>
                            <Select
                                disabled
                                fullWidth
                                className={styles.field}
                                value={settings?.language ?? 'en'}
                                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                    changeSettigns('language', event.target.value);
                                }}
                            >
                                {launguages.map(lang => (
                                    <MenuItem value={lang.code} key={lang.code}>{lang.name} ({lang.nativeName})</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ImagePicker
                            label="Logo"
                            onChange={(val) => changeSettigns('logo', val)}
                            value={settings?.logo}
                            className={styles.imageField}
                            backgroundSize='contain'
                            showRemove
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}
                        style={{ display: 'flex', alignItems: 'flex-end' }}
                    >
                        <ImagePicker
                            label="Favicon"
                            onChange={(val) => changeSettigns('favicon', val)}
                            value={settings?.favicon}
                            className={styles.imageField}
                            showRemove
                        />
                    </Grid>
                    <Grid item xs={12} className={styles.subheader}  >
                        <h3>Store settings</h3>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Standard shipping price"
                            value={settings?.defaultShippingPrice ?? 0}
                            className={styles.textField}
                            fullWidth
                            InputProps={{
                                inputComponent: NumberFormatCustom as any,
                            }}
                            onChange={handleTextFieldChange('defaultShippingPrice')}
                        />
                    </Grid>
                    <Grid item xs={12} className={styles.subheader}  >
                        <h3>Store currencies</h3>
                    </Grid>
                    <Grid item xs={12} >
                        <ResponsiveGridLayout
                            margin={[15, 15]}
                            layouts={{
                                xs: currencies.map((currency, index) => {
                                    return { i: currency.id, x: (index % 2), y: Math.floor(index / 2), w: 1, h: 1 }
                                }),
                                xxs: currencies.map((currency, index) => {
                                    return { i: currency.id, x: 0, y: index, w: 1, h: 1 }
                                })
                            }}
                            breakpoints={{ xs: 480, xxs: 0 }}
                            rowHeight={330}
                            isResizable={false}
                            cols={{ xs: 2, xxs: 1 }}
                            draggableHandle='.draggableHandle'
                            onLayoutChange={(layout) => {
                                const sortedCurrencies: TCurrency[] = [];
                                const sorted = [...layout].sort((a, b) => (a.x + a.y * 10) - (b.x + b.y * 10));
                                sorted.forEach(item => {
                                    const curr = currencies.find(curr => curr.id === item.i);
                                    if (curr) sortedCurrencies.push(curr);
                                });
                                if (sortedCurrencies[0]?.tag) cstore.setActiveCurrency(sortedCurrencies[0].tag);
                                changeSettigns('currencies', sortedCurrencies)
                            }}
                        >
                            {currencies.map((currency, index) => {

                                const onChange = (item) => {
                                    setSettings(prev => {
                                        const currs = [...prev.currencies];
                                        currs[index] = item;
                                        return {
                                            ...prev,
                                            currencies: currs,
                                        }
                                    });
                                }

                                const handleTextFieldChange = (key: keyof TCurrency, type?: 'number' | 'string') =>
                                    (event: React.ChangeEvent<{ value: string }>) => {
                                        let val: string | number | undefined = event.target.value;
                                        if (type === 'number') {
                                            val = parseFloat(val);
                                            if (isNaN(val)) val = undefined;
                                        }
                                        onChange({
                                            ...currency,
                                            [key]: val
                                        })
                                    }

                                const isPrimary = index === 0;

                                return (
                                    <div className={styles.currencyItem} key={currency.id}>
                                        <div className={styles.currencyItemHeader}>
                                            <div className={styles.currencyBadge}>
                                                <Badge color="secondary" badgeContent={isPrimary ? 'Primary' : null}>
                                                    <div></div>
                                                </Badge>
                                            </div>
                                            <div>
                                                <IconButton onClick={() => handleDeleteCurrency(currency.tag)}>
                                                    <DeleteForeverIcon />
                                                </IconButton>
                                                <IconButton style={{ cursor: 'move' }} className="draggableHandle">
                                                    <DragIndicatorIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                        <TextField label="Tag"
                                            value={currency.tag ?? ''}
                                            className={styles.textField + ' draggableCancel'}
                                            fullWidth
                                            onChange={handleTextFieldChange('tag')}
                                        />
                                        <TextField label="Title"
                                            value={currency.title ?? ''}
                                            className={styles.textField + ' draggableCancel'}
                                            fullWidth
                                            onChange={handleTextFieldChange('title')}
                                        />
                                        <TextField label="Ratio"
                                            value={currency.ratio ?? ''}
                                            className={styles.textField + ' draggableCancel'}
                                            fullWidth
                                            type="number"
                                            onChange={handleTextFieldChange('ratio', 'number')}
                                        />
                                        <TextField label="Symbol"
                                            value={currency.symbol ?? ''}
                                            className={styles.textField + ' draggableCancel'}
                                            fullWidth
                                            onChange={handleTextFieldChange('symbol')}
                                        />
                                    </div>
                                )
                            })}
                        </ResponsiveGridLayout>
                        <Tooltip title="Add currency">
                            <IconButton onClick={handleAddCurrency}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} className={styles.subheader}  >
                        <h3>E-mailing settings</h3>
                    </Grid>
                    <Grid item xs={6} >
                        <TextField
                            fullWidth
                            label="Send e-mails from"
                            value={settings?.sendFromEmail ?? ''}
                            onChange={handleTextFieldChange('sendFromEmail')}
                            className={styles.field}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            label="SMTP Connection String"
                            value={settings?.smtpConnectionString ?? ''}
                            onChange={handleTextFieldChange('smtpConnectionString')}
                            className={styles.field}
                        />
                    </Grid>
                    <Grid item xs={12} className={styles.subheader}  >
                        <h3>Code injection</h3>
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            label="Header HTML"
                            multiline
                            rows={4}
                            rowsMax={20}
                            value={settings?.headerHtml ?? ''}
                            onChange={handleTextFieldChange('headerHtml')}
                            variant="outlined"
                            className={styles.field}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            label="Footer HTML"
                            multiline
                            rows={4}
                            value={settings?.footerHtml ?? ''}
                            onChange={handleTextFieldChange('footerHtml')}
                            variant="outlined"
                            className={styles.field}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}


export default SettingsPage;