import React, { useState, useRef, Suspense } from 'react';
import { ThemeConfigType, PageConfigType, CMSconfigType } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { themeConfig, CMSconfig } from '../../../.cromwell/imports/imports.gen';
import { importLazyPage } from '../../../.cromwell/imports/pages.imports.gen';
import MuiMenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import PageErrorBoundary from '../../components/errorBoundaries/PageErrorBoundary';


const MenuItem = withStyles({
    root: {
        width: '100%',
        paddingTop: '12px',
        paddingBottom: '12px'
    },
})(MuiMenuItem);

export default function ThemeEdit() {
    const editingFrameRef = useRef(null);
    const [editingPageConfig, setEditingPageConfig] = useState<PageConfigType | null>(null);
    const [EditingPage, setEditingPage] = useState<React.LazyExoticComponent<React.ComponentType<any>> | null>(null);

    const pages = (themeConfig as ThemeConfigType).pages;
    const frontendUrl = `http://localhost:${(CMSconfig as CMSconfigType).frontendPort}`

    const onOpenPage = async (pageCofig: PageConfigType) => {
        setEditingPageConfig(pageCofig);
        const pageComp = importLazyPage(pageCofig.route);
        if (pageComp) setEditingPage(pageComp);
        const pageModifications = await getRestAPIClient().getThemeModifications(pageCofig.route);
        console.log('pageModifications', pageModifications);
    }

    return (
        <div>
            <div>
                {pages.map(p => (
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
            {EditingPage && (
                <div>
                    <PageErrorBoundary>
                        <Suspense fallback={<div>Loading...</div>}>
                            <EditingPage />
                        </Suspense>
                    </PageErrorBoundary>
                </div>

            )}
        </div>
    )
}
