import { Document, DocumentContext } from '@cromwell/core-frontend';
import { ServerStyleSheets } from '@material-ui/core';
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
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            }
        } finally {
        }
    }

}
