import { TCromwellBlock } from "@cromwell/core";
import { Switch } from "@headlessui/react";
import React, { CSSProperties, useCallback, useEffect, useState, } from "react"
import { StyleNumberField } from "./StyleNumberField";

export const MarginEditor = ({
  styles,
  handleStyleChange,
  block
}: {
  styles?: CSSProperties;
  handleStyleChange: (
    name: keyof React.CSSProperties,
    value: any,
  ) => void;
  block?: TCromwellBlock;
}) => {
  const [individual, setIndividual] = useState(false);
  const [mxAuto, setMXAuto] = useState(
    styles?.marginLeft === "auto" &&
      styles?.marginRight === "auto",
  );

  const toggleMXAuto = useCallback(
    (newValue) => {
      setMXAuto(newValue);
      if (newValue) {
        // setStyle("0 auto");
        handleStyleChange("marginLeft", "auto");
        handleStyleChange("marginRight", "auto");
      } else {
        handleStyleChange("marginLeft", "");
        handleStyleChange("marginRight", "");
      }
    },
    [setMXAuto, handleStyleChange],
  );

  const toggleIndividual = useCallback((next) => {
    if (next) {
      handleStyleChange("margin", "");
    } else {
      handleStyleChange("marginLeft", "");
      handleStyleChange("marginRight", "");
      handleStyleChange("marginTop", "");
      handleStyleChange("marginBottom", "");
      setMXAuto(false);
    }
    setIndividual(next);
  }, [handleStyleChange])

  useEffect(() => {
    setMXAuto(
      styles?.marginLeft === "auto" &&
        styles?.marginRight === "auto",
    );
    setIndividual(
      !!styles?.marginLeft || !!styles?.marginTop || !!styles?.marginBottom || !!styles.marginRight
    )
  }, [styles]);

  return (
    <>
      <p className="my-2 mt-4 text-xs uppercase">Margin</p>
      <div className="mb-2">
        <Switch
          checked={individual}
          onChange={toggleIndividual}
          className={`${
            individual ? "bg-indigo-600" : "bg-gray-200"
          } relative inline-flex items-center h-4 rounded-full w-8`}>
          <span
            className={`${
              individual ? "translate-x-5" : "translate-x-1"
            } inline-block w-2 h-2 transform bg-white rounded-full`}
          />
        </Switch>
        <span className="ml-2 text-gray-600">
          individual
        </span>
      </div>
      {individual && (
        <>
          <div className="mb-2">
            <Switch
              checked={mxAuto}
              onChange={toggleMXAuto}
              className={`${
                mxAuto ? "bg-indigo-600" : "bg-gray-200"
              } relative inline-flex items-center h-4 rounded-full w-8`}>
              <span
                className={`${
                  mxAuto ? "translate-x-5" : "translate-x-1"
                } inline-block w-2 h-2 transform bg-white rounded-full`}
              />
            </Switch>
            <span className="ml-2 text-gray-600">
              mx auto
            </span>
          </div>
          <div className={`grid gap-1 grid-cols-2`}>
            {!mxAuto && (
              <>
                <StyleNumberField
                  value={styles.marginLeft}
                  keyName="marginLeft"
                  label="L"
                  min={0}
                  handleStyleChange={handleStyleChange}
                  dataType="px"
                />

                <StyleNumberField
                  value={styles.marginRight}
                  keyName="marginRight"
                  label="R"
                  min={0}
                  handleStyleChange={handleStyleChange}
                  dataType="px"
                />
              </>
            )}

            <StyleNumberField
              value={styles.marginTop}
              keyName="marginTop"
              label="T"
              min={0}
              handleStyleChange={handleStyleChange}
              dataType="px"
            />

            <StyleNumberField
              value={styles.marginBottom}
              keyName="marginBottom"
              label="B"
              min={0}
              handleStyleChange={handleStyleChange}
              dataType="px"
            />
          </div>
        </>
      )}
      {!individual && (
        <div className="grid gap-1 grid-cols-2">
          <StyleNumberField
            value={styles.margin}
            keyName="margin"
            label="M"
            min={0}
            handleStyleChange={handleStyleChange}
            dataType="px"
          />
        </div>
      )}
    </>
  );
};