import { setStoreItem, TCmsSettings, TCurrency, TDBEntity } from '@cromwell/core';
import { getCStore, getRestAPIClient } from '@cromwell/core-frontend';
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
    FormControlLabel,
    Checkbox,
    Tooltip,
} from '@material-ui/core';
import { Add as AddIcon, DeleteForever as DeleteForeverIcon, DragIndicator as DragIndicatorIcon } from '@material-ui/icons';
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

import ImagePicker from '../../components/imagePicker/ImagePicker';
import { toast } from '../../components/toast/toast';
import { languages } from '../../constants/languages';
import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import { timezones } from '../../constants/timezones';
import { NumberFormatCustom } from '../../helpers/NumberFormatCustom';
import commonStyles from '../../styles/common.module.scss';
import styles from './Settings.module.scss';

const ResponsiveGridLayout = WidthProvider(Responsive);

class SettingsPage extends React.Component<any, {
    settings: TCmsSettings | null;
    isLoading: boolean;
    exporting: boolean;
}> {

    constructor(props) {
        super(props);

        this.state = {
            settings: null,
            isLoading: false,
            exporting: false,
        }
    }

    private exportOptions: { key: TDBEntity; title: string; checked: boolean; }[] = [
        { key: 'Product', title: 'Products', checked: true, },
        { key: 'ProductCategory', title: 'Categories', checked: true, },
        { key: 'ProductReview', title: 'Reviews', checked: true, },
        { key: 'Attribute', title: 'Attributes', checked: true, },
        { key: 'Post', title: 'Posts', checked: true, },
        { key: 'Tag', title: 'Tags', checked: true, },
        { key: 'Order', title: 'Orders', checked: true, },
        { key: 'User', title: 'Users', checked: true, },
        { key: 'Plugin', title: 'Plugins', checked: false, },
        { key: 'Theme', title: 'Themes', checked: false, },
        { key: 'CMS', title: 'CMS settings', checked: false, },
    ];

    componentDidMount() {
        this.getConfig();
    }

    private changeSettings = (key: keyof TCmsSettings, value) => {
        this.setState(prev => {
            return {
                settings: {
                    ...prev.settings,
                    [key]: value
                }
            }
        })
    }

    private getConfig = async () => {
        this.setState({ isLoading: true });
        const client = getRestAPIClient();
        try {
            const settings = await client.getAdvancedCmsSettings();
            if (!Array.isArray(settings.currencies)) settings.currencies = [];
            if (settings) this.setState({ settings });
        } catch (e) {
            console.error(e);
        }
        this.setState({ isLoading: false });
    }

    private saveConfig = async () => {
        const { settings } = this.state;
        const client = getRestAPIClient();
        this.setState({ isLoading: true });
        const cstore = getCStore();

        try {
            const newConfig = await client.updateCmsConfig({
                protocol: settings.protocol,
                defaultPageSize: settings.defaultPageSize,
                currencies: settings.currencies,
                timezone: settings.timezone,
                language: settings.language,
                favicon: settings.favicon,
                logo: settings.logo,
                headHtml: settings.headHtml,
                footerHtml: settings.footerHtml,
                defaultShippingPrice: settings.defaultShippingPrice,
                smtpConnectionString: settings.smtpConnectionString,
                sendFromEmail: settings.sendFromEmail,
            });
            toast.success?.('Settings saved');
            this.setState({ settings: newConfig });
            setStoreItem('cmsSettings', newConfig);
            cstore.setActiveCurrency(newConfig.currencies?.[0]?.tag);
        } catch (e) {
            console.error(e);
            toast.error('Failed to save settings');
        }
        this.setState({ isLoading: false });
    }

    private handleTextFieldChange = (key: keyof TCmsSettings) => (event: React.ChangeEvent<{ value: string }>) => {
        this.changeSettings(key, event.target.value);
    }


    private handleDeleteCurrency = (tag: string) => {
        const { settings } = this.state;
        const currencies = (settings?.currencies ?? []);
        this.changeSettings('currencies', currencies.filter(curr => curr.tag !== tag));
    }

    private handleAddCurrency = () => {
        const { settings } = this.state;
        const currencies = (settings?.currencies ?? []);
        this.changeSettings('currencies', [...currencies, {
            tag: 'new',
            id: currencies.length + 1 + '',
        }]);

    }

    private importDB = async () => {
        const input = document.createElement('input');
        input.style.display = 'none';
        input.multiple = true;
        input.type = 'file';
        input.accept = '.xlsx';
        document.body.appendChild(input);

        input.addEventListener("change", async (e: any) => {
            // Get the selected file from the input element
            const files = e.target?.files;
            if (!files) return;

            this.setState({ exporting: true });

            try {
                await getRestAPIClient()?.importDB(files);
                toast.success?.('Successfully imported');
            } catch (e) {
                console.error(e);
            }
            input.remove();
            this.setState({ exporting: false });
        });

        input.click();
    }

    private exportDB = async () => {
        this.setState({ exporting: true });
        try {
            await getRestAPIClient().exportDB(
                this.exportOptions.filter(opt => opt.checked).map(opt => opt.key)
            );
        } catch (e) {
            console.error(e)
        }
        this.setState({ exporting: false });
    }

    private toggleExportOption = (key: string) => {
        const option = this.exportOptions.find(opt => opt.key === key);
        if (option) option.checked = !option.checked;
        this.forceUpdate();
    }

    render() {
        const { settings } = this.state;
        const currencies = settings?.currencies ?? [];


        return (
            <div className={styles.SettingsPage}>
                <div className={styles.header}>
                    <p className={commonStyles.pageTitle}>settings</p>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={this.saveConfig}
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
                                        this.changeSettings('timezone', parseInt(event.target.value as string));
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
                                        this.changeSettings('language', event.target.value);
                                    }}
                                >
                                    {languages.map(lang => (
                                        <MenuItem value={lang.code} key={lang.code}>{lang.name} ({lang.nativeName})</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ImagePicker
                                label="Logo"
                                onChange={(val) => this.changeSettings('logo', val)}
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
                                onChange={(val) => this.changeSettings('favicon', val)}
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
                                onChange={this.handleTextFieldChange('defaultShippingPrice')}
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
                                    this.changeSettings('currencies', sortedCurrencies)
                                }}
                            >
                                {currencies.map((currency, index) => {

                                    const onChange = (item) => {
                                        this.setState(prev => {
                                            const currs = [...prev.settings.currencies];
                                            currs[index] = item;
                                            return {
                                                settings: {
                                                    ...prev.settings,
                                                    currencies: currs,
                                                }
                                            }
                                        })
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
                                                    <IconButton onClick={() => this.handleDeleteCurrency(currency.tag)}>
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
                                <IconButton onClick={this.handleAddCurrency}>
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
                                onChange={this.handleTextFieldChange('sendFromEmail')}
                                className={styles.field}
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField
                                fullWidth
                                label="SMTP Connection String"
                                value={settings?.smtpConnectionString ?? ''}
                                onChange={this.handleTextFieldChange('smtpConnectionString')}
                                className={styles.field}
                            />
                        </Grid>
                        <Grid item xs={12} className={styles.subheader}  >
                            <h3>Code injection</h3>
                        </Grid>
                        <Grid item xs={12} >
                            <TextField
                                fullWidth
                                label="Head HTML"
                                multiline
                                rows={4}
                                rowsMax={20}
                                value={settings?.headHtml ?? ''}
                                onChange={this.handleTextFieldChange('headHtml')}
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
                                onChange={this.handleTextFieldChange('footerHtml')}
                                variant="outlined"
                                className={styles.field}
                            />
                        </Grid>
                        <Grid item xs={12} className={styles.subheader}  >
                            <h3>Migration</h3>
                        </Grid>
                        <Grid item xs={12} >
                            <p>Pick tables to export:</p>
                            <div className={styles.exportOptions}>
                                {this.exportOptions.map(option => (
                                    <FormControlLabel
                                        key={option.key}
                                        control={
                                            <Checkbox
                                                checked={option.checked}
                                                onChange={() => this.toggleExportOption(option.key)}
                                                name={option.title}
                                                color="primary"
                                            />
                                        }
                                        label={option.title}
                                    />
                                ))}
                            </div>
                            <Button
                                disabled={this.state?.exporting}
                                color="primary"
                                variant="contained"
                                size="small"
                                className={styles.exportBtn}
                                onClick={this.exportDB}
                            >Export to Excel</Button>
                            <p style={{ marginTop: '20px' }}>Import from Excel file(s):</p>
                            <Button
                                disabled={this.state?.exporting}
                                color="primary"
                                variant="contained"
                                className={styles.exportBtn}
                                size="small"
                                onClick={this.importDB}
                            >Import from Excel</Button>
                        </Grid>

                    </Grid>
                    <LoadingStatus isActive={this.state?.exporting} />
                </div>
            </div>
        )
    }
}

export default SettingsPage;