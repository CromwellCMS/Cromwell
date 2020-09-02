import { TPageInfo, setStoreItem, TPageConfig } from '@cromwell/core';
import { getRestAPIClient, CromwellBlockCSSclass } from '@cromwell/core-frontend';
import { MenuItem as MuiMenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { importStaticPage, importLazyPage } from '../../../.cromwell/imports/pages.gen';
import PageErrorBoundary from '../../components/errorBoundaries/PageErrorBoundary';
import LoadBox from '../../components/loadBox/LoadBox';
import { Draggable } from '../../helpers/Draggable/Draggable';
import '../../helpers/Draggable/Draggable.css';
import styles from './ThemeEdit.module.scss';
import { useParams } from "react-router-dom";
const MenuItem = withStyles({
    root: {
        width: '100%',
        paddingTop: '12px',
        paddingBottom: '12px'
    },
})(MuiMenuItem);


let draggable: Draggable;

export default function ThemeEdit() {
    const [pageInfos, setPageInfos] = useState<TPageInfo[] | null>(null);
    const editorWindowRef = useRef<HTMLDivElement>(null);
    const [editingPageConfig, setEditingPageConfig] = useState<TPageInfo | null>(null);
    const [EditingPage, setEditingPage] = useState<React.LazyExoticComponent<React.ComponentType<any>> | null>(null);
    // const [EditingPage, setEditingPage] = useState<string | null>(null);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
    const [isPageListLoading, setIsPageListLoading] = useState<boolean>(true);
    const [isPageListCollapsed, setIsPageListCollapsed] = useState<boolean>(false);
    const { themeName } = useParams();
    
    useEffect(() => {
        (async () => {
            const infos = await getRestAPIClient()?.getPagesInfo();
            if (infos) setPageInfos(infos);
            setIsPageListLoading(false);
        })();
    }, []);

    const onOpenPage = async (pageCofig: TPageInfo) => {
        setIsPageLoading(true);
        setIsPageListCollapsed(true);
        const pageModifications: TPageConfig | undefined = await getRestAPIClient()?.getPageConfig(pageCofig.route);
        const appConfig = await getRestAPIClient()?.getAppConfig();
        const appCustomConfig = await getRestAPIClient()?.getAppCustomConfig();
        // console.log('pageModifications', pageModifications);
        setStoreItem('pageConfig', pageModifications);
        setStoreItem('appConfig', appConfig);
        setStoreItem('appCustomConfig', appCustomConfig);

        setEditingPageConfig(pageCofig);
        // const pageComp = importStaticPage(pageCofig.route);
        const pageComp = importLazyPage(pageCofig.route);

        if (pageComp) setEditingPage(pageComp);
        setIsPageLoading(false);

        draggable = new Draggable(`.${CromwellBlockCSSclass}`, editorWindowRef.current ? editorWindowRef.current : undefined);

    }

    return (
        <div className={styles.ThemeEdit}>
            <div>
                {isPageListLoading && (
                    <LoadBox />
                )}
                {!isPageListLoading && !isPageListCollapsed &&
                    pageInfos && pageInfos.map(p => (
                        <div onClick={() => { onOpenPage(p) }}>
                            <MenuItem>
                                <p>{p.name}</p>
                            </MenuItem>
                        </div>
                    ))}
                {
                    !isPageListLoading && isPageListCollapsed && (
                        <MenuItem
                            onClick={() => { setIsPageListCollapsed(false) }}
                        >{'<--'}</MenuItem>
                    )
                }
            </div>
            {/* {editingPage && (
                <div>
                    <iframe
                        src={`${frontendUrl}/${editingPage.route}`}
                        ref={editingFrameRef}
                    />
                </div>
            )} */}
            {isPageLoading && (<LoadBox />)}
            {!isPageLoading && EditingPage && isPageListCollapsed && (
                <div className={styles.EditorWindow} ref={editorWindowRef}>
                    <PageErrorBoundary>
                        <Suspense fallback={<LoadBox />}>
                            <EditingPage />
                        </Suspense>
                    </PageErrorBoundary>
                </div>
            )}
        </div>
    )
}

