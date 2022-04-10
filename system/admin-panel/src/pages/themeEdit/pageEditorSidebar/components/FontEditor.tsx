import { TCromwellBlock } from "@cromwell/core";
import {
  MenuAlt2Icon,
  MenuAlt3Icon,
  MenuAlt4Icon,
  MenuIcon,
} from "@heroicons/react/outline";
import { XCircleIcon } from "@heroicons/react/solid";
import React, {
  CSSProperties,
  useEffect,
  useState,
} from "react";
import { ColorPickerField } from "./ColorPickerField";
import { MarginEditor } from "./MarginEditor";
import { PaddingEditor } from "./PaddingEditor";
import { SelectableField } from "./SelectableField";
import { StyleNumberField } from "./StyleNumberField";

const weights = [
  { title: "Thin", value: "100" },
  { title: "Extra Light", value: "200" },
  { title: "Light", value: "300" },
  { title: "Normal", value: "400" },
  { title: "Medium", value: "500" },
  { title: "Semi Bold", value: "600" },
  { title: "Bold", value: "700" },
  { title: "Extra Bold", value: "800" },
  { title: "Black", value: "900" },
  { title: "Extra Black", value: "950" },
];

const fontSizes = [
  { title: "[xs] Extra Small", value: {
    fontSize: "0.75rem",
    lineHeight: "1rem",
  } },
  { title: "[sm] Small", value: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  } },
  { title: "[base] Regular", value: {
    fontSize: "1rem",
    lineHeight: "1.5rem",
  } },
  { title: "[lg] Large", value: {
    fontSize: "1.125rem",
    lineHeight: "1.75rem",
  } },
  { title: "[xl] X-Large", value: {
    fontSize: "1.25rem",
    lineHeight: "1.75rem",
  } },
  { title: "[2xl] XX-Large", value: {
    fontSize: "1.5rem",
    lineHeight: "2rem",
  } },
  { title: "[3xl] XXX-Large", value: {
    fontSize: "1.875rem",
    lineHeight: "2.25rem",
  } },
  { title: "[4xl] XXXX-Large", value: {
    fontSize: "2.25rem",
    lineHeight: "2.5rem",
  } },
  { title: "[5xl] Giant", value: {
    fontSize: "3rem",
    lineHeight: "1",
  } },
  { title: "[6xl] X-Giant", value: {
    fontSize: "3.75rem",
    lineHeight: "1",
  } },
  { title: "[7xl] XX-Giant", value: {
    fontSize: "4.5rem",
    lineHeight: "1",
  } },
  { title: "[8xl] XXX-Giant", value: {
    fontSize: "6rem",
    lineHeight: "1",
  } },
  { title: "[9xl] Massive", value: {
    fontSize: "8rem",
    lineHeight: "1",
  } },
]

const MenuCenterIcon = (props: React.HTMLAttributes<SVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="m4,6l16,0m-12,6l8,0m-12,6l16,0" />
</svg>
  )
}
{/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
</svg> */}

export const FontEditor = ({
  styles,
  handleStyleChange,
  block,
}: {
  styles?: CSSProperties;
  block?: TCromwellBlock;
  handleStyleChange: (
    name: keyof React.CSSProperties,
    value: any,
  ) => void;
}) => {
  const styleWeight =
    weights.find((k) => k.value === styles?.fontWeight) ??
    weights[3];
  
  const styleFontSize = fontSizes.find((k) => k.value.fontSize === styles?.fontSize) ?? { title: "-" }
  return (
    <>
      <p className="font-bold my-2 mt-0 text-xs uppercase">
        Text
      </p>
      <div className="grid gap-1 grid-cols-1">
        <ColorPickerField
          label="color"
          id="color"
          value={styles?.color || "#000000"}
          onChange={handleStyleChange}
        />
        {/* </div> */}

        <div className="font-bold mt-2 text-xs w-full">
          <p>weight</p>
          <div className="border rounded-md border-indigo-600 border-opacity-0 w-21 group hover:border-opacity-50 active:border-opacity-100 focus-within:border-opacity-100 hover:focus-within:border-opacity-100">
            <SelectableField
              value={styleWeight}
              onChange={(next) =>
                handleStyleChange("fontWeight", next.value)
              }
              options={weights}
            />
          </div>
        </div>
        <div className="font-bold mt-2 text-xs w-full">
          <p>size</p>
          <div className="border rounded-md border-indigo-600 border-opacity-0 w-21 group hover:border-opacity-50 active:border-opacity-100 focus-within:border-opacity-100 hover:focus-within:border-opacity-100">
            <SelectableField
              value={styleFontSize}
              top
              onChange={(next) => {
                if (next.value === "") {
                  handleStyleChange("fontSize", null);
                  handleStyleChange("lineHeight", null);
                } else {
                  handleStyleChange("fontSize", next.value.fontSize)
                  handleStyleChange("lineHeight", next.value.lineHeight)
                }
              }}
              options={fontSizes}
            />
          </div>
        </div>
        
        <p className="font-bold mt-2 text-xs w-full">alignment</p>
        <div className="mt-0 grid gap-2 grid-cols-4">
          <button
            className={`${
              styles?.textAlign === "left"
                ? "bg-indigo-100"
                : ""
            } text-black text-center rounded-md hover:bg-indigo-600 hover:text-white`}
            onClick={() =>
              handleStyleChange("textAlign", "left")
            }>
            <MenuAlt2Icon className="mx-auto h-4 w-4" />
          </button>
          <button
            className={`${
              styles?.textAlign === "right"
                ? "bg-indigo-100"
                : ""
            } text-black text-center rounded-md hover:bg-indigo-600 hover:text-white`}
            onClick={() =>
              handleStyleChange("textAlign", "right")
            }>
            <MenuAlt3Icon className="mx-auto h-4 w-4" />
          </button>
          <button
            className={`${
              styles?.textAlign === "center"
                ? "bg-indigo-100"
                : ""
            } text-black text-center rounded-md hover:bg-indigo-600 hover:text-white`}
            onClick={() =>
              handleStyleChange("textAlign", "center")
            }>
            <MenuCenterIcon className="mx-auto h-4 w-4" />
          </button>
          <button
            className={`${
              styles?.textAlign === "justify"
                ? "bg-indigo-100"
                : ""
            } text-black text-center rounded-md hover:bg-indigo-600 hover:text-white`}
            onClick={() =>
              handleStyleChange("textAlign", "justify")
            }>
            <MenuIcon className="mx-auto h-4 w-4" />
          </button>
        </div>

        {/* <StyleNumberField
          value={styles.height}
          keyName="height"
          label="H"
          min={0}
          handleStyleChange={handleStyleChange}
          dataType="px"
        /> */}
      </div>
      <hr className="my-2" />
    </>
  );
};
