import React, { useEffect, useState } from 'react';

import CategoriesPage from '../categoryList/CategoryList';
import styles from './Product.module.scss';

export default function CategoriesTab() {
    return (
        <div className={styles.CategoriesTab}>
            <CategoriesPage
                embeddedView={true}
            />
        </div>
    )
}
