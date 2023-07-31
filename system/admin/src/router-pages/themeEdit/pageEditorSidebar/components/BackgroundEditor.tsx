import { TCromwellBlock } from '@cromwell/core';
import React, { CSSProperties } from 'react';
import { ColorPickerField } from './ColorPickerField';

export const BackgroundEditor = ({
  styles,
  handleStyleChange,
}: {
  styles?: CSSProperties;
  block?: TCromwellBlock;
  handleStyleChange: (name: keyof React.CSSProperties, value: any) => void;
}) => {
  return (
    <>
      <p className="font-bold my-2 mt-0 text-xs uppercase">Background</p>
      <div className="grid gap-1 grid-cols-1">
        <ColorPickerField
          label="color"
          id="backgroundColor"
          value={styles?.backgroundColor || '#000000'}
          onChange={handleStyleChange}
        />
      </div>
      <hr className="my-2" />
    </>
  );
};
