import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Slider from '@mui/material/Slider';
import React from 'react';

import styles from './FontSize.module.scss';

export function InputSlider(props: {
    onChange: (newVal: number) => void;
    initialVal: number;
}) {
    const [value, setValue] = React.useState<number | string | Array<number | string>>(props.initialVal ?? 30);

    const changeValue = (newValue: number | string | Array<number | string>) => {
        setValue(newValue as number);
        props.onChange(newValue as number);
    }

    const handleSliderChange = (event: any, newValue: number | number[]) => {
        changeValue(newValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        changeValue(!event.target.value ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            changeValue(0);
        } else if (value > 100) {
            changeValue(100);
        }
    };

    return (
        <div className={styles.fontSizeWrapper}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider
                        value={typeof value === 'number' ? value : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                    />
                </Grid>
                <Grid item>
                    <Input
                        className={styles.inputFontSize}
                        value={value}
                        margin="dense"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 2,
                            min: 0,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );
}