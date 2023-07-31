import { getCStore } from '@cromwell/core-frontend';
import { Slider as MUISlider } from '@mui/material';
import React, { useState } from 'react';

import { IOSSliderStyles } from '../styles';

const getPriceText = (value: number) => {
  return getCStore().getPriceWithCurrency(value);
};

function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue((value) => ++value);
}

const StyledSlider = IOSSliderStyles(MUISlider);

export const Slider = (props: {
  onChange: (value: number[]) => void;
  minPrice: number;
  maxPrice: number;
  priceRange: number[];
}) => {
  const forceUpdate = useForceUpdate();
  const _minPrice = React.useRef<number>(props.minPrice);
  const _maxPrice = React.useRef<number>(props.maxPrice);
  const lastParentPriceRange = React.useRef<number[]>(props.priceRange);
  const priceRange = React.useRef<number[]>([props.minPrice, props.maxPrice]);

  if (props.minPrice !== _minPrice.current) {
    priceRange.current[0] = props.minPrice;
    _minPrice.current = props.minPrice;
  }
  if (props.maxPrice !== _maxPrice.current) {
    priceRange.current[1] = props.maxPrice;
    _maxPrice.current = props.maxPrice;
  }
  if (
    props.priceRange[0] !== lastParentPriceRange.current[0] ||
    props.priceRange[1] !== lastParentPriceRange.current[1]
  ) {
    priceRange.current = [...props.priceRange];
    lastParentPriceRange.current = [...props.priceRange];
  }

  const handlePriceRangeChange = (event: any, newValue: number | number[]) => {
    priceRange.current = newValue as number[];
    props.onChange(newValue as number[]);
    forceUpdate();
  };

  const marks = [
    {
      value: props.minPrice,
      label: getPriceText(props.minPrice),
    },
  ];

  if (props.minPrice !== props.maxPrice) {
    marks.push({
      value: props.maxPrice,
      label: getPriceText(props.maxPrice),
    });
  }

  return (
    <div style={{ padding: '0 25px' }}>
      <StyledSlider
        value={priceRange.current}
        onChange={handlePriceRangeChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={getPriceText}
        min={props.minPrice}
        max={props.maxPrice}
        marks={marks}
      />
    </div>
  );
};
