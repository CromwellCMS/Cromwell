import { TCromwellBlock } from "@cromwell/core"
import React, { useState } from "react"
import { usePageBuilder } from "../../hooks/usePageBuilder";
import { useThemeEditor } from "../../hooks/useThemeEditor";
import { TextBlockEditor } from "./TextBlockEditor";
import { ThirdPartyPluginEditor } from "./ThirdPartyPluginEditor";

export const PluginEditor = ({
  block,
}: {
  block?: TCromwellBlock;
}) => {
  console.log("BLOG RERENDER", block);
  const data = block?.getData();
  const { createBlockProps, updateFramesPosition } =
    usePageBuilder();
  // const [data, setData] = useState(block?.getData());
  const { forceUpdate } = useThemeEditor();
  const [showHelp, setShowHelp] = useState(false);

  const blockProps = createBlockProps(block);

  const type = data?.type;

  return (
    <div>
      <div className="text-xs w-full p-2">
      <div className="-mt-2 mb-2">
          <p
            onClick={() => setShowHelp((k) => !k)}
            className="cursor-pointer font-bold text-gray-600">
            How does it work?
          </p>
          {showHelp && (
            <p className="text-xs text-gray-500">
              This is the plugin editor for blocks and
              plugins. Changing Settings here will configure your plugin!
            </p>
          )}
        </div>
      </div>
      { type === 'text' && <TextBlockEditor block={block} />}
      {/* <ThirdPartyPluginEditor /> */}
    </div>
  )
}