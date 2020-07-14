import { TCromwellBlockData, TPageInfo, setStoreItem, TPageConfig } from '@cromwell/core';
import { cromwellBlockTypeFromClassname, cromwellIdFromHTML, getRestAPIClient } from '@cromwell/core-frontend';
import MuiMenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { DomElement } from 'htmlparser2';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';

import { importStaticPage, importLazyPage } from '../../../.cromwell/imports/pages.gen';
import { CromwellBlockWrappingComponent, CromwellBlockContentComponent } from '../../components/cromwellAdminBlock/CromwellAdminBlock';
import cromwellAdminBlockStyles from '../../components/cromwellAdminBlock/CromwellAdminBlock.module.scss';
import PageErrorBoundary from '../../components/errorBoundaries/PageErrorBoundary';
import LoadBox from '../../components/loadBox/LoadBox';
import { Draggable } from '../../helpers/Draggable';
import styles from './ThemeEdit.module.scss';

const MenuItem = withStyles({
    root: {
        width: '100%',
        paddingTop: '12px',
        paddingBottom: '12px'
    },
})(MuiMenuItem);

// setStoreItem('cromwellBlockContentComponent', CromwellBlockContentComponent);
setStoreItem('cromwellBlockWrappingComponent', CromwellBlockWrappingComponent);

// const transformReactHtmlParser = (node: DomElement) => {
//     if (node.attribs && node.attribs.class && node.attribs.class.includes('CromwellBlock')) {
//         const id = cromwellIdFromHTML(node.attribs.id);
//         const type = cromwellBlockTypeFromClassname(node.attribs.class);
//         // console.log('id', id, 'type', type, node);
//         return (
//             <CromwellAdminBlock id={id} type={type ? type : undefined}>
//                 {node.children ? node.children.map((c, i) => convertNodeToElement(c, i, transformReactHtmlParser)) : ''}
//             </CromwellAdminBlock>
//         )
//     }
// }

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


    useEffect(() => {
        (async () => {
            const infos = await getRestAPIClient().getPagesInfo();
            if (infos) setPageInfos(infos);
            setIsPageListLoading(false);
        })();
    }, []);

    const onOpenPage = async (pageCofig: TPageInfo) => {
        setIsPageLoading(true);
        setIsPageListCollapsed(true);
        const pageModifications: TPageConfig = await getRestAPIClient().getPageConfig(pageCofig.route);
        const appConfig = await getRestAPIClient().getAppConfig();
        const appCustomConfig = await getRestAPIClient().getAppCustomConfig();
        // console.log('pageModifications', pageModifications);
        setStoreItem('pageConfig', pageModifications);
        setStoreItem('appConfig', appConfig);
        setStoreItem('appCustomConfig', appCustomConfig);

        setEditingPageConfig(pageCofig);
        // const pageComp = importStaticPage(pageCofig.route);
        const pageComp = importLazyPage(pageCofig.route);

        if (pageComp) setEditingPage(pageComp);
        setIsPageLoading(false);

        draggable = new Draggable(editorWindowRef.current,
            `.${cromwellAdminBlockStyles.CromwellAdminBlock}`,
            `.${cromwellAdminBlockStyles.dragFrame}`);

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
                        {/* {ReactHtmlParser(EditingPage, {
                            transform: transformReactHtmlParser
                        })} */}
                    </PageErrorBoundary>
                </div>
            )}
        </div>
    )
}

