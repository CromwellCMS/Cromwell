import React from 'react'
//@ts-ignore
import styles from './CList.module.scss';
import { TProduct, TPagedList, TPagedMeta, isServer, TPagedParams } from '@cromwell/core';
import debounce from 'debounce';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { throbber } from '../throbber';
// import Alertify from 'alertify.js';

const getPageId = (pageNum: number) => "infinity-page_" + pageNum;
const getPageNumsAround = (currentPage: number, quantity: number, maxPageNum: number): number[] => {
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
const getPagedUrl = (pageNum: number, pathname?: string): string | undefined => {
    if (!isServer()) {
        const urlParams = new URLSearchParams(window.location.search);
        if (pageNum) urlParams.set('pageNumber', pageNum + '');
        else urlParams.delete('pageNumber');
        return window.location.pathname + '?' + urlParams.toString();
    }
    else {
        return pathname ? pathname + `?pageNumber=${pageNum}` : undefined;
    }

}

type TCssClasses = {
    scrollBox?: string;
    page?: string;
    pagination?: string;
    paginationLink?: string;
    paginationArrowLink?: string;
    paginationActiveLink?: string;
    paginationDisabledLink?: string;
}
type TElements = {
    arrowLeft?: React.ReactNode;
    arrowRight?: React.ReactNode;
    arrowFirst?: React.ReactNode;
    arrowLast?: React.ReactNode;
    pagination?: React.ComponentType<{
        count: number;
        page: number;
        onChange: (page: number) => void;
    }>;
    showMore?: React.ComponentType<{
        onClick: () => void;
    }>;
    /** Preloader to show during first data request  */
    preloader?: React.ReactNode;
}

export type TCListProps<DataType, ListItemProps> = {
    /** CromwellBlock id */
    id: string;

    /** HTML Class attribute for wrapper container */
    className?: string;

    /** Component that will display items */
    ListItem: React.ComponentType<TItemComponentProps<DataType, ListItemProps>>;

    /** Prop object to pass for each component in a list */
    listItemProps?: ListItemProps;

    /** Array of data to create components for each piece and virtualize. Won't work with "loader" prop */
    dataList?: DataType[];

    /** Loader function that will be called to load more data during scroll
    * Needed if dataList wasn't provided. Doesn't work with dataLst.
    * If returned data is TPagedList, then will use pagination. If returned data is an array, then it won't be called anymore
    */
    loader?: (params: TPagedParams<DataType>) => Promise<TPagedList<DataType> | DataType[] | undefined | null> | undefined | null;

    /** Page size to first use in TPagedParams of "loader". After first batch recieved will use pageSize from pagedMeta if pagedMeta has it */
    pageSize?: number;

    /** First batch / page. Can be used with "loader". Supposed to be used in SSR to prerender page  */
    firstBatch?: TPagedList<DataType>;

    /** Max pages to render at screen. 10 by default */
    maxDomPages?: number;

    /** Label to show when data array is empty. "No data" by default */
    noDataLabel?: string;

    /** Auto load more pages when scroll reached end of start in minRangeToLoad (px) */
    useAutoLoading?: boolean;

    /** Threshold in px where automatically request next or prev page. 200 by default. Use with useAutoLoading */
    minRangeToLoad?: number;

    /** If useAutoLoading disabled can show button to load next page in the same container */
    useShowMoreButton?: boolean;

    /** When useShowMoreButton and usePagination enabled CList needs to know 
     * container that scrolls pages to define current page during scrolling  */
    scrollContainerSelector?: string;

    /** Display pagination */
    usePagination?: boolean;

    /** Disable caching of loaded pages from "loader" prop when open a new page by pagination. Caching is working by default */
    disableCaching?: boolean;

    /** Max number of page links to display. 10 by default */
    paginationButtonsNum?: number;

    /** Parse and set pageNumber in url as query param */
    useQueryPagination?: boolean;

    /** Force to show preloader instead of a list */
    isLoading?: boolean;

    cssClasses?: TCssClasses;

    elements?: TElements;

    /** window.location.pathname for SSR to prerender pagination links */
    pathname?: string;
}

/** Public API of CList instance */
export type TCList<DataType = any, ListItemProps = any> = {
    /** Get React component props. */
    getProps: () => TCListProps<DataType, ListItemProps>;
    /** Replace props. Will use them in any render after instead of React props. Behavior can be reset by setting null */
    setProps: (props: TCListProps<DataType, ListItemProps> | null) => void;
    /** Clear all internal data about pages and cache, set current pageNumber = 1 */
    clearState: () => void;
    /** Re-init component, parse first batch with metainfo, create pagination info */
    init: () => void;
    /** Navigate to specified page */
    openPage: (pageNumber: number) => void;
    /** Get scrollbox wrapper DOM element */
    getScrollboxEl: () => HTMLDivElement | null;
    /** event listeners */
    addListener: (type: TListenerType, cb: () => void) => void;
    /** Set additional params to use in "loader" prop. */
    setPagedParams: (val: TPagedParams<DataType>) => void;
    /** Get currently used params in "loader" prop */
    getPagedParams: () => TPagedParams<DataType>;

}

type TListenerType = 'componentDidUpdate' | 'onRender';

export type TItemComponentProps<DataType, ListItemProps> = {
    data?: DataType;
    listItemProps?: ListItemProps;
}

export class CList<DataType, ListItemProps = {}> extends React.PureComponent<TCListProps<DataType, ListItemProps>> implements TCList<DataType, ListItemProps> {

    private dataList: DataType[][] = [];
    private list: {
        elements: JSX.Element[];
        pageNum: number;
    }[] = [];
    private pagedParams: TPagedParams<DataType> = {
        pageNumber: 1
    };
    private get currentPageNum(): number {
        return this.pagedParams.pageNumber || 1;
    }
    private set currentPageNum(val: number) {
        this.pagedParams.pageNumber = val;
    }
    private get pageSize(): number | undefined {
        return this.pagedParams.pageSize
    }
    private set pageSize(val: number | undefined) {
        this.pagedParams.pageSize = val;
    }
    private minPageBound: number = 1;
    private maxPageBound: number = 1;
    private canLoadMore: boolean = true;
    private remoteRowCount: number = 0;
    private maxPage: number = 1;
    private maxDomPages: number = 10;
    private pageStatuses: ('deffered' | 'loading' | 'fetched' | 'failed')[] = [];
    private isPageLoading: boolean = false;
    private isLoading: boolean = false;
    private scrollBoxRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    private wrapperRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    private throbberRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    private forcedProps: TCListProps<DataType, ListItemProps> | null;
    private listeners: Record<TListenerType, { cb: () => void; id?: string }[]> = { componentDidUpdate: [], onRender: [] };

    constructor(props: TCListProps<DataType, ListItemProps>) {
        super(props);

        this.init();
    }

    public getProps(): TCListProps<DataType, ListItemProps> {
        if (this.forcedProps) return this.forcedProps;
        return this.props;
    }

    public setProps(props: TCListProps<DataType, ListItemProps> | null): void {
        this.forcedProps = props;
    }

    componentDidUpdate(prevProps: TCListProps<DataType, ListItemProps>) {
        const props = this.getProps();
        this.triggerListener('componentDidUpdate');
        if (props.useAutoLoading && this.scrollBoxRef.current && this.wrapperRef.current) {
            this.wrapperRef.current.style.minHeight = this.scrollBoxRef.current.clientHeight - 20 + 'px';
            const lastPage = this.wrapperRef.current.querySelector(`#${getPageId(this.maxPage)}`);
            if (lastPage) {
                const pad = this.scrollBoxRef.current.clientHeight - lastPage.clientHeight + 10;
                if (pad > 0) {
                    this.wrapperRef.current.style.paddingBottom = pad + 'px';
                }
            }
        }
        this.onScroll();
    }

    public addListener(type: TListenerType, cb: () => void, id?: string) {
        let hasListener = false;
        if (id) {
            this.listeners[type].forEach(l => {
                if (l.id === id) hasListener = true;
            })
        }
        if (!hasListener) {
            this.listeners[type].push({ id, cb });
        }
    }

    private triggerListener(type: TListenerType) {
        this.listeners[type].forEach(l => l.cb());
    }

    public init(): void {
        const props = this.getProps();

        if (props.pageSize) this.pageSize = props.pageSize;
        if (props.maxDomPages) this.maxDomPages = props.maxDomPages;
        if (props.dataList) {
            this.parseFirstBatchArray(props.dataList);
        }

        if (!props.dataList && props.loader) {

            if (props.useQueryPagination && !isServer()) {
                const urlParams = new URLSearchParams(window.location.search);
                let pageNumber: any = urlParams.get('pageNumber');
                if (pageNumber) {
                    pageNumber = parseInt(pageNumber);
                    if (pageNumber && !isNaN(pageNumber)) {
                        this.currentPageNum = pageNumber;
                        this.minPageBound = pageNumber;
                        this.maxPageBound = pageNumber;
                    }
                }
            }

            if (props.firstBatch) {
                // Parse firstBatch
                this.parseFirstBatchPaged(props.firstBatch);
            }
            else if (!isServer()) {
                // Load firstBatch
                this.fetchFirstBatch();
            }
        }
    }

    private fetchFirstBatch = async () => {
        const props = this.getProps();
        if (props.loader) {
            this.isLoading = true;
            this.setOverlay(true);
            try {
                const data = await props.loader(this.pagedParams);
                if (data && !Array.isArray(data) && data.elements) {
                    this.parseFirstBatchPaged(data);
                }
                if (data && Array.isArray(data)) {
                    this.parseFirstBatchArray(data);
                }

            } catch (e) {
                console.log(e);
            }
            this.isLoading = false;
            this.setOverlay(false);
            this.forceUpdate();
        }
    }

    private parseFirstBatchPaged = (data: TPagedList<DataType>) => {
        if (data.pagedMeta) {
            this.remoteRowCount = (data.pagedMeta.totalElements) ? data.pagedMeta.totalElements : 0;
            this.pageSize = data.pagedMeta.pageSize;

        }
        if (this.pageSize) {
            this.maxPage = Math.ceil(this.remoteRowCount / this.pageSize);
            for (let i = 1; i <= this.maxPage; i++) {
                this.pageStatuses[i] = 'deffered';
            }
        }
        this.pageStatuses[this.currentPageNum] = 'fetched';

        if (data.elements) {
            this.addElementsToList(data.elements, this.currentPageNum);
        }
    }

    private parseFirstBatchArray = (data: DataType[]) => {
        this.canLoadMore = false;
        this.remoteRowCount = data.length;
        this.addElementsToList(data, this.currentPageNum);
    }


    private addElementsToList(data: DataType[], pageNum: number) {
        this.dataList[pageNum] = data;
        this.updateList();
    }


    private onScroll = debounce(() => {
        const props = this.getProps();
        if (props.useAutoLoading) {
            const minRangeToLoad = props.minRangeToLoad ? props.minRangeToLoad : 200;
            if (this.scrollBoxRef.current && this.wrapperRef.current) {
                const scrollTop = this.scrollBoxRef.current.scrollTop;
                const scrollBottom = this.wrapperRef.current.clientHeight - this.scrollBoxRef.current.clientHeight - scrollTop;

                // Rendered last row from data list, but has more pages to load from server
                if (scrollBottom < minRangeToLoad) {
                    if (this.maxPage > this.maxPageBound) {
                        // console.log('onScroll: need to load next page', this.maxPageBound);
                        if (!this.isPageLoading) {
                            this.loadNextPage();
                            return;
                        }
                    }
                }

                // Rendered first element but has more pages to load previously from server
                // console.log('scrollTop', scrollTop, 'scrollBottom', scrollBottom)
                if (this.minPageBound > 1) {
                    if (scrollTop === 0) this.scrollBoxRef.current.scrollTop = 10;
                    if (scrollTop < minRangeToLoad) {
                        // console.log('onScroll: need to load prev page', this.minPageBound);
                        if (!this.isPageLoading) {
                            this.loadPreviousPage();
                        }
                    }
                }
            }
        }
    }, 50)

    public clearState = () => {
        const props = this.getProps();
        this.currentPageNum = 1;
        this.minPageBound = 1;
        this.maxPageBound = 1;
        if (props.useQueryPagination) {
            window.history.pushState({}, '', getPagedUrl(1));
        }
        this.dataList = [];
        this.list = [];
        this.pageStatuses = [];
    }

    public onPageScrolled = (pageNumber: number) => {
        const props = this.getProps();
        this.currentPageNum = pageNumber;
        if (props.useQueryPagination) {
            window.history.pushState({}, '', getPagedUrl(pageNumber));
        }
    }


    public openPage = async (pageNumber: number) => {
        const props = this.getProps();
        if (this.currentPageNum !== pageNumber) {
            this.onPageScrolled(pageNumber)
            if (props.disableCaching) {
                this.dataList = [];
                this.pageStatuses = this.pageStatuses.map(s =>
                    s === 'fetched' || s === 'failed' ? 'deffered' : s)
            }

            this.minPageBound = pageNumber;
            this.maxPageBound = pageNumber;
            await this.loadPage(pageNumber);
            this.forceUpdate(() => {
                // if (props.useAutoLoading) {
                setTimeout(() => {
                    if (this.wrapperRef.current) {
                        const id = `#${getPageId(pageNumber)}`;
                        const elem = this.wrapperRef.current.querySelector(id);
                        if (elem) elem.scrollIntoView();
                    }
                }, 10)
                // }
            });
        }

    }

    private updateList = () => {
        const props = this.getProps();
        const ListItem = props.ListItem;
        this.list = [];

        if (!props.useShowMoreButton) {
            const maxDomPages = this.maxDomPages;
            const pageBounds = getPageNumsAround(this.currentPageNum, maxDomPages, this.maxPage);
            // const minPageBound = (this.minPageBound < pageBounds[0]) ? pageBounds[0] : this.minPageBound;
            if (this.minPageBound < pageBounds[0]) this.minPageBound = pageBounds[0];
            // const maxPageBound = (this.maxPageBound > pageBounds[pageBounds.length]) ? pageBounds[pageBounds.length] : this.maxPageBound;
            if (this.maxPageBound > pageBounds[pageBounds.length - 1]) this.maxPageBound = pageBounds[pageBounds.length - 1];

        }

        for (let i = this.minPageBound; i <= this.maxPageBound; i++) {
            const pageData = this.dataList[i];
            if (pageData) {
                const pageItems: JSX.Element[] = [];
                for (let j = 0; j < pageData.length; j++) {
                    const data = pageData[j];
                    pageItems.push(<ListItem data={data} listItemProps={props.listItemProps} key={j} />);
                }
                this.list.push({
                    elements: pageItems,
                    pageNum: i
                })
            }
        }
    }

    private async loadData(pageNum: number) {
        const props = this.getProps();
        if (props.loader) {
            // console.log('loadData pageNum:', pageNum);
            this.pageStatuses[pageNum] = 'loading';
            this.isPageLoading = true;
            this.setOverlay(true);
            try {
                const pagedData = await props.loader(Object.assign({}, this.pagedParams,
                    { pageNumber: pageNum }));
                if (pagedData && !Array.isArray(pagedData) && pagedData.elements) {
                    this.addElementsToList(pagedData.elements, pageNum);
                    this.pageStatuses[pageNum] = 'fetched';
                    this.isPageLoading = false;
                }
            } catch (e) {
                console.log(e);
                this.pageStatuses[pageNum] = 'failed';
            }
            this.isPageLoading = false;
            this.setOverlay(false);
        }
    }

    private loadPage = async (pageNum: number): Promise<boolean> => {
        let hasLoaded = false;
        switch (this.pageStatuses[pageNum]) {
            case 'fetched': {
                break;
            }
            case 'loading': {
                break;
            }
            case 'deffered': {
                await this.loadData(pageNum);
                hasLoaded = true;
                break;
            }
        }
        this.updateList();
        return hasLoaded;
    }

    public setOverlay = (isLoading: boolean) => {
        const props = this.getProps();
        if (this.throbberRef.current) {
            if (isLoading) {
                this.throbberRef.current.style.display = 'block';
                setTimeout(() => {
                    if (this.throbberRef.current) {
                        const bounds = this.throbberRef.current.getBoundingClientRect();
                        const throbberEl = this.throbberRef.current.querySelector(`.${styles.throbber}`) as HTMLDivElement | null;
                        if (throbberEl) {
                            throbberEl.style.left = (bounds.left + bounds.width / 2 - throbberEl.offsetWidth / 2) + 'px';
                        }
                    }
                }, 10);
            } else {
                this.throbberRef.current.style.display = 'none';
            }
        }

    }

    private loadNextPage = async () => {
        const props = this.getProps();

        if (this.maxPageBound < this.maxPage && this.maxPageBound + 1 < this.currentPageNum + this.maxDomPages) {
            this.maxPageBound++;
            const nextNum = this.maxPageBound;
            // console.log('loadNextPage', nextNum, this.pageStatuses[nextNum])

            await this.loadPage(nextNum);
            this.forceUpdate();
        }

    }

    private loadPreviousPage = async () => {
        if (this.minPageBound > 1 && this.minPageBound + 1 > this.currentPageNum - this.maxDomPages) {
            this.minPageBound--;
            const prevNum = this.minPageBound;
            // console.log('loadPreviousPage', prevNum, this.pageStatuses[prevNum]);
            await this.loadPage(prevNum);
            this.forceUpdate();
        }
    }

    public getScrollboxEl = () => {
        return this.scrollBoxRef.current;
    }

    private wrapContent = (content: JSX.Element): JSX.Element => {
        const props = this.getProps();
        return (
            <CromwellBlock id={props.id} type='list'
                className={props.className}
                content={(data, blockRef, setContentInstance) => {
                    setContentInstance(this);
                    return (
                        <div className={styles.CList}>
                            <div ref={this.throbberRef} className={styles.listOverlay}>
                                {props.elements?.preloader ? props.elements?.preloader :
                                    <div className={styles.throbber}
                                        dangerouslySetInnerHTML={{ __html: throbber }}></div>}
                            </div>
                            {content}
                        </div>
                    );
                }}
            />
        )
    }

    public getPagedParams = () => this.pagedParams;
    public setPagedParams = (val: TPagedParams<DataType>) => this.pagedParams = val;

    render() {
        const props = this.getProps();
        this.triggerListener('onRender');
        let content;
        if (this.isLoading || props.isLoading) {
            return this.wrapContent(content);
        }

        if (props.dataList) {
            this.currentPageNum = 1;
            this.minPageBound = 1;
            this.maxPageBound = 1;
            this.maxPage = 1;
            this.dataList = [];
            this.addElementsToList(props.dataList, 1);
        }
        // console.log('BaseInfiniteLoader::render', this.minPageBound, this.maxPageBound, this.list)

        if (this.list.length === 0) {
            content = (
                <h3>{props.noDataLabel ? props.noDataLabel : 'No data'}</h3>
            );
            return this.wrapContent(content);
        }
        const handleShowMoreClick = () => {
            if (this.maxPage > this.maxPageBound) {
                if (!this.isPageLoading) {
                    this.loadNextPage();
                    this.forceUpdate();
                }
            }
        }

        content = (
            <>
                <div className={`${styles.scrollBox} ${props.cssClasses?.scrollBox || ''}`}
                    ref={this.scrollBoxRef}
                    onScroll={this.onScroll}
                    style={props.useAutoLoading ?
                        { height: '100%', overflow: 'auto' } : {}}
                >
                    <div className={styles.wrapper} ref={this.wrapperRef}>
                        {this.list.map(l => (
                            <div className={`${styles.page} ${props.cssClasses?.page || ''}`}
                                key={l.pageNum}
                                id={getPageId(l.pageNum)}>
                                {l.elements.map((e, i) => (
                                    e
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {props.useShowMoreButton && !this.isPageLoading && this.maxPage > this.maxPageBound && (
                    <div className={styles.showMoreBtnContainer}>
                        {props.elements?.showMore ? (
                            <props.elements.showMore onClick={handleShowMoreClick} />
                        ) : (
                                <div
                                    className={styles.showMoreBtn}
                                    onClick={handleShowMoreClick}
                                >Show more</div>
                            )}

                    </div>
                )}
                {props.usePagination && (
                    <Pagination
                        pageNums={this.list.map(p => p.pageNum)}
                        wrapperRef={this.wrapperRef}
                        scrollBoxRef={this.scrollBoxRef}
                        inititalPage={this.currentPageNum}
                        maxPageNum={this.maxPage}
                        openPage={this.openPage}
                        onPageScrolled={this.onPageScrolled}
                        paginationButtonsNum={props.paginationButtonsNum}
                        cssClasses={props.cssClasses}
                        elements={props.elements}
                        pathname={props.pathname}
                        scrollContainerSelector={props.scrollContainerSelector}
                    />
                )}
            </>
        );
        return this.wrapContent(content);
    }

}


class Pagination extends React.Component<{
    wrapperRef: React.RefObject<HTMLDivElement>;
    scrollBoxRef: React.RefObject<HTMLDivElement>;
    pageNums: number[];
    maxPageNum: number;
    inititalPage: number;
    paginationButtonsNum?: number;
    openPage: (pageNum: number) => void;
    onPageScrolled: (currentPage: number) => void;
    cssClasses?: TCssClasses;
    elements?: TElements;
    pathname?: string;
    scrollContainerSelector?: string;
}> {
    private currentPage: number = this.props.inititalPage;

    componentDidMount() {
        const props = this.props;

        if (props.scrollContainerSelector) {
            const container = document.querySelector(props.scrollContainerSelector);
            if (container) {
                container.addEventListener('scroll', this.onScroll)
            }
        } else if (props.scrollBoxRef.current) {
            props.scrollBoxRef.current.addEventListener('scroll', this.onScroll)
        }
    }

    componentDidUpdate() {
        this.onScroll();
    }

    private onScroll = () => {
        const props = this.props;

        // Get current page
        let currPage = 0;
        props.pageNums.forEach(p => {
            const id = getPageId(p);
            if (props.wrapperRef.current) {
                const pageNode = props.wrapperRef.current.querySelector('#' + id);
                if (pageNode) {
                    const bounds = pageNode.getBoundingClientRect();
                    if (!currPage && bounds.bottom > 0) currPage = p;
                }
            }
        });
        if (currPage && this.currentPage !== currPage) {
            // console.log('currPage', currPage)
            this.currentPage = currPage;
            props.onPageScrolled(currPage);
            this.forceUpdate();
        }
    }
    render() {
        const props = this.props;

        const currPage = this.currentPage;
        const CustomPagination = props.elements?.pagination
        if (CustomPagination) {
            return (
                <CustomPagination
                    page={currPage}
                    count={props.maxPageNum}
                    onChange={(pageNum: number) => {
                        this.currentPage = pageNum;
                        props.openPage(pageNum);
                    }}
                />
            )
        }

        const paginationDisabledLinkClass = styles.paginationDisabledLink + ' ' + (props.cssClasses?.paginationDisabledLink || '')
        const paginationButtonsNum = props.paginationButtonsNum ? props.paginationButtonsNum : 10;
        const pages = getPageNumsAround(currPage, paginationButtonsNum, props.maxPageNum);
        const links: JSX.Element[] = [
            <a href={getPagedUrl(1, props.pathname)}
                className={`${styles.pageLink}  ${props.cssClasses?.paginationArrowLink || ''} ${currPage === 1 ? paginationDisabledLinkClass : ''}`}
                key={'first'}
                onClick={(e) => {
                    e.preventDefault();
                    this.currentPage = 1;
                    props.openPage(1);
                }}>
                {props.elements?.arrowFirst ? props.elements?.arrowFirst : (
                    <p className={styles.paginationArrow}>⇤</p>
                )}
            </a>,
            <a href={currPage > 1 ? getPagedUrl(currPage - 1, props.pathname) : undefined}
                className={`${styles.pageLink}  ${props.cssClasses?.paginationArrowLink || ''} ${currPage === 1 ? paginationDisabledLinkClass : ''}`}
                key={'back'}
                onClick={(e) => {
                    e.preventDefault();
                    if (currPage > 1) {
                        this.currentPage = currPage - 1;
                        props.openPage(currPage - 1);
                    }
                }}>
                {props.elements?.arrowLeft ? props.elements?.arrowLeft : (
                    <p className={styles.paginationArrow}>￩</p>
                )}
            </a>,
            ...pages.map(p => (
                <a href={p === currPage ? undefined : getPagedUrl(p, props.pathname)}
                    className={`${styles.pageLink} ${p === currPage ? `${styles.activePageLink} ${props.cssClasses?.paginationActiveLink || ''}` : ''} ${props.cssClasses?.paginationLink || ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        this.currentPage = p;
                        props.openPage(p);
                    }}
                    key={p}>{p}</a>
            )),
            <a href={currPage < props.maxPageNum ? getPagedUrl(currPage + 1) : undefined}
                className={`${styles.pageLink}  ${props.cssClasses?.paginationArrowLink || ''} ${currPage === props.maxPageNum ? paginationDisabledLinkClass : ''}`}
                key={'next'}
                onClick={(e) => {
                    e.preventDefault();
                    if (currPage < props.maxPageNum) {
                        this.currentPage = currPage + 1;
                        props.openPage(currPage + 1);
                    }
                }}>
                {props.elements?.arrowRight ? props.elements?.arrowRight : (
                    <p className={styles.paginationArrow}>￫</p>
                )}
            </a>,
            <a href={getPagedUrl(props.maxPageNum, props.pathname)}
                className={`${styles.pageLink}  ${props.cssClasses?.paginationArrowLink || ''} ${currPage === props.maxPageNum ? paginationDisabledLinkClass : ''}`}
                key={'last'}
                onClick={(e) => {
                    e.preventDefault();
                    this.currentPage = props.maxPageNum;
                    props.openPage(props.maxPageNum);
                }}>
                {props.elements?.arrowLast ? props.elements?.arrowLast : (
                    <p className={styles.paginationArrow}>⇥</p>
                )}
            </a>
        ]
        return (
            <div className={styles.pagination}>
                <div className={`${styles.paginationContent} ${props.cssClasses?.pagination || ''}`}>
                    {...links}
                </div>
            </div>
        )
    }
}