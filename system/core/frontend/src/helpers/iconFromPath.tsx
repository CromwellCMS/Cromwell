import React from 'react';

export const iconFromPath = (path): React.ComponentType<React.SVGProps<SVGSVGElement>> => {
    return (props: React.SVGProps<SVGSVGElement>) => (
        <svg {...props}
            className={(props?.className ? props.className + ' ' : '') + "crwIcon"}
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >{path}</svg>
    );
}