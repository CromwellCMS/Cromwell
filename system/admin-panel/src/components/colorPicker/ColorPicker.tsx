import { ClickAwayListener, Fade, InputAdornment, Popper, TextField } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { useForceUpdate } from '../../helpers/forceUpdate';

export default function ColorPicker(props: {
    label: string;
    value?: string;
    className?: string;
    onChange?: (color: string) => void;
}) {
    const colorRef = useRef<string | null>(null);
    const prevValue = useRef<string | null>(null);
    const inputAnchorRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);
    const forceUpdate = useForceUpdate();

    if (props.value !== prevValue.current) {
        prevValue.current = props.value;
        colorRef.current = props.value;
    }

    const handleChange = (color: { hex: string; rgb: { r: number; g: number; b: number; a: number } }) => {
        const colorStr = color.rgb.a === 1 ? color.hex : `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
        colorRef.current = colorStr;
        forceUpdate();
    }

    const handleClose = () => {
        handleApply();
        setOpen(false);
    }

    const handleApply = () => {
        props.onChange?.(colorRef.current);
    }

    const handleInputChange = (event) => {
        colorRef.current = event.target.value;
        forceUpdate();
        handleApply();
    }

    return (
        <>
            <TextField
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <div style={{ backgroundColor: colorRef.current, width: '20px', height: '20px', borderRadius: '100%' }}></div>
                        </InputAdornment>
                    ),
                }}
                className={props.className}
                label={props.label}
                fullWidth
                value={colorRef.current}
                ref={inputAnchorRef}
                onChange={handleInputChange}
                onClick={() => setOpen(true)}
            />
            <Popper open={open} anchorEl={inputAnchorRef.current} placement={'bottom-start'} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <ClickAwayListener onClickAway={handleClose}>
                            <div>
                                <SketchPicker
                                    color={colorRef.current ?? '#000'}
                                    onChangeComplete={handleChange}
                                />
                            </div>
                        </ClickAwayListener>
                    </Fade>
                )}
            </Popper>
        </>
    )
}