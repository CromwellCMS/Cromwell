import { CrwDocumentContextType } from '@cromwell/core';
import { getModuleImporter } from '@cromwell/core-frontend/dist/helpers/importer';
import { DocumentContext } from 'next/document';
import React from 'react';

export const CrwDocumentContext = React.createContext<CrwDocumentContextType>({});

export const patchDocument = () => {
    const NextDocument = getModuleImporter()?.modules?.['next/document']?.default;
    const origFetInitialProps = NextDocument.getInitialProps;

    if (!NextDocument || (NextDocument as any).cromwellPatch) return;
    (NextDocument as any).cromwellPatch = true;

    NextDocument.getInitialProps = async (...args) => {
        const ctx: DocumentContext = args[0];
        if (!ctx?.req?.url) return origFetInitialProps(...args);

        const origin = `http://${ctx.req.headers.host}`;
        const fullUrl = (new URL(ctx?.req.url, origin)).toString();

        const originalRenderPage = ctx.renderPage;
        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => (props) => (
                    <CrwDocumentContext.Provider value={{
                        ...ctx,
                        fullUrl,
                        origin,
                    }}>
                        {<App {...props} />}
                    </CrwDocumentContext.Provider>
                ),
            })

        return origFetInitialProps(...args);
    }
}
