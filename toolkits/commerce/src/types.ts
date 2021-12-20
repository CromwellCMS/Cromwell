import { TPaginationProps } from '@cromwell/core-frontend';

export type AdapterType = () => {
    Pagination: React.ComponentType<TPaginationProps>;
}