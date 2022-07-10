import { getBlockInstance, getRandStr, TPagedList, TPagedParams } from '@cromwell/core';
import { CList, TCList } from '@cromwell/core-frontend';
import {
  Autocomplete as MuiAutocomplete,
  Checkbox,
  ClickAwayListener,
  Fade,
  Popper,
  Skeleton,
  TextField as MuiTextField,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { debounce } from 'throttle-debounce';

import { useForceUpdate } from '../../helpers/forceUpdate';
import styles from './Autocomplete.module.scss';

const TextField = withStyles({
  root: {
    paddingTop: '0',
    paddingBottom: '0',
    fontWeight: 300,
    width: "100%"
  },
})(MuiTextField);

class Autocomplete<TItemData extends { id: number | string }> extends React.Component<{
  loader: (search: string, params?: TPagedParams<TItemData>) => Promise<(TPagedList<TItemData> | TItemData[]) | undefined>;
  itemComponent?: (props: {
    data: TItemData;
  }) => JSX.Element;
  getOptionLabel: (data: TItemData) => string;
  getOptionValue?: (data: TItemData) => string;
  onSelect?: (data: TItemData | TItemData[] | null) => void;
  className?: string;
  fullWidth?: boolean;
  defaultValue?: TItemData | TItemData[];
  label?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  multiple?: boolean;
  style?: React.CSSProperties;
  options?: TItemData[];
}, {
  searchOpen?: boolean;
  isLoading: boolean;
  searchItems?: TItemData[];
  searchText?: string;
  pickedText?: string;
  pickedItems?: string[];
  defaultValue?: TItemData | TItemData[];
}> {
  private searchAnchorRef = React.createRef<HTMLDivElement>();
  private listId = 'AutocompleteList_' + getRandStr();
  private listSkeleton = [];
  private pickedData: Record<string, TItemData> = {};

  constructor(props: any) {
    super(props);

    this.state = {
      searchOpen: false,
      isLoading: false,
    }

    for (let i = 0; i < 5; i++) {
      this.listSkeleton.push(<Skeleton key={i} variant="text" height="20px" style={{ margin: '5px 20px' }} />)
    }
  }

  private setDefaultValue = (defaultValue: TItemData | TItemData[]) => {
    const { getOptionValue, getOptionLabel } = this.props;

    if (Array.isArray(defaultValue)) {
      const pickedItems: string[] = [];

      for (const val of defaultValue) {
        const pickedText = defaultValue ? (getOptionValue?.(val)
          ?? getOptionLabel(val)) : '';

        this.pickedData[pickedText] = val;
        pickedItems.push(pickedText);
      }

      Object.values(this.multiSelectionListeners).forEach(func => func(pickedItems));
      this.setState({
        searchText: '',
        pickedText: '',
        pickedItems,
        defaultValue,
      });

    } else {
      const pickedText = defaultValue ? (getOptionValue?.(defaultValue)
        ?? getOptionLabel(defaultValue)) : '';

      this.setState({
        searchText: pickedText,
        pickedText: pickedText,
        defaultValue,
      });
    }
  }

  componentDidMount() {
    this.setDefaultValue(this.props.defaultValue);
  }

  componentDidUpdate() {
    if (this.props.defaultValue && this.state.defaultValue !== this.props.defaultValue) {
      this.setDefaultValue(this.props.defaultValue);
    }
  }

  private fetchItems = async (searchText: string, params?: TPagedParams<TItemData>) => {
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

  private searchRequest = debounce(500, async () => {
    const list = getBlockInstance<TCList>(this.listId)?.getContentInstance();
    if (!list) {
      return;
    }
    list.clearState();
    list.init();
  });

  private loadMore = (params: TPagedParams<TItemData>) => {
    return this.fetchItems(this.state.searchText, params);
  }

  private handleSearchInput = (searchText: string) => {
    this.setState({ searchText });

    if (!this.state.isLoading)
      this.setState({ isLoading: true });

    if (!this.state.searchOpen) {
      setTimeout(() => {
        this.setState({ searchOpen: true });
      }, 100);
    }
    this.searchRequest();
  }

  private handleSearchClose = () => {
    this.setState({ searchOpen: false, searchText: this.state.pickedText });
  }

  private handleItemClick = (data: TItemData) => {
    const pickedText = this.props.getOptionValue?.(data) ?? this.props.getOptionLabel(data);
    this.pickedData[pickedText] = data;
    const { multiple } = this.props;

    this.setState(prev => {
      if (multiple) {
        let pickedItems = [...new Set([...(prev.pickedItems ?? [])])];
        if (pickedItems.includes(pickedText)) {
          pickedItems = pickedItems.filter(item => item !== pickedText);
        } else {
          pickedItems.push(pickedText);
        }
        this.props.onSelect?.(pickedItems.map(item => this.pickedData[item]));
        Object.values(this.multiSelectionListeners).forEach(func => func(pickedItems));

        return {
          searchText: '',
          pickedText: '',
          pickedItems,
        }
      }

      this.props.onSelect?.(data);
      return {
        searchText: pickedText,
        pickedText: pickedText,
        searchOpen: false,
      }
    });
  }

  private multiSelectionListeners: Record<string, ((pickedItems: string[]) => any)> = {};
  public addMultiSelectListener = (id: string, listener: (pickedItems: string[]) => any) => {
    this.multiSelectionListeners[id] = listener;
  }
  public removeMultiSelectListener = (id: string) => {
    delete this.multiSelectionListeners[id];
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
    const { searchOpen, pickedItems, pickedText } = this.state;
    const { multiple } = this.props;

    return (
      <>
        <MuiAutocomplete
          className={this.props.className}
          multiple={multiple}
          options={pickedItems ?? []}
          getOptionLabel={(option) => option as any}
          value={multiple ? (pickedItems ?? []) : (pickedText ?? '')}
          onChange={(event, newValue) => {
            if (!newValue) {
              this.handleClear();
            }
            if (multiple && newValue) {
              const pickedItems = [...new Set([...(newValue as any)])];
              this.props.onSelect?.(pickedItems.map(item => this.pickedData[item]));
              Object.values(this.multiSelectionListeners).forEach(func => func(pickedItems));
              this.setState({
                pickedItems,
              });
            }
          }}
          PopperComponent={() => <></>}
          renderInput={(params) => (
            <TextField
              {...params}
              style={this.props.style}
              value={this.state.searchText ?? ''}
              onChange={(event) => this.handleSearchInput(event.currentTarget.value)}
              onFocus={() => this.handleSearchInput(this.state.searchText)}
              onBlur={() => !multiple && this.handleSearchClose()}
              label={this.props.label ?? "Search..."}
              fullWidth={this.props.fullWidth}
              ref={this.searchAnchorRef}
              size="small"
              variant={this.props.variant ?? 'standard'}
            />
          )}
        />
        <Popper open={searchOpen} anchorEl={this.searchAnchorRef.current}
          style={{ zIndex: 9999 }}
          transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <div className={styles.searchContent} style={{
                width: (this.searchAnchorRef.current?.clientWidth || 470) + 'px',
              }}>
                <ClickAwayListener onClickAway={this.handleSearchClose}>
                  <CList<TItemData, ListItemProps<TItemData>>
                    useAutoLoading
                    className={styles.list}
                    id={this.listId}
                    loader={this.props.loader && this.loadMore}
                    dataList={!this.props.loader && this.props.options}
                    elements={{ preloader: <div className={styles.listPreloader}>{this.listSkeleton}</div> }}
                    ListItem={ListItem}
                    listItemProps={{
                      handleItemClick: this.handleItemClick,
                      getOptionLabel: this.props.getOptionLabel,
                      getOptionValue: this.props.getOptionValue,
                      pickedItems: this.state?.pickedItems,
                      multiple,
                      ItemComponent: this.props.itemComponent,
                      addMultiSelectListener: this.addMultiSelectListener,
                      removeMultiSelectListener: this.removeMultiSelectListener,
                    }}
                  />
                  {/* )} */}
                </ClickAwayListener>
              </div>
            </Fade>
          )}
        </Popper>
      </>
    );
  }
}

export default Autocomplete;

type ListItemProps<TItemData extends { id: number | string }> = {
  handleItemClick: (data: TItemData) => any;
  getOptionLabel: (data: TItemData) => string;
  getOptionValue?: (data: TItemData) => string;
  pickedItems?: string[];
  multiple?: boolean;
  ItemComponent?: (props: {
    data: TItemData;
  }) => JSX.Element;
  addMultiSelectListener: (id: string, listener: (pickedItems: string[]) => any) => any;
  removeMultiSelectListener: (id: string) => any;
}

type TListItem = <TItemData extends { id: number | string }>(props: {
  data?: TItemData;
  listItemProps: ListItemProps<TItemData>;
}) => JSX.Element;

const ListItem: TListItem = (props) => {
  const { pickedItems, getOptionValue, getOptionLabel, handleItemClick, multiple,
    ItemComponent, addMultiSelectListener, removeMultiSelectListener } = props.listItemProps;
  const pickedText = getOptionValue?.(props.data) ?? getOptionLabel(props.data);
  const picked = pickedItems?.includes(pickedText);
  const update = useForceUpdate();

  useEffect(() => {
    if (props.data?.id) {
      addMultiSelectListener(props.data.id + '', (picked) => {
        props.listItemProps.pickedItems = picked;
        update();
      });
    }
    return () => {
      if (props.data?.id) {
        removeMultiSelectListener(props.data.id + '');
      }
    }
  }, [])

  return (
    <div onClick={() => handleItemClick(props.data)} className={styles.itemWrapper}>
      {multiple && (
        <Checkbox checked={picked} />
      )}
      {ItemComponent ? (
        <ItemComponent data={props.data} />
      ) : (
        <p className={clsx(styles.itemText)}>{getOptionLabel(props.data)}</p>
      )}
    </div>
  )
}
