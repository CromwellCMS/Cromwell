import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';

import variables from '../../styles/variables.scss';
import Header from '../header/Header';
import styles from './Layout.module.scss';

type TProps = {
    children: React.ReactNode;
}

const theme = createMuiTheme({
    palette: {
        primary: {
            main: variables.primary,
            light: variables.primary,
            dark: variables.primary
        },
    },
});

export default function Layout(props: TProps) {
    return (
        <ThemeProvider theme={theme}>
            <div className={styles.Layout}>
                <Header />
                {props.children}
            </div>
        </ThemeProvider>

    )
}
