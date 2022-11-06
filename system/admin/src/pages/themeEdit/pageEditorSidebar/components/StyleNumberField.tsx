import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import { SlideableNumberInput } from '../SlideableNumberInput';

const getUnit = (value?: any) => {
  const strVal = String(value);

  if (strVal.includes('vh')) return 'vh';
  if (strVal.includes('rem')) return 'rem';
  if (strVal.includes('em')) return 'em';
  if (strVal.includes('vw')) return 'vw';
  if (strVal.includes('%')) return '%';
  return 'px';
};

const getWithoutUnit = (value?: any) => {
  const strVal = String(value);
  return strVal
    .replace('vh', '')
    .replace('vw', '')
    .replace('rem', '')
    .replace('em', '')
    .replace('%', '')
    .replace('px', '');
};

export const StyleNumberField = ({
  dataType = 'px',
  handleStyleChange,
  value = '',
  label,
  keyName,
  name,
  min,
  max,
  options = [],
}: {
  dataType: 'px' | 'string' | 'rem' | '%' | 'em' | 'vh' | 'vw';
  handleStyleChange: (name: keyof React.CSSProperties, value: any, withType?: any) => void;
  keyName: keyof CSSProperties;
  value: any;
  name?: string;
  label: string;
  min?: number;
  max?: number;
  options?: string[];
}) => {
  const [internalValue, setInternalValue] = useState(getWithoutUnit(value));
  const [dType, setDataType] = useState<'px' | 'rem' | '%' | 'em' | 'vh' | 'vw'>(getUnit(value));

  const onChangeValue = useCallback(
    (newVal, forceType = dType) => {
      setInternalValue(newVal);
      handleStyleChange(keyName, newVal, forceType);
    },
    [setInternalValue, handleStyleChange, dType],
  );

  useEffect(() => {
    setInternalValue(getWithoutUnit(value));
    setDataType(getUnit(value));
  }, [value]);

  return (
    <SlideableNumberInput
      label={label}
      value={internalValue}
      setValue={onChangeValue}
      max={max}
      min={min}
      dataType={dType}
      onDataTypeChange={(newType) => {
        setDataType(newType);
        onChangeValue(internalValue, newType);
      }}
    />
  );
};
