import { XCircleIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import { useDropdown } from '../../hooks/useDocumentEvents';
import { useDebounceFn } from '../../hooks/useDebounce';

export const ColorPickerField = ({
  value = null,
  onChange = () => {},
  label = 'color',
  id = 'color',
  top = false,
}: {
  value?: any;
  onChange?: any;
  label?: string;
  id?: string;
  top?: boolean;
}) => {
  const [pickerRef, isOpen, setIsOpen] = useDropdown<HTMLDivElement>();
  const [internalValue, setInternalValue] = useState<string | undefined | null>(value);
  const updateValue = useDebounceFn(onChange, 500);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div className="font-bold mt-2 text-xs w-full" ref={pickerRef}>
      <p>{label}</p>
      <div className="border rounded-md border-indigo-600 border-opacity-0 w-21 group hover:border-opacity-50 active:border-opacity-100 focus-within:border-opacity-100 hover:focus-within:border-opacity-100">
        <div className="w-[calc(100%-20px)] relative inline-block">
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              backgroundColor: value,
            }}
            className="border-b outline-none border-gray-200 h-[8px] text-right w-full px-1 relative inline-block appearance-none"
          ></button>
          {isOpen && (
            <div className={`top-6 ${top ? 'transform -translate-y-full' : ''} z-[80] absolute`}>
              <SketchPicker
                color={internalValue || '#000000'}
                onChangeComplete={({ rgb: { r, g, b, a } }) => {
                  // onChange(id, `rgba(${r},${g},${b},${a})`);
                  updateValue(id, `rgba(${r},${g},${b},${a})`);
                  setInternalValue(`rgba(${r},${g},${b},${a})`);
                }}
              />
            </div>
          )}
        </div>
        <XCircleIcon
          onClick={() => onChange(id, '')}
          width="16px"
          height="16px"
          className="text-white ml-1 inline-block group-hover:text-gray-400"
        />
      </div>
    </div>
  );
};
