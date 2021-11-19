export const defaultGenericPageContent = `
import React from 'react';

const GenericPage = () => {
    return (
        <div></div>
    );
}

export default GenericPage;

export const getStaticProps = async (context) => {
    if (!context.pageConfig?.id || !context.pageConfig.route) return {
        notFound: true,
    }
    return {
        props: {}
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking',
    };
}
`;
