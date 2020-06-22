import React, { Suspense } from 'react';
import PageErrorBoundary from '../errorBoundaries/PageErrorBoundary';
import './page.scss';

export default function Page(props: { component: React.ComponentType }) {
    return (
        <div className="Page">
            Page
            <PageErrorBoundary>
                <Suspense fallback={<div>Loading...</div>}>
                    <props.component />
                </Suspense>
            </PageErrorBoundary>
        </div>
    )
}
