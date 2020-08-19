
import React, { Component, useEffect, useRef, useState } from 'react';
import { getPriceWithCurrency } from '@cromwell/core-frontend';
import { IOSSliderStyles } from '../styles';
import {
    Slider as MUISlider
} from '@material-ui/core';

const getPriceText = (value: number) => {
    return getPriceWithCurrency(value);
}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

const StyledSlider = IOSSliderStyles(MUISlider);

export const Slider = (props: {
    onChange: (value: number[]) => void;
    minPrice: number;
    maxPrice: number;
}) => {
    const forceUpdate = useForceUpdate();
    const _minPrice = React.useRef<number>(props.minPrice);
    const _maxPrice = React.useRef<number>(props.maxPrice);
    const priceRange = React.useRef<number[]>([props.minPrice, props.maxPrice]);

    if (props.minPrice !== _minPrice.current) {
        priceRange.current[0] = props.minPrice;
        _minPrice.current = props.minPrice;
    }
    if (props.maxPrice !== _maxPrice.current) {
        priceRange.current[1] = props.maxPrice;
        _maxPrice.current = props.maxPrice;
    }

    const handlePriceRangeChange = (event: any, newValue: number | number[]) => {
        priceRange.current = newValue as number[];
        props.onChange(newValue as number[]);
        forceUpdate();
    };

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
                marks={[
                    {
                        value: props.minPrice,
                        label: getPriceText(props.minPrice),
                    }, {
                        value: props.maxPrice,
                        label: getPriceText(props.maxPrice),
                    },
                ]}
            />
        </div>
    )
}

