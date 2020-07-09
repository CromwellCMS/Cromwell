import React from 'react';
import Header from '../header/Header';
// @ts-ignore
import styles from './Layout.module.scss';

type TProps = {
    children: React.ReactNode;
}

export default function Layout(props: TProps) {
    return (
        <div className={styles.Layout}>
            <Header />
            {props.children}
        </div>
    )
}
