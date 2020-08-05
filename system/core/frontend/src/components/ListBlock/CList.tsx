import React from 'react'
//@ts-ignore
import styles from './CList.module.scss';
import { TProduct, TPagedList, TPagedMeta } from '@cromwell/core';
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

type TProps<DataType, ListItemProps> = {
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
    loader?: (pageNum: number) => Promise<TPagedList<DataType>> | Promise<DataType[]> | undefined;

    /** Max pages to render at screen. 10 by default */
    maxDomPages?: number;

    /** Label to show when data array is empty. "No data" by default */
    noDataLabel?: string;

    /** Auto load more pages when scroll reached end of start in minRangeToLoad (px) */
    useAutoLoading?: boolean;

    /** Threshold in px where automatically request next or prev page. 200 by default. Use with useAutoLoading */
    minRangeToLoad?: number;

    /** Display pagination panel */
    usePagination?: boolean;

    /** Parse and set pageNumber in url as query param */
    useQueryPagination?: boolean;

    /** Preloader to show during first data request  */
    preloader?: React.ReactNode;

    /** Force to show preloader instead of a list */
    isLoading?: boolean;
}
type TState = {
    isLoading: boolean;
}

export type TItemComponentProps<DataType, ListItemProps> = {
    data?: DataType;
    isLoading?: boolean;
    listItemProps?: ListItemProps;
}

export class CList<DataType, ListItemProps = {}> extends React.PureComponent<TProps<DataType, ListItemProps>, TState> {

    private dataList: DataType[][] = [];
    private list: {
        elements: JSX.Element[];
        pageNum: number;
    }[] = [];
    private currentPageNum: number = 1;
    private minPageBound: number = 1;
    private maxPageBound: number = 1;
    private canLoadMore: boolean = true;
    private remoteRowCount: number = 0;
    private pageSize?: number;
    private maxPage: number = 1;
    private pageStatuses: ('deffered' | 'loading' | 'fetched' | 'failed')[] = [];
    private isPageLoading: boolean = false;

    private scrollBoxRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    private wrapperRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

    constructor(props: TProps<DataType, ListItemProps>) {
        super(props);

        this.state = {
            isLoading: false
        };
    }

    componentDidMount() {
        this.getMetaInfo();
    }

    private async getMetaInfo() {
        if (this.props.loader) {
            this.setState({ isLoading: true });

            if (this.props.useQueryPagination) {
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

            try {
                const pagedData = await this.props.loader(this.currentPageNum);
                if (pagedData) {
                    if (!Array.isArray(pagedData) && pagedData.elements && pagedData.pagedMeta) {
                        this.remoteRowCount = pagedData.pagedMeta.totalElements ? pagedData.pagedMeta.totalElements : 0;
                        this.pageSize = pagedData.pagedMeta.pageSize;
                        if (this.pageSize) {
                            this.maxPage = Math.ceil(this.remoteRowCount / this.pageSize);
                            for (let i = 1; i <= this.maxPage; i++) {
                                this.pageStatuses[i] = 'deffered';
                            }
                        }
                        this.pageStatuses[this.currentPageNum] = 'fetched';
                        this.addElementsToList(pagedData.elements, this.currentPageNum);

                    }
                    if (Array.isArray(pagedData)) {
                        this.canLoadMore = false;
                        this.remoteRowCount = pagedData.length;
                        this.addElementsToList(pagedData, this.currentPageNum);
                    }

                }
            } catch (e) {
                console.log(e);
            }
            this.setState({
                isLoading: false
            });
        }
        else if (this.props.dataList) {
            this.remoteRowCount = this.props.dataList.length;
            this.canLoadMore = false;
            this.forceUpdate();
        }
    }

    private addElementsToList(data: DataType[], pageNum: number) {
        this.dataList[pageNum] = data;
        this.updateList();
        // console.log('addElementsToList', this.dataList);
    }


    componentDidUpdate(prevProps: TProps<DataType, ListItemProps>, prevState: TState) {

        if (this.props.useAutoLoading && this.scrollBoxRef.current && this.wrapperRef.current) {
            this.wrapperRef.current.style.minHeight = this.scrollBoxRef.current.clientHeight - 20 + 'px';
        };

        this.onScroll();


        (window as any).loadPreviousPage = this.onScroll;
    }

    private onScroll = () => {
        if (this.props.useAutoLoading) {
            const minRangeToLoad = this.props.minRangeToLoad ? this.props.minRangeToLoad : 200;
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
    }

    public onPageScrolled = (currentPage: number) => {
        this.currentPageNum = currentPage;
        if (this.props.useQueryPagination) {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('pageNumber', currentPage + '');
            const newUrl = window.location.origin + window.location.pathname + '?' + urlParams.toString();
            console.log('newUrl', newUrl)
            window.history.pushState({}, '', newUrl);
        }
    }


    public openPage = async (pageNumber: number) => {
        this.onPageScrolled(pageNumber)
        // get data bounds
        // for (let i = pageNumber; i > 1; i--) {
        //     if (this.dataList[i]) this.minPageBound = i;
        //     else break;
        // }
        // for (let i = pageNumber; i <= this.maxPage; i++) {
        //     if (this.dataList[i]) this.maxPageBound = i;
        //     else break;
        // }
        this.minPageBound = pageNumber;
        this.maxPageBound = pageNumber;
        await this.loadPage(pageNumber);
        this.forceUpdate(() => {
            setTimeout(() => {
                if (this.wrapperRef.current) {
                    const id = `#${getPageId(pageNumber)}`;
                    const elem = this.wrapperRef.current.querySelector(id);
                    if (elem) elem.scrollIntoView();
                }
            }, 10)

            // this.onScroll();
        });
    }

    private updateList = () => {
        const ListItem = this.props.ListItem;
        this.list = [];
        const maxDomPages = this.props.maxDomPages ? this.props.maxDomPages : 10;
        const pageBounds = getPageNumsAround(this.currentPageNum, maxDomPages, this.maxPage);
        // const minPageBound = (this.minPageBound < pageBounds[0]) ? pageBounds[0] : this.minPageBound;
        if (this.minPageBound < pageBounds[0]) this.minPageBound = pageBounds[0];
        // const maxPageBound = (this.maxPageBound > pageBounds[pageBounds.length]) ? pageBounds[pageBounds.length] : this.maxPageBound;
        if (this.maxPageBound > pageBounds[pageBounds.length - 1]) this.maxPageBound = pageBounds[pageBounds.length - 1];

        for (let i = this.minPageBound; i <= this.maxPageBound; i++) {
            // if (i > pageBounds[0] && i < pageBounds[pageBounds.length - 1]) {
            const pageData = this.dataList[i];
            if (pageData) {
                const pageItems: JSX.Element[] = [];
                for (let j = 0; j < pageData.length; j++) {
                    const data = pageData[j];
                    pageItems.push(<ListItem data={data} listItemProps={this.props.listItemProps} key={j} />);
                }
                this.list.push({
                    elements: pageItems,
                    pageNum: i
                })
            }
            // }

        }
    }

    render() {
        if (this.state.isLoading || this.props.isLoading) {
            return (
                <div className={styles.baseInfiniteLoader}>
                    {this.props.preloader}
                </div>

            )
        }

        if (this.props.dataList) {
            this.currentPageNum = 1;
            this.minPageBound = 1;
            this.maxPageBound = 1;
            this.maxPage = 1;
            this.dataList = [];
            this.addElementsToList(this.props.dataList, 1);
        }
        // console.log('BaseInfiniteLoader::render', this.minPageBound, this.maxPageBound, this.list)

        if (this.list.length === 0) {
            return (
                <div className={styles.baseInfiniteLoader}>
                    <h3>{this.props.noDataLabel ? this.props.noDataLabel : 'No data'}</h3>
                </div>
            )
        }

        return (
            <div className={styles.baseInfiniteLoader}>
                <div className={styles.scrollBox}
                    ref={this.scrollBoxRef}
                    onScroll={this.onScroll}
                    style={this.props.useAutoLoading ?
                        { height: '100%', overflow: 'auto' } : {}}
                >
                    <div className={styles.wrapper} ref={this.wrapperRef}>
                        {this.list.map(l => (
                            <div className={styles.page} key={l.pageNum} id={getPageId(l.pageNum)}>
                                {l.elements.map((e, i) => (
                                    <div className={styles.pageItem} key={i}>{e}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <Pagination
                    pageNums={this.list.map(p => p.pageNum)}
                    wrapperRef={this.wrapperRef}
                    scrollBoxRef={this.scrollBoxRef}
                    inititalPage={this.currentPageNum}
                    maxPageNum={this.maxPage}
                    openPage={this.openPage}
                    onPageScrolled={this.onPageScrolled}
                />
            </div>
        );
    }

    private async loadData(pageNum: number) {
        if (this.props.loader) {
            console.log('loadData pageNum:', pageNum);
            this.pageStatuses[pageNum] = 'loading';
            this.isPageLoading = true;
            try {
                const pagedData = await this.props.loader(pageNum);
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
        }
    }

    private loadPage = async (pageNum: number) => {
        switch (this.pageStatuses[pageNum]) {
            case 'fetched': {
                break;
            }
            case 'loading': {
                break;
            }
            case 'deffered': {
                await this.loadData(pageNum);
                break;
            }
        }
        this.updateList();
    }

    private loadNextPage = async () => {
        this.maxPageBound++;
        const nextNum = this.maxPageBound;
        // console.log('loadNextPage', nextNum, this.pageStatuses[nextNum])
        await this.loadPage(nextNum);
        this.forceUpdate();
    }

    private loadPreviousPage = async () => {
        this.minPageBound--;
        const prevNum = this.minPageBound;
        // console.log('loadPreviousPage', prevNum, this.pageStatuses[prevNum]);
        await this.loadPage(prevNum);
        this.forceUpdate();
    }
}


class Pagination extends React.Component<{
    wrapperRef: React.RefObject<HTMLDivElement>;
    scrollBoxRef: React.RefObject<HTMLDivElement>;
    pageNums: number[];
    maxPageNum: number;
    inititalPage: number;
    openPage: (pageNum: number) => void;
    onPageScrolled: (currentPage: number) => void;
}> {
    private currentPage: number = this.props.inititalPage;

    componentDidMount() {
        if (this.props.scrollBoxRef.current) {
            this.props.scrollBoxRef.current.addEventListener('scroll', () => {
                this.onScroll();
            })
        }
    }

    componentDidUpdate() {
        this.onScroll();
    }

    private onScroll = () => {
        // Get current page
        let currPage = 0;
        this.props.pageNums.forEach(p => {
            const id = getPageId(p);
            if (this.props.wrapperRef.current) {
                const pageNode = this.props.wrapperRef.current.querySelector('#' + id);
                if (pageNode) {
                    const bounds = pageNode.getBoundingClientRect();
                    if (!currPage && bounds.top > 0) currPage = p;
                }
            }
        });
        if (currPage && this.currentPage !== currPage) {
            console.log('currPage', currPage)
            this.currentPage = currPage;
            this.props.onPageScrolled(currPage);
            this.forceUpdate();
        }
    }

    render() {
        const currPage = this.currentPage;
        const pages = getPageNumsAround(currPage, 10, this.props.maxPageNum);
        return (
            <div className={styles.pagination}>
                {pages.map(p => (
                    <div key={p}
                        className={`${styles.pageLink} ${p === currPage ? styles.currentPage : ''}`}
                        onClick={() => {
                            this.currentPage = p;
                            this.props.openPage(p);
                        }}
                    >{p}</div>
                ))}
            </div>
        )
    }
}