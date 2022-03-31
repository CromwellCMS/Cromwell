import { TCromwellBlock } from "@cromwell/core";
import { useForceUpdate } from "@cromwell/core-frontend";
import React from "react";
import { usePageBuilder } from "../../hooks/usePageBuilder";
import { useThemeEditor } from "../../hooks/useThemeEditor";

export const TextBlockEditor = ({
  block,
}: {
  block?: TCromwellBlock;
}) => {
  const data = block?.getData();
  const blockValue =
    data?.text?.content ??
    (block?.props.children as string);
  const rerender = useForceUpdate();
  const { createBlockProps } = usePageBuilder()
  const { forceUpdate } = useThemeEditor();
  const blockProps = createBlockProps(block);

  const setBlockValue = (value: string) => {
    const data = block?.getData();
    if (data) {
      if (!data.text) data.text = {};
      data.text.content = value;
    }
    blockProps.modifyData?.(data)
    rerender();
    forceUpdate();
    block?.forceUpdate()

    // console.log(block?.getData())
  };

  const handleChangeLink = (value: string) => {
    const data = block?.getData();
    if (!data.text) data.text = {};
    if (!value || value === "") value = undefined;
    data.text.href = value;
    blockProps.modifyData?.(data)

    // modifyData()
    rerender();
    block?.rerender();
  };

  return (
    <div className="text-xs p-2">
      <p className="font-bold text-xs uppercase">
        textblock
      </p>
      <p className="">Content</p>
      <textarea
        className="border border-gray-300 my-2 w-full"
        rows={10}
        value={blockValue}
        onChange={(e) => {
          setBlockValue(e.target.value);
        }}
      />
    </div>
  );
};
