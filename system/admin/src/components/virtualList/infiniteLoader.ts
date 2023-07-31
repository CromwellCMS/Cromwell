import { useCallback, useRef } from 'react';
import isRangeVisible from './isRangeVisible';
import { scanForUnloadedRanges } from './scanForUnloadedRanges';
import type { Ranges } from './types';

type onItemsRenderedParams = {
  visibleStartIndex: number;
  visibleStopIndex: number;
};
type onItemsRendered = (params: onItemsRenderedParams) => void;

export type Props = {
  // Render prop.
  children: (arg0: { onItemsRendered: onItemsRendered; ref: any }) => any;
  // Function responsible for tracking the loaded state of each item.
  isItemLoaded: (index: number) => boolean;
  // Number of rows in list; can be arbitrary high number if actual number is unknown.
  itemCount: number;
  // Callback to be invoked when more rows must be loaded.
  // It should return a Promise that is resolved once all data has finished loading.
  loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void>;
  // Renamed to loadMoreItems in v1.0.3; will be removed in v2.0
  loadMoreRows?: (startIndex: number, stopIndex: number) => Promise<void>;
  // Minimum number of rows to be loaded at a time; defaults to 10.
  // This property can be used to batch requests to reduce HTTP requests.
  minimumBatchSize?: number;
  // Threshold at which to pre-fetch data; defaults to 15.
  // A threshold of 15 means that data will start loading when a user scrolls within 15 rows.
  threshold?: number;
};

export const InfiniteLoader = ({
  children,
  isItemLoaded,
  itemCount,
  loadMoreItems,
  loadMoreRows,
  minimumBatchSize = 10,
  threshold = 15,
}: Props) => {
  const _lastRenderedStartIndex = useRef(-1);
  const _lastRenderedStopIndex = useRef(-1);
  const _listRef = useRef<any>(null);
  const _memoizedUnloadedRanges = useRef<Ranges>([]);

  const _loadUnloadedRanges = useCallback((unloadedRanges: Ranges) => {
    const loadMore = loadMoreItems || loadMoreRows;

    for (let i = 0; i < unloadedRanges.length; i += 2) {
      const startIndex = unloadedRanges[i];
      const stopIndex = unloadedRanges[i + 1];
      const promise = loadMore(startIndex, stopIndex);

      if (promise != null) {
        promise.then(() => {
          if (
            isRangeVisible({
              lastRenderedStartIndex: _lastRenderedStartIndex.current,
              lastRenderedStopIndex: _lastRenderedStopIndex.current,
              startIndex,
              stopIndex,
            })
          ) {
            if (_listRef.current == null) {
              return;
            }

            if (typeof _listRef.current?.resetAfterIndex === 'function') {
              _listRef.current?.resetAfterIndex?.(startIndex, true);
            } else {
              if (typeof _listRef.current?._getItemStyleCache === 'function') {
                _listRef.current?._getItemStyleCache(-1);
              }

              _listRef.current?.forceUpdate();
            }
          }
        });
      }
    }
  }, []);

  const _ensureRowsLoaded = useCallback(
    (startIndex: number, stopIndex: number) => {
      // console.log(startIndex, stopIndex, itemCount, threshold)
      const unloadedRanges = scanForUnloadedRanges({
        isItemLoaded,
        itemCount,
        minimumBatchSize,
        startIndex: Math.max(0, startIndex - threshold),
        stopIndex: Math.min(itemCount - 1, stopIndex + threshold),
      });

      if (
        _memoizedUnloadedRanges.current.length !== unloadedRanges.length ||
        _memoizedUnloadedRanges.current.some((startOrStop, index) => unloadedRanges[index] !== startOrStop)
      ) {
        _memoizedUnloadedRanges.current = unloadedRanges;

        _loadUnloadedRanges(unloadedRanges);
      }
    },
    [isItemLoaded, itemCount, threshold, minimumBatchSize],
  );

  const _onItemsRendered: onItemsRendered = useCallback(
    ({ visibleStartIndex, visibleStopIndex }: onItemsRenderedParams) => {
      _lastRenderedStartIndex.current = visibleStartIndex;
      _lastRenderedStopIndex.current = visibleStopIndex;

      _ensureRowsLoaded(visibleStartIndex, visibleStopIndex);
    },
    [_ensureRowsLoaded],
  );

  return children({
    onItemsRendered: _onItemsRendered,
    ref: _listRef,
  });
};
