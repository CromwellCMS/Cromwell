import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import React from 'react';

import Footer from '../footer/Footer';
import Header from '../header/Header';
import styles from './Layout.module.scss';

type TProps = {
    children: React.ReactNode;
}
const primaryColor = "#9900CC";

const theme = createTheme({
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
                <Footer />
            </div>
        </ThemeProvider>

    )
}
