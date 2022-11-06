import { TCromwellBlock } from '@cromwell/core';
import React, { CSSProperties, useEffect, useState } from 'react';
import { ColorPickerField } from './ColorPickerField';
import { SelectableField } from './SelectableField';

const extractColor = (shadow?: string) => {
  if (!shadow || shadow === '') return 'rgba(0,0,0,0.05)';
  const hasClr = shadow?.includes('rgba');
  const shadowClrPos = shadow?.indexOf('rgba');

  if (hasClr) {
    return shadow.substring(shadowClrPos);
  }

  return 'rgba(0,0,0,0.05)';
};

const extractCurrentValue = (shadow?: string) => {
  if (!shadow || shadow === '') return 'none';
  if (shadow.startsWith('0 1px 3px')) return 'regular';
  if (shadow.startsWith('0 1px 2px')) return 'sm';
  if (shadow.startsWith('0 4px')) return 'md';
  if (shadow.startsWith('0 10px')) return 'lg';
  if (shadow.startsWith('0 20px')) return 'xl';
  if (shadow.startsWith('0 25px')) return '2xl';
  if (shadow.startsWith('inset')) return 'inner';
  if (shadow.startsWith('0 0 #00')) return 'none';

  return 'none';
};

const getDefaultColor = (shadow?: string, fallback?: string) => {
  const type = extractCurrentValue(shadow);
  const curColor = extractColor(fallback);

  if (curColor === 'rgba(0,0,0,0.05)') {
    switch (type) {
      case 'sm':
        return curColor;
      case 'inner':
        return curColor;
      case '2xl':
        return 'rgba(0,0,0,0.25)';
      case 'none':
        return '';
      default:
        return 'rgba(0,0,0,0.1)';
    }
  }

  return fallback;
};

const swapColor = (shadow?: string, replacement = 'rgba(0,0,0,0.05)') => {
  if (!shadow || shadow === '') return '';
  if (shadow.startsWith('0 0 #000')) return shadow;
  if (shadow.includes('#CLR')) return shadow.replace('#CLR', replacement).replace('#CLR', replacement);

  const currentShadow = extractCurrentValue(shadow);
  const option = shadowOptions.find((o) => o.value === currentShadow) ?? shadowOptions[shadowOptions.length - 1];

  return swapColor(option.value, replacement);
};

const shadowOptions = [
  { title: 'regular', value: '0 1px 3px 0 #CLR, 0 1px 2px -1px #CLR' },
  { title: 'sm', value: '0 1px 2px 0  #CLR' },
  { title: 'md', value: '0 4px 6px -1px #CLR, 0 2px 4px -2px #CLR' },
  { title: 'lg', value: '0 10px 15px -3px #CLR, 0 4px 6px -4px #CLR' },
  { title: 'xl', value: '0 20px 25px -5px #CLR, 0 8px 10px -6px #CLR' },
  { title: '2xl', value: '0 25px 50px -12px #CLR' },
  { title: 'inner', value: 'inset 0 2px 4px 0 #CLR' },
  { title: 'none', value: '0 0 #000000' },
];

export const ShadowEditor = ({
  styles,
  handleStyleChange,
  block,
}: {
  styles?: CSSProperties;
  block?: TCromwellBlock;
  handleStyleChange: (name: keyof React.CSSProperties, value: any) => void;
}) => {
  const shadowColor = extractColor(styles?.boxShadow);
  const [bgColor, setBgColor] = useState(shadowColor);
  const [internalValue, setInternalValue] = useState(styles?.boxShadow);

  const colorUpdate = (id, nextColor) => {
    console.log('NXT', nextColor, nextColor === '', extractColor('///'));
    if (nextColor === '' || !nextColor) {
      setBgColor(extractColor('///'));
    } else {
      setBgColor(nextColor);
    }
  };

  const shadowUpdate = (option: any) => {
    const nextShadow = option.value;
    setInternalValue(nextShadow);
  };

  useEffect(() => {
    if (internalValue && internalValue !== '') {
      handleStyleChange('boxShadow', swapColor(internalValue, getDefaultColor(internalValue, bgColor)));
    }
  }, [internalValue, bgColor]);

  const currentIdentifier = extractCurrentValue(internalValue);
  const currentValue =
    shadowOptions.find((s) => s.title === currentIdentifier) ?? shadowOptions[shadowOptions.length - 1];
  // console.log("SHADOW COLOR", shadowColor)
  return (
    <>
      <p className="font-bold my-2 mt-0 text-xs uppercase">Box Shadow</p>
      <div className="font-bold mt-2 text-xs w-full">
        <p>shadow</p>
        <div className="border rounded-md border-indigo-600 border-opacity-0 w-21 group hover:border-opacity-50 active:border-opacity-100 focus-within:border-opacity-100 hover:focus-within:border-opacity-100">
          <SelectableField top value={currentValue} options={shadowOptions} onChange={shadowUpdate} />
        </div>
      </div>
      <div className="grid gap-1 grid-cols-1">
        <ColorPickerField label="color" id="shadowClr" top value={shadowColor} onChange={colorUpdate} />
      </div>
      <hr className="my-2" />
    </>
  );
};
