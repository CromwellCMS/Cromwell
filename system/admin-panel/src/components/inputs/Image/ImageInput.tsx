import { PhotographIcon, XIcon, ZoomInIcon, ZoomOutIcon, ExternalLinkIcon } from '@heroicons/react/outline';
import React, { useCallback, useState } from 'react';

import { getFileManager } from '../../fileManager/helpers';
import { TextInput } from '../TextInput';

export type ImageInputProps = {
  toolTip?: string;
  placeholder?: string;
  label?: string;
  id?: string;
  width?: string | number;
  height?: string | number;
  onChange?: (value: string | undefined) => void;
  value?: string | null;
  className?: string;
  backgroundSize?:
  | "contain"
  | "cover"
  | "fill"
  | "contain"
  | "cover"
  | "none"
  | "scale-down";
  showRemove?: boolean;
  hideSrc?: boolean;
  classes?: {
    image?: string;
    root?: string;
  };
  style?: React.CSSProperties;
  variant?: "standard";
  centerImage?: boolean
};

export const ImageInput = ({ centerImage = true, ...props }: ImageInputProps) => {
  const [internalValue, setInternalValue] = useState<
    string | undefined
  >();
  const value =
    props.value !== undefined && props.value !== ""
      ? props.value
      : internalValue;
  const [zoom, setZoom] = useState(
    !(props?.backgroundSize === "contain"),
  );

  const { onChange } = props;

  const setImage = useCallback(
    (val: string | undefined) => {
      if (val === "") val = null;
      onChange?.(val);

      if (props.value === undefined) setInternalValue(val);
    },
    [onChange, setInternalValue],
  );

  const pickImage = useCallback(async () => {
    const photoPath = await getFileManager()?.getPhoto({
      initialFileLocation: value,
    });
    if (photoPath) {
      setImage(photoPath);
    }
  }, []);

  const getDimension = (dimension: string | number) =>
    dimension &&
    (typeof dimension === "number"
      ? dimension + "px"
      : dimension);
  const objectFit = zoom ? "cover" : "contain";

  const element = (
    <div
      className={`relative w-full h-64 ${props.className ?? ""
        }`}
      style={{ ...(props.style ?? {}) }}>
      {props.label && (
        <label
          htmlFor={props.id}
          className="font-bold block active:text-indigo-500">
          {props.label}
        </label>
      )}
      <div
        className={`rounded-md select-none overflow-hidden relative bg-gray-200 w-full h-[calc(100%-24px)] flex flex-col`}>
        {value && (
          <img
            className={`${zoom
              ? "h-full top-0 w-full"
              : "h-[calc(100%-44px)] top-2 w-[calc(100%-8px)]"
              } left-0 absolute rounded-sm`}
            src={value}
            style={{
              objectFit: objectFit,
            }}
          />
        )}
        <div
          onClick={pickImage}
          className={`bg-black bg-opacity-0 h-[calc(100%-16px)] w-full group block group-hover:bg-opacity-10`}>
          <div className="bg-black cursor-pointer flex h-full mx-auto bg-opacity-0 w-full self-center relative group-hover:bg-opacity-10">
            <span className="bg-black rounded-lg mx-auto bg-opacity-30 text-center text-xs text-white opacity-0 py-1 transform px-2 transition-all left-1/2 -translate-x-1/2 absolute self-center backdrop-filter backdrop-blur-md group-hover:opacity-100 ">
              Tap to choose image or copy link below
            </span>
            {value && props.showRemove && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setImage(undefined);
                }}
                className="rounded-full mx-auto bg-red-700 bg-opacity-60 text-center text-white opacity-0 py-1 transform px-1 transition-all top-1 right-1 absolute self-center hover:bg-opacity-100 group-hover:opacity-80 ">
                <XIcon className="h-4 w-4" />
              </span>
            )}
            {value && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setZoom((o) => !o);
                }}
                className="rounded-full mx-auto text-center text-white opacity-0 py-1 transform px-1 transition-all top-1 left-1 absolute self-center hover:bg-opacity-100 group-hover:opacity-100 ">
                {!zoom && (
                  <ZoomInIcon className="h-4 w-4" />
                )}
                {zoom && (
                  <ZoomOutIcon className="h-4 w-4" />
                )}
              </span>
            )}
            {value && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(value, '_balnk')
                }}
                className="rounded-full mx-auto text-center text-white opacity-0 py-1 transform px-1 transition-all top-1 left-6 absolute self-center hover:bg-opacity-100 group-hover:opacity-100 ">
                <ExternalLinkIcon className="h-4 w-4" />
              </span>
            )}
            {!value && (
              <PhotographIcon className="mx-auto h-24 w-full text-indigo-300 self-center" />
            )}
          </div>
        </div>
        {!props.hideSrc && (
          <TextInput
            id={props.id}
            name={props.id}
            value={value ?? ""}
            placeholder="tap on the icon or enter url here.."
            onChange={(e) => {
              setImage(e.target.value);
            }}
            className={`bg-black border-none ${value ? "bg-opacity-30" : "bg-opacity-0"} shadow-none text-stroke-sm stroke-light-50 backdrop-filter backdrop-blur-md !rounded-none !text-xs !text-white`}
          />
        )}
      </div>
    </div>
  );
  return element;
};
