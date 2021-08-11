import React from 'react';
import { Transform } from 'react-html-parser';

let index = 0;
export const parserTransform: Transform = (node) => {
    index++;
    if (node.type === 'script') {
        if (node.children?.[0]?.data && node.children[0].data !== '')
            return <script key={index} dangerouslySetInnerHTML={{ __html: node.children[0].data }} />
    }
    if (node.type === 'style') {
        if (node.children?.[0]?.data && node.children[0].data !== '')
            return <style key={index} type="text/css" dangerouslySetInnerHTML={{ __html: node.children[0].data }} />
    }
}
