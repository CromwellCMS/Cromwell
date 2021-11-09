import { TPageExports } from '../types';

export const createGetStaticPaths = (pageName: string, pageExports: TPageExports) => {
    return pageExports?.getStaticPaths;
}
