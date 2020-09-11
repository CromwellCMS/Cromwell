import { getCmsConfig, TThemeInfo, TCmsConfig } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { Badge, Button, Card, CardActionArea, CardActions, CardContent, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { themeEditPageInfo } from '../../constants/PageInfos';
import styles from './ThemeList.module.scss';

export default function ThemeList() {
    const [infos, setInfos] = useState<TThemeInfo[]>([]);
    const [isListLoading, setIsListLoading] = useState<boolean>(true);
    const [cmsConfig, setCmsConfig] = useState<TCmsConfig | undefined>(getCmsConfig());
    const history = useHistory();
    const client = getRestAPIClient();

    useEffect(() => {
        (async () => {
            const infos = await client?.getThemesInfo();
            if (infos) setInfos(infos);
            setIsListLoading(false);
        })();
    }, []);

    const handleSetActiveTheme = async (info: TThemeInfo) => {
        if (client) {
            setIsListLoading(true);
            await client.changeTheme(info.themeName);
            const updatedConfig = await client.getCmsConfig();
            setCmsConfig(updatedConfig);
            setIsListLoading(false);

        }
    }

    return (
        <div className={styles.ThemeList}>
            {infos.map(info => {
                const isActive = Boolean(cmsConfig && cmsConfig.themeName === info.themeName);
                return (
                    <Card className={styles.themeCard}>
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
                                >
                                    Edit theme
                                </Button>
                            )}
                            {!isActive && (
                                <Button size="small" color="primary" variant="contained"
                                    onClick={() => handleSetActiveTheme(info)}>
                                    Set active
                                </Button>
                            )}
                            <Button size="small" color="primary" variant="outlined">
                                Delete
                          </Button>
                            <Button size="small" color="primary" variant="outlined">
                                Learn More
                          </Button>
                        </CardActions>
                    </Card>
                )
            })}
        </div>
    )
}
