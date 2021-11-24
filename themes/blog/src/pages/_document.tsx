import { TCmsSettings, TPageCmsProps } from '@cromwell/core';
import createEmotionServer from '@emotion/server/create-instance';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

import { createEmotionCache } from '../helpers/createEmotionCache';
import { getTheme } from '../helpers/theme';

export default class BlogDocument extends Document {

    static async getInitialProps(ctx: DocumentContext) {
        const originalRenderPage = ctx.renderPage;
        const cache = createEmotionCache();
        const { extractCriticalToChunks } = createEmotionServer(cache);
        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App: any) => (props) => <App emotionCache={cache} {...props} />,
            })

        const initialProps = await Document.getInitialProps(ctx);
        // This is important. It prevents emotion to render invalid HTML.
        // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
        const emotionStyles = extractCriticalToChunks(initialProps.html);
        const emotionStyleTags = emotionStyles.styles.map((style) => (
            <style
                data-emotion={`${style.key} ${style.ids.join(' ')}`}
                key={style.key}
                dangerouslySetInnerHTML={{ __html: style.css }}
            />
        ));

        return {
            ...initialProps,
            // Styles fragment is rendered after the app and page rendering finish.
            styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags],
        }
    }


    render() {
        const pageProps: TPageCmsProps | undefined = this.props.__NEXT_DATA__.props?.pageProps?.cmsProps;
        const theme = getTheme(pageProps?.palette);
        const cmsSettings: TCmsSettings = this.props.__NEXT_DATA__.props?.pageProps?.cmsSettings;
        return (
            <Html lang={cmsSettings?.language ?? 'en'}>
                <Head>
                    <meta name="theme-color" content={theme.palette.primary.main} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }

}
