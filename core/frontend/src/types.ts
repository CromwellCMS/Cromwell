import { TCromwellBlockData, TCromwellBlockType } from '@cromwell/core';

export type TCromwellBlockProps = {
    id: string;
    type?: TCromwellBlockType;

    /**
     * Component that replaces Blocks's content (blockContent)
     */
    contentComponent?: React.ComponentType<TContentComponentProps>;

    /**
     * Component that wraps Block without virtual blocks around. children prop is block itself.
     */
    wrappingComponent?: React.ComponentType<TContentComponentProps>;
    className?: string;
}

export type TContentComponentProps = {
    id: string;
    config?: TCromwellBlockData;
    children?: React.ReactNode
}