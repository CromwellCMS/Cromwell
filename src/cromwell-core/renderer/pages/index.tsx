import React, { Component } from 'react';
import { NextPage } from 'next'
import { CromwellPage } from '../types';
import { componentDataFetcher } from '../core/componentDataFetcher';
import { BaseComponent } from '../components/BaseComponent';
import dynamic from "next/dynamic";
const config = require('../../cmsconfig.json');
const Index = dynamic(import(`../../../templates/${config.templateName}/src/pages/index`));

const IndexCore: CromwellPage<Props> = (props) => {
    console.log('Index props', props);
    return (
        <main>
            <p>Your user agent: {props.userAgent}</p>
            <Index {...props} />

        </main>
    )
}

export const getStaticProps = async (context) => {
    const pid = (context && context.query) ? context.query.pid : '';
    const userAgent = context.req ? context.req.headers['user-agent'] : '';
    const componentsData = await componentDataFetcher("index", context);

    const { getStaticProps } = await import(`../../../templates/${config.templateName}/src/pages/index`);
    const initialProps = getStaticProps ? await getStaticProps() : {};
    return {
        props: {
            userAgent,
            pid: !Array.isArray(pid) ? pid : undefined,
            componentsData: componentsData,
            ...initialProps
        }
    }
}

interface Props {
    userAgent?: string;
    pid?: string;
}


export default IndexCore;
