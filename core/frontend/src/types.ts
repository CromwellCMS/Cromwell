import { CromwellBlockDataType } from '@cromwell/core';

export type TCromwellBlockProps = {
    id: string;
    config?: CromwellBlockDataType;
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
    config?: CromwellBlockDataType;
    children?: React.ReactNode
}