import { getRandStr, isServer } from '@cromwell/core';
import { Element } from 'domhandler';
import { ReactElement } from 'react';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';

const context: Record<string, {
    randId: string;
    index: number;
    metaProperties: string[];
}> = {};

const ScriptTag = (props: {
    content?: string;
    src?: string;
    key: string | number;
}) => {
    let scriptTag: HTMLScriptElement;

    if (!isServer()) {
        React.useLayoutEffect(() => {
            scriptTag = document.createElement('script');
            scriptTag.type = 'text/javascript';

            if (props.content) scriptTag.text = props.content;
            if (props.src) scriptTag.src = props.src;

            document.body.appendChild(scriptTag);
        });
    }

    React.useEffect(() => {
        return () => {
            scriptTag?.remove();
        }
    }, []);
    return <></>;
}

export const makeParserContext = (contextName: string) => {
    context[contextName] = {
        randId: getRandStr(8),
        index: 0,
        metaProperties: [],
    }
}

export const cleanParseContext = (contextName: string) => {
    delete context[contextName];
}

type TParserTransformOptions = {
    /** Since usually React does not execute content of `script` tag, we'll use ScriptTag component above
      * for usage in body. But for the head we usually use Next.js Head component
      * that executes scripts for us and we don't need to use ScriptTag with it.
      * In fact, Next.js Head will even crash with ScriptTag.
      */
    executeScripts?: boolean;
}

export const getParserTransform = (contextName: string, options?: TParserTransformOptions) => {
    makeParserContext(contextName);

    return (node: Element): ReactElement | void | null => {
        context[contextName].index++;
        const key = context[contextName].randId + '_' + context[contextName].index;

        if (node.type === 'tag' && node.name === 'meta' && node.attribs?.property) {
            if (context[contextName].metaProperties.includes(node.attribs.property)) {
                return null;
            } else {
                context[contextName].metaProperties.push(node.attribs.property);
            }
        }
        const childContent = (node.children?.[0] as any)?.data;

        if (node.type === 'script') {
            if (options?.executeScripts) {
                if (node.attribs?.src) {
                    return <ScriptTag key={key} src={node.attribs.src} />
                }
                if (childContent)
                    return <ScriptTag key={key} content={childContent} />

            } else {
                if (node.attribs?.src)
                    return <script key={key + '_script'} src={node.attribs.src}></script>;

                if (childContent)
                    return <script key={key + '_script'}>{childContent}</script>;
            }
        }
        if (node.type === 'style') {
            if (childContent)
                return <style key={key} type="text/css" dangerouslySetInnerHTML={{ __html: childContent }} />
        }
        if (node.type === 'tag' && node.name === 'link' && node.attribs?.href) {
            return <link {...node.attribs} rel={node.attribs?.rel} href={node.attribs?.href} key={key} />
        }
    }
}

export const parseHtml = (html: string, options?: TParserTransformOptions): React.ReactElement[] => {
    const contextId = getRandStr(8);
    const parserTransform = getParserTransform(contextId, options);
    const result = ReactHtmlParser(html, { transform: parserTransform });
    cleanParseContext(contextId);
    return result;
}