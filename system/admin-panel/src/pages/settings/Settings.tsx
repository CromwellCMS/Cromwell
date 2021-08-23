import { setStoreItem, TCmsInfo, TCmsSettings, TCurrency, TDBEntity } from '@cromwell/core';
import { getCStore, getRestApiClient } from '@cromwell/core-frontend';
import {
    Badge,
    Button,
    Checkbox,
    Collapse,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from '@material-ui/core';
import {
    Add as AddIcon,
    Code as CodeIcon,
    DeleteForever as DeleteForeverIcon,
    DragIndicator as DragIndicatorIcon,
    Email as EmailIcon,
    ExpandMore as ExpandMoreIcon,
    HelpOutline as HelpOutlineIcon,
    ImportExport as ImportExportIcon,
    MonetizationOn as MonetizationOnIcon,
    OpenInNew as OpenInNewIcon,
    Public as PublicIcon,
    Search as SearchIcon,
    Store as StoreIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

import CmsInfo from '../../components/cmsInfo/CmsInfo';
import ImagePicker from '../../components/imagePicker/ImagePicker';
import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import { toast } from '../../components/toast/toast';
import { languages } from '../../constants/languages';
import { timezones } from '../../constants/timezones';
import { NumberFormatCustom } from '../../helpers/NumberFormatCustom';
import commonStyles from '../../styles/common.module.scss';
import { ModeSwitch } from './ModeSwitch';
import styles from './Settings.module.scss';


const ResponsiveGridLayout = WidthProvider(Responsive);

type TAdminCmsSettings = TCmsSettings & {
    cmsInfo?: TCmsInfo;
    robotsContent?: string;
}

class SettingsPage extends React.Component<any, {
    settings: TAdminCmsSettings | null;
    isLoading: boolean;
    exporting: boolean;
    buildingSitemap: boolean;
    cmsInfoOpen: boolean;
    expandedItems: Record<string, boolean>;
}> {

    constructor(props) {
        super(props);

        this.state = {
            settings: null,
            isLoading: false,
            exporting: false,
            cmsInfoOpen: false,
            buildingSitemap: false,
            expandedItems: {},
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

    private changeSettings = (key: keyof TAdminCmsSettings, value) => {
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
        const client = getRestApiClient();
        try {
            const settings = await client.getAdminCmsSettings();
            if (settings) {
                if (!Array.isArray(settings.currencies)) settings.currencies = [];
                this.setState({ settings });
                setStoreItem('cmsSettings', settings)
            }
        } catch (e) {
            console.error(e);
        }
        this.setState({ isLoading: false });
    }

    private saveConfig = async () => {
        const { settings } = this.state;
        const client = getRestApiClient();
        this.setState({ isLoading: true });
        const cstore = getCStore();

        try {
            const newConfig = await client.saveCmsSettings({
                url: settings.url,
                robotsContent: settings.robotsContent,
                defaultPageSize: settings.defaultPageSize,
                currencies: settings.currencies,
                timezone: settings.timezone,
                language: settings.language,
                favicon: settings.favicon,
                logo: settings.logo,
                headHtml: settings.headHtml,
                footerHtml: settings.footerHtml,
                defaultShippingPrice: settings.defaultShippingPrice,
                sendFromEmail: settings.sendFromEmail,
                smtpConnectionString: settings.smtpConnectionString,
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

    private handleTextFieldChange = (key: keyof TAdminCmsSettings) => (event: React.ChangeEvent<{ value: string }>) => {
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
                await getRestApiClient()?.importDB(files);
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
            await getRestApiClient().exportDB(
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

    private buildSitemap = async () => {
        this.setState({ buildingSitemap: true });
        try {
            await getRestApiClient().buildSitemap();
            toast.success('Sitemap has been rebuilt');
        } catch (e) {
            toast.error('Failed to rebuild Sitemap');
            console.error(e)
        }
        this.setState({ buildingSitemap: false });
    }

    private makeCategory = (props: {
        title: string;
        content: JSX.Element;
        icon: JSX.Element;
        link?: string;
    }) => {
        const isExpanded = !!this.state.expandedItems[props.title];

        return (
            <div className={styles.category}>
                <div className={styles.categoryHeaderWrapper}
                    onClick={() => this.setState(prevState => {
                        return {
                            expandedItems: {
                                ...prevState.expandedItems,
                                [props.title]: !prevState.expandedItems[props.title],
                            }
                        }
                    })}
                >
                    <div className={styles.categoryLeft}>
                        <IconButton
                            className={clsx(styles.expand, {
                                [styles.expandOpen]: isExpanded,
                            })}
                            aria-expanded={isExpanded}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                        <div className={styles.categoryIcon}>
                            {props.icon}
                        </div>
                        <p className={styles.categoryTitle}>{props.title}</p>
                    </div>
                    <div>
                        {props.link && (
                            <Tooltip title="Documentation">
                                <IconButton
                                    onClick={() => window.open(props.link, '_blank')}>
                                    <HelpOutlineIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </div>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <div className={styles.categoryContent}>
                        <Grid container spacing={3} >
                            {props.content}
                        </Grid>
                    </div>
                </Collapse>
            </div >
        )
    }

    render() {
        const { settings } = this.state;
        const currencies = settings?.currencies ?? [];

        return (
            <div className={styles.SettingsPage} >
                <div className={styles.header}>
                    <p className={commonStyles.pageTitle}>settings</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '20px' }}>
                            <ModeSwitch />
                        </div>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={this.saveConfig}
                            size="small"
                        >Save</Button>
                    </div>
                </div>
                <div className={styles.list}>
                    {this.makeCategory({
                        title: 'General',
                        icon: <PublicIcon />,
                        content: (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <FormControl className={styles.field} fullWidth>
                                        <TextField label="Website URL"
                                            value={settings?.url ?? ''}
                                            className={styles.textField}
                                            fullWidth
                                            onChange={this.handleTextFieldChange('url')}
                                        />
                                    </FormControl>
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
                            </>
                        )
                    })}

                    {this.makeCategory({
                        title: 'Store settings',
                        icon: <StoreIcon />,
                        content: (
                            <>
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
                            </>
                        )
                    })}

                    {this.makeCategory({
                        title: 'Store currencies',
                        icon: <MonetizationOnIcon />,
                        content: (
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
                        )
                    })}

                    {this.makeCategory({
                        title: 'Emailing settings',
                        link: 'https://cromwellcms.com/docs/features/mail',
                        icon: <EmailIcon />,
                        content: (
                            <>
                                <Grid item xs={12} sm={6} >
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
                            </>
                        )
                    })}

                    {this.makeCategory({
                        title: 'Code injection',
                        icon: <CodeIcon />,
                        content: (
                            <>
                                <Grid item xs={12} >
                                    <TextField
                                        fullWidth
                                        label="Head HTML"
                                        multiline
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
                                        rowsMax={20}
                                        value={settings?.footerHtml ?? ''}
                                        onChange={this.handleTextFieldChange('footerHtml')}
                                        variant="outlined"
                                        className={styles.field}
                                    />
                                </Grid>
                            </>
                        )
                    })}

                    {this.makeCategory({
                        title: 'Migration',
                        icon: <ImportExportIcon />,
                        link: 'https://cromwellcms.com/docs/features/migration',
                        content: (
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
                        )
                    })}

                    {this.makeCategory({
                        title: 'SEO',
                        icon: <SearchIcon />,
                        link: 'https://cromwellcms.com/docs/features/seo',
                        content: (
                            <>
                                <Grid item xs={12} >
                                    <TextField
                                        multiline
                                        rowsMax={8}
                                        fullWidth
                                        variant="outlined"
                                        label="robots.txt"
                                        value={settings?.robotsContent}
                                        onChange={(e) => this.changeSettings('robotsContent', e.target.value)}
                                    />

                                </Grid>
                                <Grid item xs={12} >
                                    <div>
                                        <Button
                                            disabled={this.state?.buildingSitemap}
                                            color="primary"
                                            variant="contained"
                                            className={styles.exportBtn}
                                            size="small"
                                            onClick={this.buildSitemap}
                                        >Rebuild Sitemap</Button>
                                        <Tooltip title="Open Sitemap">
                                            <IconButton
                                                style={{ marginLeft: '10px' }}
                                                onClick={() => window.open('/default_sitemap.xml', '_blank')}>
                                                <OpenInNewIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </Grid>
                            </>
                        )
                    })}
                    <p className={styles.cmsVersion}
                        onClick={() => this.setState({ cmsInfoOpen: true })}
                    >Cromwell CMS v.{settings?.cmsInfo?.packages['@cromwell/cms']}</p>
                </div>
                <CmsInfo
                    open={this.state.cmsInfoOpen}
                    onClose={() => this.setState({ cmsInfoOpen: false })}
                />
                <LoadingStatus isActive={this.state?.exporting || this.state?.buildingSitemap} />
            </div>
        )
    }
}

export default SettingsPage;