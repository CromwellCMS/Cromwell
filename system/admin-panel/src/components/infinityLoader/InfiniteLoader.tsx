import React from 'react'
import { InfiniteLoader, List, AutoSizer, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import styles from './InfiniteLoader.module.scss';
import LoadBox from '../loadBox/LoadBox';
import { TProduct, TPagedList, TPagedMeta } from '@cromwell/core';

// import Alertify from 'alertify.js';

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

    /** Whether or not show preloader / throbber instead of a list */
    isLoading?: boolean;
    preloaderSize?: number;

    /** Label to show when data array is empty. "No data" by default */
    noDataLabel?: string;
}
type TState = {
    isLoading: boolean;
}

export type TItemComponentProps<DataType, ListItemProps> = {
    data: DataType;
    listItemProps?: ListItemProps;
}

class BaseInfiniteLoader<DataType, ListItemProps = {}> extends React.PureComponent<TProps<DataType, ListItemProps>, TState> {

    private cache = new CellMeasurerCache({
        defaultHeight: 30,
        fixedWidth: true,
        keyMapper: index => index
    });

    private dataList: DataType[] = [];
    private list: JSX.Element[] = [];
    private listRef: any;
    private newStartIndex: number = 0;
    private newEndIndex: number = 0;
    private currentPageNum: number = 1;
    private canLoadMore: boolean = true;
    private remoteRowCount: number = 0;
    private lastDataList: DataType[] = [];
    private lastListItemProps?: ListItemProps;


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
            try {
                const pagedData = await this.props.loader(this.currentPageNum);
                if (pagedData) {
                    if (!Array.isArray(pagedData) && pagedData.elements && pagedData.pagedMeta) {
                        this.addElementsToList(pagedData.elements);
                        this.remoteRowCount = pagedData.pagedMeta.totalElements ? pagedData.pagedMeta.totalElements : 0;

                    }
                    if (Array.isArray(pagedData)) {
                        this.canLoadMore = false;
                        this.addElementsToList(pagedData);
                        this.remoteRowCount = pagedData.length;
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

    private addElementsToList(data: DataType[]) {
        this.newStartIndex = this.list.length;

        data.forEach((rowData) => {
            this.dataList.push(rowData);
            this.addJSXElement(rowData);
        });
        this.newEndIndex = this.list.length;
    }

    private addJSXElement(data: DataType) {
        const ListItem = this.props.ListItem;
        const item = (<ListItem data={data} listItemProps={this.props.listItemProps} key={this.list.length} />);
        this.list.push(item);
    }


    componentDidUpdate(prevProps: TProps<DataType, ListItemProps>, prevState: TState) {

        if (this.listRef) {
            for (let i = this.newStartIndex; i < this.newEndIndex; i++) {
                this.cache.clear(i, 0);
                this.listRef.recomputeRowHeights(i);
            }
        }
        else {
            //console.log('!this.listRefthis.listRefthis.listRefthis.listRef')
        }
        this.newStartIndex = 0;
        this.newEndIndex = 0;
    }

    render() {
        if (this.state.isLoading || this.props.isLoading) {
            return (
                <div className={styles.BaseInfiniteLoader}>
                    <LoadBox size={this.props.preloaderSize ? this.props.preloaderSize : 100} />
                </div>

            )
        }

        if (this.props.dataList && this.props.dataList !== this.lastDataList) {
            this.lastDataList = this.props.dataList;
            // if (this.dataList.length !== this.props.dataList.length) {
            this.remoteRowCount = this.props.dataList.length;
            this.dataList = [];
            this.list = [];
            this.addElementsToList(this.props.dataList);
        }
        else if (this.lastListItemProps !== this.props.listItemProps) {
            this.lastListItemProps = this.props.listItemProps;
            this.list = [];
            this.dataList.forEach((data) => {
                this.addJSXElement(data);
            });
            if (this.listRef) {
                this.listRef.recomputeRowHeights();
            }
        }

        console.log('this.remoteRowCount', this.remoteRowCount, this.dataList, this.list)


        if (this.list.length === 0) {
            return (
                <div className={styles.BaseInfiniteLoader}>
                    <div className="load-box">
                        <h3>{this.props.noDataLabel ? this.props.noDataLabel : 'No data'}</h3>
                    </div>
                </div>
            )
        }

        return (
            <div className={styles.BaseInfiniteLoader}>
                <InfiniteLoader
                    isRowLoaded={this.isRowLoaded}
                    loadMoreRows={this.loadMoreRows}
                    rowCount={this.remoteRowCount}>
                    {({ onRowsRendered, registerChild }) => (
                        <AutoSizer >
                            {({ height, width }) => {
                                //console.log('{ height, width }', { height, width })
                                return (
                                    <List
                                        deferredMeasurementCache={this.cache}
                                        ref={(element) => {
                                            this.listRef = element;
                                            registerChild(element);
                                        }}
                                        height={height}
                                        onRowsRendered={onRowsRendered}
                                        rowCount={this.remoteRowCount}
                                        rowHeight={this.cache.rowHeight}
                                        rowRenderer={this.rowRenderer}
                                        width={width}
                                    />
                                )
                            }}
                        </AutoSizer>
                    )}
                </InfiniteLoader>
            </div>
        );
    }


    private isRowLoaded = ({ index }: { index: number }) => {
        return !!this.list[index];
    }

    private loadMoreRows = ({ startIndex, stopIndex }: { startIndex: number, stopIndex: number }) => {

        if (this.canLoadMore === false || !this.props.loader)
            return new Promise((res) => { res(); })

        let promiseResolver;

        if (this.remoteRowCount > 1) {
            this.loadData(promiseResolver);
        }

        return new Promise(resolve => {
            promiseResolver = resolve;
        });
    }

    private async loadData(promiseResolver: (() => void) | undefined) {
        if (this.props.loader) {
            this.currentPageNum++;
            try {
                const pagedData = await this.props.loader(this.currentPageNum);
                if (pagedData && !Array.isArray(pagedData) && pagedData.elements) {
                    this.addElementsToList(pagedData.elements);
                    this.forceUpdate();
                }
            } catch (e) {
                console.log(e);
            }
        }

        if (promiseResolver) promiseResolver();
    }

    public rowRenderer = ({ index, key, style, parent }: { index: number, key: string, style: React.CSSProperties, parent: any }) => {
        const row = this.list[index];
        let rowJSX: JSX.Element;
        if (row) {
            rowJSX = row;
        }
        if (!row) {
            rowJSX = (
                <div className={styles.rowPreloader}>
                    <LoadBox size={30} />
                </div>
            );
        }

        return (
            <CellMeasurer
                cache={this.cache}
                columnIndex={0}
                key={key}
                rowIndex={index}
                parent={parent}
            >
                {({ measure }) => (
                    <div style={style}>
                        {
                            rowJSX
                        }
                    </div>
                )}

            </CellMeasurer>
        );
    }
}

export default BaseInfiniteLoader;