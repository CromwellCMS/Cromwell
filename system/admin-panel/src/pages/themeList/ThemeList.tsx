import { getCmsConfig, TThemeInfo, TCmsConfig } from '@cromwell/core';
import { getRestAPIClient, getWebSocketClient } from '@cromwell/core-frontend';
import { Badge, Button, Card, CardActionArea, CardActions, CardContent, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { themeEditPageInfo } from '../../constants/PageInfos';
import styles from './ThemeList.module.scss';
import { ManagerLogger } from '../../components/managerLogger/ManagerLogger';
import { LoadingStatus } from '../../components/loadBox/LoadingStatus';

export default function ThemeList() {
    const [infos, setInfos] = useState<TThemeInfo[]>([]);
    const [isListLoading, setIsListLoading] = useState<boolean>(true);
    const [isChangingTheme, setIsChangingTheme] = useState<boolean>(false);
    const [cmsConfig, setCmsConfig] = useState<TCmsConfig | undefined>(getCmsConfig());
    const history = useHistory();
    const client = getRestAPIClient();

    useEffect(() => {
        (async () => {
            const updatedConfig = await client?.getCmsConfigAndSave();
            setCmsConfig(updatedConfig);

            const infos = await client?.getThemesInfo();
            infos?.sort((a, b) => (updatedConfig && a.themeName === updatedConfig.themeName) ? -1 : 1)
            if (infos) setInfos(infos);
            setIsListLoading(false);
        })();
    }, []);

    const handleSetActiveTheme = async (info: TThemeInfo) => {
        if (client) {
            setIsChangingTheme(true);
            const success = await client.changeTheme(info.themeName);
            if (success) {
                toast.success('Applied a new theme');
            } else {
                toast.error('Failed to set a new theme');
            }
            const updatedConfig = await client.getCmsConfig();
            infos?.sort((a, b) => (updatedConfig && a.themeName === updatedConfig.themeName) ? -1 : 1)
            setCmsConfig(updatedConfig);
            setIsChangingTheme(false);
        }
    }

    const handleRebuildTheme = async () => {
        if (client) {
            setIsChangingTheme(true);
            const success = await client.rebuildTheme();
            if (success) {
                toast.success('Rebuilded theme');
            } else {
                toast.error('Failed to rebuild theme');
            }
            setIsChangingTheme(false);
        }
    }

    return (
        <div className={styles.ThemeList}>
            {infos.map(info => {
                const isActive = Boolean(cmsConfig && cmsConfig.themeName === info.themeName);
                return (
                    <Card className={styles.themeCard} key={info.themeName}>
                        <CardActionArea>
                            <div
                                style={{ backgroundImage: `url(${info.previewImage})` }}
                                className={styles.themeImage}
                            ></div>
                            <CardContent>
                                <Badge color="secondary" badgeContent={isActive ? 'Active' : null}>
                                    <Typography gutterBottom variant="h5" component="h2" className={styles.themeTitle}>
                                        {info.title}
                                    </Typography>
                                </Badge>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {info.description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions className={styles.themeActions} disableSpacing>
                            {isActive && (
                                <Button size="small" color="primary" variant="contained"
                                    onClick={() => {
                                        const route = `${themeEditPageInfo.baseRoute}/${info.themeName}`;
                                        history.push(route);
                                    }}
                                    disabled={isChangingTheme}
                                >
                                    Edit theme
                                </Button>
                            )}
                            {!isActive && (
                                <Button size="small" color="primary" variant="contained"
                                    onClick={() => handleSetActiveTheme(info)}
                                    disabled={isChangingTheme}
                                >
                                    Set active
                                </Button>
                            )}
                            <Button size="small" color="primary" variant="outlined"
                                disabled={isChangingTheme}
                            >
                                Delete
                          </Button>
                            <Button size="small" color="primary" variant="outlined">
                                Info
                          </Button>
                            {isActive && (
                                <Button size="small" color="primary" variant="outlined"
                                    onClick={handleRebuildTheme}
                                    disabled={isChangingTheme}
                                >
                                    Rebuild
                                </Button>
                            )}
                        </CardActions>
                    </Card>
                )
            })}
            <ManagerLogger isActive={isChangingTheme} />
            <LoadingStatus isActive={isChangingTheme} />
        </div>
    )
}
