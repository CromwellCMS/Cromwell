import React from 'react';

import styles from './CList.module.scss';
import { getPagedUrl, getPageId, getPageNumsAround } from './helpers';
import { TCssClasses, TElements } from './types';


export class Pagination extends React.Component<{
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
    setPaginationInst: (inst: Pagination) => void
}> {
    private currentPage: number = this.props.inititalPage;
    private scrollboxEl: Element | undefined | null;

    constructor(props) {
        super(props);
        this.props.setPaginationInst(this);
    }

    componentDidMount() {
        this.init();
    }

    public init() {
        const props = this.props;

        if (this.scrollboxEl) {
            this.scrollboxEl.removeEventListener('scroll', this.onScroll);
        }

        if (props.scrollContainerSelector) {
            this.scrollboxEl = document.querySelector(props.scrollContainerSelector);

        } else if (props.scrollBoxRef.current) {
            this.scrollboxEl = props.scrollBoxRef.current;
        }
        if (this.scrollboxEl) {
            this.scrollboxEl.addEventListener('scroll', this.onScroll)
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
                    let topOffset = bounds.bottom;
                    if (this.scrollboxEl) {
                        topOffset -= this.scrollboxEl.getBoundingClientRect().top;
                    }
                    if (!currPage && topOffset > 0) currPage = p;
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