import { ReactElement } from "react";
import React from 'react';
import { DomElement } from "htmlparser2";

const context: Record<string, {
    index: number;
    metaProperties: string[];
}> = {};

const ScriptTag = (props: {
    content?: string;
    src?: string;
    key: string | number;
}) => {
    let scriptTag: HTMLScriptElement;

    React.useLayoutEffect(() => {
        scriptTag = document.createElement('script');
        scriptTag.type = 'text/javascript';

        if (props.content) scriptTag.text = props.content;
        if (props.src) scriptTag.src = props.src;

        document.body.appendChild(scriptTag);
    });

    React.useEffect(() => {
        return () => {
            scriptTag?.remove();
        }
    }, []);
    return <></>;
}

export const makeParserContext = (contextName: string) => {
    context[contextName] = {
        index: 0,
        metaProperties: [],
    }
}

export const cleanParseContext = (contextName: string) => {
    delete context[contextName];
}

export const getParserTransform = (contextName: string, options?: {
    /** Since usually React does not execute content of <script> tag, we'll use ScriptTag component above
     * for usage in body. But for the head we usually use Next.js Head component
     * that executes scripts for us and we don't need to use ScriptTag with it.
     * In fact, Next.js Head will even crash with ScriptTag.
     */
    executeScripts?: boolean;
}) => {
    makeParserContext(contextName);

    return (node: DomElement): ReactElement | void | null => {
        if (context[contextName]) {
            context[contextName].index++;

            if (node.type === 'tag' && node.name === 'meta' && node.attribs?.property) {
                if (context[contextName].metaProperties.includes(node.attribs.property)) {
                    return null;
                } else {
                    context[contextName].metaProperties.push(node.attribs.property);
                }
            }
        }
        const index = context[contextName]?.index;

        if (node.type === 'script') {
            if (options?.executeScripts) {
                if (node.attribs?.src && node.attribs.src !== '') {
                    return <ScriptTag key={index} src={node.attribs.src} />
                }
                if (node.children?.[0]?.data && node.children[0].data !== '')
                    return <ScriptTag key={index} content={node.children[0].data} />

            } else {
                if (node.attribs?.src && node.attribs.src !== '')
                    return <script key={index + '_script'} src={node.attribs.src}></script>;

                if (node.children?.[0]?.data && node.children[0].data !== '')
                    return <script key={index + '_script'}>{node.children[0].data}</script>;
            }
        }
        if (node.type === 'style') {
            if (node.children?.[0]?.data && node.children[0].data !== '')
                return <style key={index} type="text/css" dangerouslySetInnerHTML={{ __html: node.children[0].data }} />
        }
        if (node.type === 'tag' && node.name === 'link' && node.attribs?.href) {
            return <React.Fragment key={index}><link {...node.attribs} rel={node.attribs?.rel} href={node.attribs?.href} /></React.Fragment>
        }
    }
}