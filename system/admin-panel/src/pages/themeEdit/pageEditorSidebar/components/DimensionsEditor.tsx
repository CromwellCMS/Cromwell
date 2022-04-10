import { TCromwellBlock } from "@cromwell/core";
import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import { MarginEditor } from "./MarginEditor";
import { PaddingEditor } from "./PaddingEditor";
import { StyleNumberField } from "./StyleNumberField";

export const DimensionsEditor = ({
  styles,
  handleStyleChange,
  block,
}: {
  styles?: CSSProperties;
  block?: TCromwellBlock;
  handleStyleChange: (
    name: keyof React.CSSProperties,
    value: any,
    withType?: string,
  ) => void;
}) => {

  const handleRadius = useCallback((name: keyof React.CSSProperties, value: any, unit?: string) => {
    const data = block?.getData();
    const type = data?.type;

    if (type === 'image') {
      if (value === "" || !value) {
        handleStyleChange("overflow", null);
      } else {
        handleStyleChange("overflow", "hidden");
      }
    }

    handleStyleChange(name, value, unit);
  }, [handleStyleChange])

  return (
    <>
      <p className="font-bold my-2 mt-0 text-xs uppercase">Size</p>
      <div className="grid gap-1 grid-cols-2">
        <StyleNumberField
          value={styles.width}
          keyName="width"
          label="W"
          min={0}
          handleStyleChange={handleStyleChange}
          dataType="px"
        />

        <StyleNumberField
          value={styles.height}
          keyName="height"
          label="H"
          min={0}
          handleStyleChange={handleStyleChange}
          dataType="px"
        />

        <StyleNumberField
          value={styles.borderRadius}
          keyName="borderRadius"
          label="⛶"
          min={0}
          handleStyleChange={handleRadius}
          dataType="px"
        />
      </div>

      <hr className="my-2" />
      <MarginEditor
        handleStyleChange={handleStyleChange}
        styles={styles}
        block={block}
      />

      <hr className="my-2" />
      <PaddingEditor
        handleStyleChange={handleStyleChange}
        styles={styles}
        block={block}
      />
      <hr className="my-2" />
    </>
  );
};
