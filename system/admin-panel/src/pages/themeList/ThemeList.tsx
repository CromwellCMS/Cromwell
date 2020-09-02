import React, { useState, useEffect } from 'react';
import { TThemeInfo, getCmsConfig } from '@cromwell/core'
import { getRestAPIClient, CromwellBlockCSSclass } from '@cromwell/core-frontend';
import styles from './ThemeList.module.scss';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useHistory } from "react-router-dom";
import { themeEditPageInfo } from '../../constants/PageInfos';

export default function ThemeList() {
    const [infos, setInfos] = useState<TThemeInfo[]>([]);
    const [isListLoading, setIsListLoading] = useState<boolean>(true);
    const cmsConfig = getCmsConfig();
    const history = useHistory();

    useEffect(() => {
        (async () => {
            const client = getRestAPIClient();
            const infos = await client?.getThemesInfo();
            if (infos) setInfos(infos);
            setIsListLoading(false);
        })();
    }, []);

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
                                <Button size="small" color="primary" variant="contained">
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
