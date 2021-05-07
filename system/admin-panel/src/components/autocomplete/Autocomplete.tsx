import { getBlockInstance, getRandStr, TPagedList, TPagedParams } from '@cromwell/core';
import { CList, TCList } from '@cromwell/core-frontend';
import {
    Fade,
    IconButton,
    InputAdornment,
    ListItem,
    Popper,
    TextField as MuiTextField,
    withStyles,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'throttle-debounce';

import styles from './Autocomplete.module.scss';

const TextField = withStyles({
    root: {
        paddingTop: '0',
        paddingBottom: '0',
        fontWeight: 300,
        width: "100%"
    },
})(MuiTextField);

class Autocomplete<TItemDataType> extends React.Component<{
    loader: (search: string, params?: TPagedParams<TItemDataType>) => Promise<(TPagedList<TItemDataType> | TItemDataType[]) | undefined>;
    itemComponent?: (props: {
        data: TItemDataType;
    }) => JSX.Element;
    getOptionLabel: (data: TItemDataType) => string;
    getOptionValue?: (data: TItemDataType) => string;
    onSelect?: (data: TItemDataType | null) => void;
    className?: string;
    fullWidth?: boolean;
    defaultValue?: TItemDataType;
    label?: string;
    variant?: 'standard' | 'outlined' | 'filled';
}, {
    searchOpen: boolean;
    isLoading: boolean;
    searchItems: TItemDataType[];
    searchText: string;
    pickedText: string;
    defaultValue?: TItemDataType;
}> {
    private searchAnchorRef = React.createRef<HTMLDivElement>();
    private listId = 'AutocompleteList_' + getRandStr();
    private listSkeleton = [];

    constructor(props: any) {
        super(props);

        this.state = {
            searchOpen: false,
            isLoading: false,
            searchItems: [],
            searchText: '',
            pickedText: props.defaultValue ? props.getOptionValue?.(props.defaultValue) ?? props.getOptionLabel(props.defaultValue) : '',
            defaultValue: props.defaultValue,
        }

        for (let i = 0; i < 5; i++) {
            this.listSkeleton.push(<Skeleton key={i} variant="text" height="20px" style={{ margin: '5px 20px' }} />)
        }
    }

    componentDidUpdate() {
        if (this.props.defaultValue && this.state.defaultValue !== this.props.defaultValue) {
            const text = this.props.getOptionValue?.(this.props.defaultValue) ?? this.props.getOptionLabel(this.props.defaultValue);
            this.setState({
                defaultValue: this.props.defaultValue,
                pickedText: text,
                searchText: text,
            })
        }
    }

    private fetchItems = async (searchText: string, params?: TPagedParams<TItemDataType>) => {
        if (!this.state.isLoading)
            this.setState({ isLoading: true });

        let itemList;
        try {
            itemList = await this.props.loader(searchText, params);
            if (Array.isArray(itemList)) {
                this.setState({
                    searchItems: itemList
                });
            } else if (itemList.elements) {
                this.setState({
                    searchItems: itemList.elements
                });
            }
        } catch (e) {
            console.error(e);
        }
        this.setState({ isLoading: false });
        return itemList;
    }

    private searchRequest = debounce(500, async (searchText: string) => {
        const list = getBlockInstance<TCList>(this.listId)?.getContentInstance();
        if (!list) {
            return;
        }
        list.clearState();
        list.init();
    });

    private loadMore = (params: TPagedParams<TItemDataType>) => {
        return this.fetchItems(this.state.searchText, params);
    }

    private handleSearchInput = (searchText: string) => {
        this.setState({ searchText });

        if (!this.state.isLoading)
            this.setState({ isLoading: true });

        if (!this.state.searchOpen) {
            this.setState({ searchOpen: true });
        }
        this.searchRequest(searchText);
    }

    private handleSearchClose = () => {
        this.setState({ searchOpen: false, searchText: this.state.pickedText });
    }

    private handleItemClick = (data: TItemDataType) => {
        const pickedText = this.props.getOptionValue?.(data) ?? this.props.getOptionLabel(data);
        this.setState({
            searchText: pickedText,
            pickedText: pickedText,
            searchOpen: false,
        });
        this.props.onSelect?.(data);
    }

    private handleClear = () => {
        this.setState({
            searchText: '',
            pickedText: '',
            searchOpen: false,
        });
        this.props.onSelect?.(null);
    }

    render() {
        const { isLoading, searchItems, searchOpen } = this.state;
        const ItemComponent = this.props.itemComponent;

        return (
            <>
                <TextField
                    label={this.props.label ?? "Search..."}
                    variant={this.props.variant}
                    size="small"
                    ref={this.searchAnchorRef}
                    value={this.state.searchText}
                    onChange={(event) => this.handleSearchInput(event.currentTarget.value)}
                    onFocus={() => this.handleSearchInput(this.state.searchText)}
                    onBlur={this.handleSearchClose}
                    fullWidth={this.props.fullWidth}
                    className={this.props.className}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={this.handleClear}>
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Popper open={searchOpen} anchorEl={this.searchAnchorRef.current}
                    style={{ zIndex: 9999 }}
                    transition>
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <div className={styles.searchContent}>
                                {/* {isLoading && (
                                    <LoadBox size={100} />
                                )}
                                {!isLoading && searchItems.length === 0 && (
                                    <p className={styles.notFoundText}>No items found</p>
                                )}
                                {!isLoading && ( */}
                                <CList<TItemDataType>
                                    useAutoLoading
                                    className={styles.list}
                                    id={this.listId}
                                    loader={this.loadMore}
                                    elements={{ preloader: <div className={styles.listPreloader}>{this.listSkeleton}</div> }}
                                    ListItem={(props) => {
                                        return (
                                            <div onClick={() => this.handleItemClick(props.data)} className={styles.itemWrapper}>
                                                {ItemComponent ? (
                                                    <ItemComponent data={props.data} />
                                                ) : (
                                                    <ListItem button>
                                                        <p className={styles.itemText}>{this.props.getOptionLabel(props.data)}</p>
                                                    </ListItem>
                                                )}
                                            </div>
                                        )
                                    }}
                                />
                                {/* )} */}
                            </div>
                        </Fade>
                    )}
                </Popper>
            </>
        );
    }

}

export default Autocomplete;