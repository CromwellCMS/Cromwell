import { isServer, TCromwellBlockProps, TPagedList, TPagedParams } from '@cromwell/core';
import { debounce } from 'throttle-debounce';
import React from 'react';

import { CBlock } from '../CBlock/CBlock';
import { LoadBox } from '../loadBox/Loadbox';
import { throbber } from '../throbber';
import styles from './CList.module.scss';
import { Pagination } from './CListPagination';
import { getPagedUrl, getPageId, getPageNumsAround, getPageNumberFromUrl } from './helpers';
import { TCList, TCListProps, TListenerType } from './types';


export class CList<DataType, ListItemProps = any> extends React.PureComponent<TCListProps<DataType, ListItemProps> & TCromwellBlockProps<TCList>> implements TCList<DataType, ListItemProps> {

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
    private remoteRowCount: number = 0;
    private maxPage: number = 1;
    private maxDomPages: number = 10;
    private pageStatuses: ('deferred' | 'loading' | 'fetched' | 'failed')[] = [];
    private isPageLoading: boolean = false;
    private isLoading: boolean = false;
    private prevFirstBatch: DataType[];
    private scrollBoxRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    private wrapperRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    private throbberRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    private throbberAutoloadingBefore: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    private throbberAutoloadingAfter: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    private forcedProps: TCListProps<DataType, ListItemProps> | null;
    private listeners: Record<TListenerType, { cb: () => void; id?: string }[]> = { componentDidUpdate: [] };
    private paginationInst?: Pagination;

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

    componentDidUpdate() {
        const props = this.getProps();
        this.triggerListener('componentDidUpdate');
        if (props.useAutoLoading && this.scrollBoxRef.current && this.wrapperRef.current) {
            this.wrapperRef.current.style.minHeight = this.scrollBoxRef.current.clientHeight - 20 + 'px';

            const lastPage = this.wrapperRef.current.querySelector(`#${getPageId(this.maxPage)}`);
            if (lastPage && this.maxPage > 1) {
                const pad = this.scrollBoxRef.current.clientHeight - lastPage.clientHeight + 10;
                if (pad > 0) {
                    this.wrapperRef.current.style.paddingBottom = pad + 'px';
                }
            }
            else {
                this.wrapperRef.current.style.paddingBottom = '0px';
            }
        }
        this.onScroll();
    }

    componentWillUnmount() {
        this.clearState();
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

        if (!props.dataList && props.loader) {
            if (props.useQueryPagination && !isServer()) {
                const pageNumber = getPageNumberFromUrl();
                this.currentPageNum = pageNumber;
                this.minPageBound = pageNumber;
                this.maxPageBound = pageNumber;
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

    public updateData = async () => {
        this.dataList = [];
        this.list = [];
        this.pageStatuses = [];
        await this.fetchFirstBatch();
    }

    private fetchFirstBatch = async () => {
        const props = this.getProps();
        if (props.loader) {
            this.isLoading = true;
            this.setOverlay(true, true);
            try {
                const data = await props.loader(this.pagedParams);
                if (data && !Array.isArray(data) && data.elements) {
                    this.parseFirstBatchPaged(data);
                }
                if (data && Array.isArray(data)) {
                    this.parseFirstBatchArray(data);
                }

            } catch (e) {
                console.error(e);
            }
            this.isLoading = false;
            this.setOverlay(false, true);
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
                this.pageStatuses[i] = 'deferred';
            }
        }

        this.pageStatuses[this.currentPageNum] = 'fetched';

        if (data.elements) {
            this.addElementsToList(data.elements, this.currentPageNum);
        }
    }

    private parseFirstBatchArray = (data: DataType[]) => {
        this.remoteRowCount = data.length;
        if (this.prevFirstBatch !== data) {
            this.prevFirstBatch = data;
            this.currentPageNum = 1;
        }

        const props = this.getProps();
        if (props.usePagination) {
            const pageSize = this.pageSize ?? 15;
            this.minPageBound = this.currentPageNum;
            this.maxPageBound = this.currentPageNum;
            this.maxPage = Math.ceil(data.length / pageSize);

            let hasItems = true;
            let idx = 0;
            let pageNum = 1;
            while (hasItems) {
                const page: DataType[] = [];
                for (let i = 0; i < pageSize; i++) {
                    if (!data[idx]) {
                        hasItems = false;
                        break;
                    }
                    page.push(data[idx])
                    idx++;
                }
                this.addElementsToList(page, pageNum);
                pageNum++;
            }
        } else {
            this.currentPageNum = 1;
            this.minPageBound = 1;
            this.maxPageBound = 1;
            this.maxPage = 1;
            this.addElementsToList(data, this.currentPageNum);
        }

    }

    private addElementsToList(data: DataType[], pageNum: number) {
        this.dataList[pageNum] = data;
        this.updateList();
    }


    private onScroll = debounce(50, () => {
        const props = this.getProps();
        if (props.useAutoLoading) {
            const minRangeToLoad = props.minRangeToLoad ?? 200;
            if (this.scrollBoxRef.current && this.wrapperRef.current) {
                const scrollTop = this.scrollBoxRef.current.scrollTop;
                const scrollBottom = this.wrapperRef.current.clientHeight - this.scrollBoxRef.current.clientHeight - scrollTop;

                this.setThrobberAutoloadingAfter();

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
    })

    public clearState = () => {
        const props = this.getProps();
        this.currentPageNum = 1;
        this.minPageBound = 1;
        this.maxPageBound = 1;
        if (props.useQueryPagination) {
            window.history.replaceState({}, '', getPagedUrl(0));
        }
        this.dataList = [];
        this.list = [];
        this.pageStatuses = [];
        if (this.scrollBoxRef.current) {
            this.scrollBoxRef.current.scrollTop = 0;
        }
    }

    public onPageScrolled = (pageNumber: number) => {
        const props = this.getProps();
        this.currentPageNum = pageNumber;
        if (props.useQueryPagination) {
            const currentPageNumber = getPageNumberFromUrl();
            if (currentPageNumber !== pageNumber)
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
                    s === 'fetched' || s === 'failed' ? 'deferred' : s)
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
                console.error(e);
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
            case 'deferred': {
                await this.loadData(pageNum);
                hasLoaded = true;
                break;
            }
        }
        this.updateList();
        return hasLoaded;
    }

    public setOverlay = (isLoading: boolean, force?: boolean) => {
        const props = this.getProps();

        if (!force && (!props.usePagination || props.useAutoLoading)) return;

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

    private setThrobberAutoloadingAfter = (enable?: boolean) => {
        const throbber = this.throbberAutoloadingAfter.current;
        if (!throbber) return;

        if (this.maxPageBound >= this.maxPage) {
            throbber.style.display = 'none';
            return;
        }
        if (enable) throbber.style.display = 'block';
    }

    private loadNextPage = async () => {
        if (this.maxPageBound >= this.maxPage) return;
        const props = this.getProps();
        if (props.useAutoLoading && this.maxPageBound + 1 >= this.currentPageNum + this.maxDomPages) return;

        this.maxPageBound++;
        const nextNum = this.maxPageBound;
        // console.log('loadNextPage', nextNum, this.pageStatuses[nextNum])
        this.setThrobberAutoloadingAfter(true);
        await this.loadPage(nextNum);
        this.forceUpdate();
    }

    private loadPreviousPage = async () => {
        if (this.minPageBound > 1 && this.minPageBound + 1 > this.currentPageNum - this.maxDomPages) {
            this.minPageBound--;
            const prevNum = this.minPageBound;
            // console.log('loadPreviousPage', prevNum, this.pageStatuses[prevNum]);
            const throbber = this.throbberAutoloadingBefore.current;
            if (throbber) throbber.style.display = 'block';
            await this.loadPage(prevNum);
            this.forceUpdate();
        }
        if (this.minPageBound <= 1) {
            const throbber = this.throbberAutoloadingBefore.current;
            if (throbber) throbber.style.display = 'none';
        }
    }

    public getScrollboxEl = () => {
        return this.scrollBoxRef.current;
    }

    private wrapContent = (content: JSX.Element): JSX.Element => {
        const props = this.getProps();
        const { id, ...rest } = props;
        return (
            <CBlock id={id} type='list'
                className={props.className}
                {...rest}
                content={(data, blockRef, setContentInstance) => {
                    setContentInstance(this);
                    return (
                        <div className={styles.CList}>
                            <div className={(this.isLoading || props.isLoading) ? undefined : styles.none} ref={this.throbberRef}>
                                {props.elements?.preloader ??
                                    <div className={styles.listOverlay}>
                                        <LoadBox />
                                    </div>
                                }
                            </div>
                            {content}
                        </div>
                    );
                }}
            />
        )
    }

    private handleShowMoreClick = () => {
        if (this.maxPage > this.maxPageBound) {
            if (!this.isPageLoading) {
                this.loadNextPage();
                this.forceUpdate();
            }
        }
    }

    public getPagedParams = () => this.pagedParams;
    public setPagedParams = (val: TPagedParams<DataType>) => this.pagedParams = val;

    render() {
        const props = this.getProps();
        let content;
        if (this.isLoading || props.isLoading) {
            return this.wrapContent(content);
        }

        if (props.dataList) {
            this.parseFirstBatchArray(props.dataList);
        }

        if (this.list.length === 0) {
            content = props.noDataLabel ? (
                <h3>{props.noDataLabel}</h3>
            ) : <></>;
            return this.wrapContent(content);
        }

        content = (
            <>
                <div className={`${styles.scrollBox} ${props.cssClasses?.scrollBox ?? ''}`}
                    ref={this.scrollBoxRef}
                    onScroll={this.onScroll}
                    style={props.useAutoLoading ?
                        { height: '100%', overflow: 'auto' } : {}}
                >
                    <div className={`${styles.wrapper} ${props.cssClasses?.contentWrapper ?? ''}`} ref={this.wrapperRef}>
                        {/* {props.useAutoLoading && (
                            <div ref={this.throbberAutoloadingBefore} style={{ display: 'none' }}>
                                <div className={styles.throbberAutoloading}
                                    dangerouslySetInnerHTML={{ __html: throbber }}></div>
                            </div>
                        )} */}
                        {this.list.map(l => (
                            <div className={`${styles.page} ${props.cssClasses?.page || ''}`}
                                key={l.pageNum}
                                id={getPageId(l.pageNum)}>
                                {l.elements}
                            </div>
                        ))}
                        {props.useAutoLoading && (
                            <div style={{ display: 'none' }}
                                ref={this.throbberAutoloadingAfter}
                            >
                                <div className={styles.throbberAutoloading}
                                    dangerouslySetInnerHTML={{ __html: throbber }}></div>
                            </div>
                        )}
                    </div>
                </div>
                {props.useShowMoreButton && !this.isPageLoading && this.maxPage > this.maxPageBound && (
                    <div className={styles.showMoreBtnContainer}>
                        {props.elements?.showMore ? (
                            <props.elements.showMore onClick={this.handleShowMoreClick} />
                        ) : (
                            <div
                                className={styles.showMoreBtn}
                                onClick={this.handleShowMoreClick}
                            >Show more</div>
                        )}
                    </div>
                )}
                {props.usePagination && this.maxPage > 1 && (
                    <Pagination
                        pageNums={this.list.map(p => p.pageNum)}
                        wrapperRef={this.wrapperRef}
                        scrollBoxRef={this.scrollBoxRef}
                        initialPage={this.currentPageNum}
                        maxPageNum={this.maxPage}
                        openPage={this.openPage}
                        onPageScrolled={this.onPageScrolled}
                        paginationButtonsNum={props.paginationButtonsNum}
                        cssClasses={props.cssClasses}
                        elements={props.elements}
                        pathname={props.pathname}
                        scrollContainerSelector={props.scrollContainerSelector}
                        setPaginationInst={(inst: Pagination) => this.paginationInst = inst}
                    />
                )}
            </>
        );
        return this.wrapContent(content);
    }

}

