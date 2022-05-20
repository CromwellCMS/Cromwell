import { EDBEntity, setStoreItem, TCmsInfo, TCmsSettings } from '@cromwell/core';
import { getCStore, getRestApiClient } from '@cromwell/core-frontend';
import {
    Code as CodeIcon,
    Email as EmailIcon,
    ExpandMore as ExpandMoreIcon,
    HelpOutline as HelpOutlineIcon,
    ImportExport as ImportExportIcon,
    MonetizationOn as MonetizationOnIcon,
    Public as PublicIcon,
    Search as SearchIcon,
    Store as StoreIcon,
} from '@mui/icons-material';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { Button, Collapse, IconButton, Tooltip } from '@mui/material';
import clsx from 'clsx';
import React from 'react';

import CmsInfo from '../../components/cmsInfo/CmsInfo';
import { AdminModeSwitch } from '../../components/modeSwitch/ModeSwitch';
import { toast } from '../../components/toast/toast';
import { registerCustomEntity } from '../../helpers/customEntities';
import { getCustomMetaFor, registerCustomFieldOfType } from '../../helpers/customFields';
import commonStyles from '../../styles/common.module.scss';
import styles from './Settings.module.scss';
import CodeInjectionTab from './tabs/CodeInjection';
import CustomDataTab from './tabs/CustomData';
import EmailingSettingsTab from './tabs/EmailingSettings';
import GeneralTab from './tabs/General';
import MigrationTab from './tabs/Migration';
import SEOTab from './tabs/SEO';
import StoreCurrenciesTab from './tabs/StoreCurrencies';
import StoreSettingsTab from './tabs/StoreSettings';


export type TAdminCmsSettings = TCmsSettings & {
    cmsInfo?: TCmsInfo;
    robotsContent?: string;
}

export type TTabProps = {
    handleTextFieldChange: (key: keyof TAdminCmsSettings) => (event: React.ChangeEvent<{ value: string }>) => void;
    changeSettings: (key: keyof TAdminCmsSettings, value: any) => void;
    settings: TAdminCmsSettings | null;
}

class SettingsPage extends React.Component<any, {
    settings: TAdminCmsSettings | null;
    isLoading: boolean;
    cmsInfoOpen: boolean;
    expandedItems: Record<string, boolean>;
}> {

    constructor(props) {
        super(props);

        this.state = {
            settings: null,
            isLoading: false,
            cmsInfoOpen: false,
            expandedItems: {},
        }
    }

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
                signupRoles: settings.signupRoles,
                signupEnabled: settings.signupEnabled,
                showUnapprovedReviews: settings.showUnapprovedReviews,
                customFields: settings.customFields?.filter(field => field.key),
                customEntities: settings.customEntities?.filter(entity => entity.entityType),
                customMeta: Object.assign({}, settings.customMeta, await getCustomMetaFor(EDBEntity.CMS)),
            });
            toast.success?.('Settings saved');
            this.setState({ settings: newConfig });
            setStoreItem('cmsSettings', newConfig);

            const activeCurrency = newConfig.currencies?.[0]?.tag;
            if (activeCurrency && activeCurrency !== cstore.getActiveCurrencyTag()) {
                cstore.setActiveCurrency(activeCurrency);
            }

            newConfig?.customFields?.forEach(registerCustomFieldOfType);
            newConfig?.customEntities?.forEach(registerCustomEntity);
        } catch (e) {
            console.error(e);
            toast.error('Failed to save settings');
        }
        this.setState({ isLoading: false });
    }

    private handleTextFieldChange = (key: keyof TAdminCmsSettings) => (event: React.ChangeEvent<{ value: string }>) => {
        this.changeSettings(key, event.target.value);
    }


    private makeCategory = (props: {
        title: string;
        component: (props: TTabProps) => JSX.Element;
        icon: JSX.Element;
        link?: string;
    }) => {
        const isExpanded = !!this.state.expandedItems[props.title];

        return (
            <div className={styles.category} key={props.title}>
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
                        <props.component
                            settings={this.state?.settings}
                            handleTextFieldChange={this.handleTextFieldChange}
                            changeSettings={this.changeSettings}
                        />
                    </div>
                </Collapse>
            </div >
        )
    }

    render() {
        const { settings } = this.state;

        return (
            <div className={styles.SettingsPage} >
                <div className={styles.header}>
                    <p className={commonStyles.pageTitle}>settings</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '20px' }}>
                            <AdminModeSwitch />
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
                        component: GeneralTab,
                    })}

                    {this.makeCategory({
                        title: 'Store settings',
                        icon: <StoreIcon />,
                        component: StoreSettingsTab,
                    })}

                    {this.makeCategory({
                        title: 'Store currencies',
                        icon: <MonetizationOnIcon />,
                        component: StoreCurrenciesTab,
                    })}

                    {this.makeCategory({
                        title: 'Emailing settings',
                        link: 'https://cromwellcms.com/docs/features/mail',
                        icon: <EmailIcon />,
                        component: EmailingSettingsTab,
                    })}

                    {this.makeCategory({
                        title: 'Code injection',
                        icon: <CodeIcon />,
                        component: CodeInjectionTab,
                    })}

                    {this.makeCategory({
                        title: 'Migration',
                        icon: <ImportExportIcon />,
                        link: 'https://cromwellcms.com/docs/features/migration',
                        component: MigrationTab,
                    })}

                    {this.makeCategory({
                        title: 'SEO',
                        icon: <SearchIcon />,
                        link: 'https://cromwellcms.com/docs/features/seo',
                        component: SEOTab,
                    })}

                    {this.makeCategory({
                        title: 'Custom data',
                        icon: <DashboardCustomizeIcon />,
                        component: CustomDataTab,
                    })}

                    <p className={styles.cmsVersion}
                        onClick={() => this.setState({ cmsInfoOpen: true })}
                    >Cromwell CMS v.{settings?.cmsInfo?.packages['@cromwell/cms']}</p>
                </div>
                <CmsInfo
                    open={this.state.cmsInfoOpen}
                    onClose={() => this.setState({ cmsInfoOpen: false })}
                />
            </div >
        )
    }
}

export default SettingsPage;