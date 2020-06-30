import React, { Suspense } from 'react';
import PageErrorBoundary from '../errorBoundaries/PageErrorBoundary';
import styles from './Page.module.scss';
import { text } from '../../styles/common.module.scss';

export default function Page(props: { component: React.ComponentType }) {
    return (
        <div className={`${styles.Page} ${text}`}>
            <h2>Page</h2>
            <PageErrorBoundary>
                <Suspense fallback={<div>Loading...</div>}>
                    <props.component />
                </Suspense>
            </PageErrorBoundary>
        </div>
    )
}
