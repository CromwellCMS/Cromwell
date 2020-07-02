import { CromwellBlockDataType, PageInfoType, setStoreItem } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import MuiMenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import React, { Suspense, useEffect, useRef, useState } from 'react';

import { importLazyPage } from '../../../.cromwell/imports/pages.imports.gen';
import PageErrorBoundary from '../../components/errorBoundaries/PageErrorBoundary';
import LoadBox from '../../components/loadBox/LoadBox';
import styles from './ThemeEdit.module.scss';


const MenuItem = withStyles({
    root: {
        width: '100%',
        paddingTop: '12px',
        paddingBottom: '12px'
    },
})(MuiMenuItem);

export default function ThemeEdit() {

    const [pageInfos, setPageInfos] = useState<PageInfoType[] | null>(null);
    const editingFrameRef = useRef(null);
    const [editingPageConfig, setEditingPageConfig] = useState<PageInfoType | null>(null);
    const [EditingPage, setEditingPage] = useState<React.LazyExoticComponent<React.ComponentType<any>> | null>(null);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
    const [isPageListLoading, setIsPageListLoading] = useState<boolean>(true);


    useEffect(() => {
        (async () => {
            const infos = await getRestAPIClient().getPagesInfo();
            if (infos) setPageInfos(infos);
            setIsPageListLoading(false);
        })();
    }, []);

    const onOpenPage = async (pageCofig: PageInfoType) => {
        setIsPageLoading(true);
        const pageModifications: CromwellBlockDataType[] = await getRestAPIClient().getThemeModifications(pageCofig.route);
        console.log('pageModifications', pageModifications);
        setStoreItem('blocksData', pageModifications);

        setEditingPageConfig(pageCofig);
        const pageComp = importLazyPage(pageCofig.route);
        if (pageComp) setEditingPage(pageComp);
        setIsPageLoading(false);
    }

    return (
        <div className={styles.ThemeEdit}>
            <div>
                {isPageListLoading && (
                    <LoadBox />
                )}
                {!isPageListLoading && pageInfos && pageInfos.map(p => (
                    <div onClick={() => { onOpenPage(p) }}>
                        <MenuItem>
                            <p>{p.name}</p>
                        </MenuItem>
                    </div>
                ))}
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
            {!isPageLoading && EditingPage && (
                <div>
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
