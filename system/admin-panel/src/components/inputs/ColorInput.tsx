import { Popover } from '@mui/material';
import React, { useRef, useState } from 'react';
import { SketchPicker } from 'react-color';

import { useForceUpdate } from '../../helpers/forceUpdate';
import { TextInput } from './TextInput';

export type ColorInputProps = {
  label?: string;
  value?: string;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (color: string) => void;
}

export function ColorInput(props: ColorInputProps) {
  const colorRef = useRef<string | null>(null);
  const prevValue = useRef<string | null>(null);
  const inputAnchorRef = useRef<HTMLInputElement | null>(null);
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
      <TextInput
        startAdornment={(
          <div className="flex items-center mr-2">
            <div className="w-8 h-8 rounded-full border-2 cursor-pointer" style={{ backgroundColor: colorRef.current }}></div>
          </div>
        )}
        className={props.className}
        label={props.label}
        value={colorRef.current}
        ref={inputAnchorRef}
        onChange={handleInputChange}
        onClick={() => setOpen(true)}
        style={props.style}
      />
      <Popover
        open={open}
        anchorEl={inputAnchorRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div>
          <SketchPicker
            color={colorRef.current ?? '#000'}
            onChangeComplete={handleChange}
          />
        </div>
      </Popover>
    </>
  )
}