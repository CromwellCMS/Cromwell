import React, { Component } from 'react';
import { CromwellPage } from '@cromwell/core';
import { importIndexPage } from '@cromwell/templates';
import { componentDataFetcher } from '../common/componentDataFetcher';
import dynamic from "next/dynamic";
const config = require('@cromwell/core/cmsconfig.json');
const Index = dynamic(importIndexPage(config.templateName));

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

    const getStaticProps  = (await importIndexPage(config.templateName)).getStaticProps;
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
