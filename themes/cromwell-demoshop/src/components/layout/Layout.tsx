import React from 'react';
import Header from '../header/Header';
import {
    createMuiTheme,
    ThemeProvider,
} from '@material-ui/core/styles';
// @ts-ignore
import styles from './Layout.module.scss';
// @ts-ignore
import variables from '../../styles/variables.scss';

type TProps = {
    children: React.ReactNode;
}
console.log('variables.primary', variables.primary);

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
