import { TCmsSettings } from '@cromwell/core';
import { ServerStyleSheets } from '@mui/styles';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

export default class MyDocument extends Document {

    static async getInitialProps(ctx: DocumentContext) {

        const sheet = new ServerStyleSheets();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        sheet.collect(<App {...props} />),
                })

            const initialProps = await Document.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: [
                    ...React.Children.toArray(initialProps.styles),
                    sheet.getStyleElement()
                ],
            }
        } finally { }
    }

    render() {
        const cmsSettings: TCmsSettings = this.props.__NEXT_DATA__.props?.pageProps?.cmsSettings;
        return (
            <Html lang={cmsSettings?.language ?? 'en'}>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
