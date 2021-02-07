import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';

import Header from '../header/Header';
import styles from './Layout.module.scss';

type TProps = {
    children: React.ReactNode;
}
const primaryColor = "#9900CC";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: primaryColor,
            light: primaryColor,
            dark: primaryColor
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
