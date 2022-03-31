import React, { CSSProperties, useCallback, useEffect, useState } from "react"
import { SlideableNumberInput } from "../SlideableNumberInput";

export const StyleNumberField = ({
  dataType = "px",
  handleStyleChange,
  value = "",
  label,
  keyName,
  name,
  min,
  max,
  options = [],
}: {
  dataType: "px" | "string" | "color" | "select";
  handleStyleChange: (
    name: keyof React.CSSProperties,
    value: any,
  ) => void;
  keyName: keyof CSSProperties;
  value: any;
  name?: string;
  label: string;
  min?: number;
  max?: number;
  options?: string[];
}) => {
  const [internalValue, setInternalValue] = useState(value);

  const onChangeValue = useCallback(
    (newVal) => {
      setInternalValue(newVal);
      handleStyleChange(keyName, newVal);
    },
    [setInternalValue, handleStyleChange],
  );

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <SlideableNumberInput
      label={label}
      value={internalValue}
      setValue={onChangeValue}
      max={max}
      min={min}
    />
  );
};