import { ReactElement } from "react";
import React from 'react';
import { DomElement } from "htmlparser2";

const context: Record<string, {
    index: number;
    metaProperties: string[];
}> = {};

export const makeParserContext = (contextName: string) => {
    context[contextName] = {
        index: 0,
        metaProperties: [],
    }
}

export const cleanParseContext = (contextName: string) => {
    delete context[contextName];
}

export const getParserTransform = (contextName: string) => {
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
            if (node.children?.[0]?.data && node.children[0].data !== '')
                return <script key={index} dangerouslySetInnerHTML={{ __html: node.children[0].data }} />
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