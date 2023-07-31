import type { Ranges } from './types';
export function scanForUnloadedRanges({
  isItemLoaded,
  itemCount,
  minimumBatchSize,
  startIndex,
  stopIndex,
}: {
  isItemLoaded: (index: number) => boolean;
  itemCount: number;
  minimumBatchSize: number;
  startIndex: number;
  stopIndex: number;
}): Ranges {
  const unloadedRanges: Ranges = [];
  let rangeStartIndex = null;
  let rangeStopIndex = null;

  for (let index = startIndex; index <= stopIndex; index++) {
    // console.log("CHECK LOAD", index)
    const loaded = isItemLoaded(index);
    // console.log("ISLOADED", loaded, index)

    if (!loaded) {
      rangeStopIndex = index;

      if (rangeStartIndex === null) {
        rangeStartIndex = index;
      }
    } else if (rangeStopIndex !== null) {
      unloadedRanges.push(rangeStartIndex as any as number, rangeStopIndex as any as number);
      rangeStartIndex = rangeStopIndex = null;
    }
  }

  // If :rangeStopIndex is not null it means we haven't ran out of unloaded rows.
  // Scan forward to try filling our :minimumBatchSize.
  if (rangeStopIndex !== null) {
    const potentialStopIndex = Math.min(
      Math.max(rangeStopIndex, rangeStartIndex + minimumBatchSize - 1),
      itemCount - 1,
    );

    for (let index = rangeStopIndex + 1; index <= potentialStopIndex; index++) {
      if (!isItemLoaded(index)) {
        rangeStopIndex = index;
      } else {
        break;
      }
    }

    unloadedRanges.push(rangeStartIndex as any as number, rangeStopIndex as any as number);
  }

  // Check to see if our first range ended prematurely.
  // In this case we should scan backwards to try filling our :minimumBatchSize.
  if (unloadedRanges.length) {
    while (unloadedRanges[1] - unloadedRanges[0] + 1 < minimumBatchSize && unloadedRanges[0] > 0) {
      const index = unloadedRanges[0] - 1;

      if (!isItemLoaded(index)) {
        unloadedRanges[0] = index;
      } else {
        break;
      }
    }
  }

  return unloadedRanges;
}
