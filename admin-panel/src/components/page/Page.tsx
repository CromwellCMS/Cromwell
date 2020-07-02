import React, { Suspense } from 'react';

import { text } from '../../styles/common.module.scss';
import PageErrorBoundary from '../errorBoundaries/PageErrorBoundary';
import LoadBox from '../loadBox/LoadBox';
import styles from './Page.module.scss';

export default function Page(props: { component: React.ComponentType }) {
    return (
        <div className={`${styles.Page} ${text}`}>
            <PageErrorBoundary>
                <Suspense fallback={<LoadBox />}>
                    <props.component />
                </Suspense>
            </PageErrorBoundary>
        </div>
    )
}
