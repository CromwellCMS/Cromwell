import { Listbox, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/solid";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const DragLabel = ({
  value = "",
  setValue,
  label = "-",
  min = -Infinity,
  max = Infinity,
  boundingRef = { current: null },
  dataType = "px"
}: {
  value?: any;
  setValue: any;
  label?: string;
  min?: number;
  max?: number;
  dataType?: "px" | "string" | "rem" | "%" | "em" | "vh" | "vw";
  boundingRef: React.MutableRefObject<HTMLDivElement>;
}) => {
  // We are creating a snapshot of the values when the drag starts
  // because the [value] will itself change & we need the original
  // [value] to calculate during a drag.
  const [snapshot, setSnapshot] = useState(value);

  // This captures the starting position of the drag and is used to
  // calculate the diff in positions of the cursor.
  const [startVal, setStartVal] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setSnapshot(value);
    }
  }, [value, isDragging])

  // Start the drag to change operation when the mouse button is down.
  const onStart = useCallback(
    (event) => {
      setIsDragging(true);
      // const rect = event.target.getBoundingClientRect();
      const rect = boundingRef.current?.getBoundingClientRect();
      const start = event.clientX - rect.left;
      const startingX = parseInt(
        `${Math.min(Math.max(min, start), max)}`,
        10,
      );
      setStartVal(startingX);
      const initialValue = value && value !== "" ? value : 0;
      setSnapshot(initialValue);
    },
    [value],
  );

  // We use document events to update and end the drag operation
  // because the mouse may not be present over the label during
  // the operation..
  useEffect(() => {
    // Only change the value if the drag was actually started.
    const onUpdate = (event) => {
      if (startVal) {
        const rect = boundingRef.current?.getBoundingClientRect();
        const posX = (event.clientX - rect.left) / 2
        const start = (posX) + snapshot;
        const nextVal = parseInt(
          `${Math.min(Math.max(min, start), max)}`,
          10,
        );
        setValue(nextVal);
      }
    };

    // Stop the drag operation now.
    const onEnd = () => {
      setStartVal(0);
      setIsDragging(false);
    };

    document.addEventListener("mousemove", onUpdate);
    document.addEventListener("mouseup", onEnd);
    return () => {
      document.removeEventListener("mousemove", onUpdate);
      document.removeEventListener("mouseup", onEnd);
    };
  }, [startVal, setValue, snapshot]);

  return (
    <span
      onMouseDown={onStart}
      className="cursor-ew-resize py-1 px-1 text-gray-400 select-none relative">
      <span className={`w-96 h-96 absolute right-0 -top-20 ${isDragging ? "" : "hidden"}`} />
      {label}
    </span>
  );
};

export const styleDataTypes = [
  "px",
  "rem",
  "%",
  "em",
  "vh",
  "vw"
]

export const SlideableNumberInput = ({
  value = "",
  setValue,
  label = "-",
  min = -Infinity,
  max = Infinity,
  dataType = "px",
  onDataTypeChange = () => {},
}: {
  value?: any;
  setValue?: any;
  label?: any;
  min: number;
  max: number;
  dataType?: "px" | "string" | "rem" | "%" | "em" | "vh" | "vw";
  onDataTypeChange?: any;
}) => {
  const boundingRef = useRef<HTMLDivElement>();

  const onInputChange = useCallback(
    (ev) => {
      const raw = parseInt(ev.target.value, 10);
      const nextVal = isNaN(raw) ? "" : raw;
      setValue(nextVal, dataType)
    },
    [dataType],
  );

  const resetValue = useCallback(() => {
    setValue("", "px");
  }, [setValue])

  return (
    <div
      ref={boundingRef}
      className="border rounded-md border-indigo-600 border-opacity-0 w-21 group hover:border-opacity-50 active:border-opacity-100 focus-within:border-opacity-100 hover:focus-within:border-opacity-100">
      <DragLabel
        value={value}
        setValue={setValue}
        boundingRef={boundingRef}
        label={label}
        min={min}
        max={max}
      />
      <input
        value={value}
        onChange={onInputChange}
        min={min}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        max={max}
        className="border-b outline-none border-gray-200 text-right py-1 pr-1 pl-0 w-[calc(100%-65px)] inline-block appearance-none"
      />
      <Listbox value={dataType} onChange={onDataTypeChange}>
        <div className="relative inline">
          <Listbox.Button className="py-1 text-gray-400 inline-block select-none relative">
            <span className="block truncate">{dataType}</span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="bg-white rounded-md shadow-lg ring-black mt-1 text-xs max-h-60 py-1 -right-3 ring-1 ring-opacity-5 w-14 z-[80] absolute overflow-auto focus:outline-none">
              {styleDataTypes.map((typ, typIdx) => (
                <Listbox.Option
                  key={typIdx}
                  className={({ active }) =>
                    `cursor-default select-none relative py-2 pl-2 pr-2 ${
                      active ? 'text-indigo-900 bg-indigo-100' : 'text-gray-900'
                    }`
                  }
                  value={typ}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {typ}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
          </div>
      </Listbox>
      {/* <span className="py-1 text-gray-400 inline-block select-none relative">{dataType}</span> */}
      <XCircleIcon
        onClick={resetValue}
        width="16px"
        height="16px"
        className="text-white ml-1 inline-block group-hover:text-gray-400" />
    </div>
  );
};
