import React from 'react';

import Footer from '../footer/Footer';
import Header from '../header/Header';
import styles from './Layout.module.scss';

type TProps = {
    children: React.ReactNode;
}

export default function Layout(props: TProps) {
    return (
        <div className={styles.Layout}>
            <Header />
            {props.children}
            <Footer />
        </div>
    )
}