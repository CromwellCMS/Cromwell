import { ServerStyleSheets } from '@material-ui/core';
import { DocumentContext } from 'next/document';
import NextDocument from 'next/document';
import React from 'react';

export default class MyDocument extends NextDocument {

    static async getInitialProps(ctx: DocumentContext) {

        const sheet = new ServerStyleSheets();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        sheet.collect(<App {...props} />),
                })

            const initialProps = await NextDocument.getInitialProps(ctx);

            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            }
        } finally { }
    }

}
