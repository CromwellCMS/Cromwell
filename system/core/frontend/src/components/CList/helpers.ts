import { isServer } from '@cromwell/core';
import queryString from 'query-string';

/** @internal */
export const getPageId = (pageNum: number) => "infinity-page_" + pageNum;

/** @internal */
export const getPageNumsAround = (currentPage: number, quantity: number, maxPageNum: number): number[] => {
    const pages: number[] = [];
    const half = Math.floor(quantity / 2);
    const fromStart = currentPage - half < 1 ? true : false;
    const fromEnd = currentPage + half > maxPageNum ? true : false;
    const startIndex = fromStart ? 1 : fromEnd ? (maxPageNum - quantity) : currentPage - half;
    const endIndex = fromStart ? quantity : fromEnd ? maxPageNum : currentPage + half;
    // console.log('fromStart', fromStart, 'fromEnd', fromEnd, 'startIndex', startIndex, 'endIndex', endIndex)
    for (let i = startIndex; i <= endIndex; i++) {
        const num = i;
        if (num <= maxPageNum)
            pages.push(num)
    }
    return pages;
}

/** @internal */
export const getPagedUrl = (pageNum: number, pathname?: string): string | undefined => {
    if (!isServer()) {
        const parsedUrl = queryString.parseUrl(window.location.href, { parseFragmentIdentifier: true });
        if (pageNum) parsedUrl.query.page = pageNum + '';
        else delete parsedUrl.query.page;
        return queryString.stringifyUrl(parsedUrl, { encode: false });
    }
    else {
        return pathname ? pathname + `?page=${pageNum}` : undefined;
    }
}

/** @internal */
export const getPageNumberFromUrl = (): number => {
    if (!isServer()) {
        const parsedUrl = queryString.parseUrl(window.location.href, { parseFragmentIdentifier: true });
        let pageNumber: any = parsedUrl.query?.page;
        if (pageNumber) {
            pageNumber = parseInt(pageNumber);
            if (pageNumber && !isNaN(pageNumber)) {
                return pageNumber;
            }
        }
    }
    return 1;
}