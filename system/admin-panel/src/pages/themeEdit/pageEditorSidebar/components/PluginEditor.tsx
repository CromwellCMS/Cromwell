import { TCromwellBlock } from '@cromwell/core';
import React, { useState } from 'react';
import { usePageBuilder } from '../../hooks/usePageBuilder';
import { useThemeEditor } from '../../hooks/useThemeEditor';
import { EditorBlockEditor } from './EditorBlockEditor';
import { HTMLBlockEditor } from './HTMLBlockEditor';
import { ImageBlockEditor } from './ImageBlockEditor';
import { TextBlockEditor } from './TextBlockEditor';
import { ThirdPartyPluginEditor } from './ThirdPartyPluginEditor';

export const PluginEditor = ({
  block,
  setSidebarWidth = () => {},
}: {
  block?: TCromwellBlock;
  setSidebarWidth?: any;
}) => {
  // console.log("BLOG RERENDER", block);
  const data = block?.getData();
  const { createBlockProps, updateFramesPosition } = usePageBuilder();
  // const [data, setData] = useState(block?.getData());
  const { forceUpdate } = useThemeEditor();
  const [showHelp, setShowHelp] = useState(false);

  const blockProps = createBlockProps(block);

  const type = data?.type;

  return (
    <div className="h-full">
      <div className="text-xs w-full p-2">
        <div className="-mt-2 mb-2">
          <p onClick={() => setShowHelp((k) => !k)} className="cursor-pointer font-bold text-gray-600">
            How does it work?
          </p>
          {showHelp && (
            <p className="text-xs text-gray-500">
              This is the plugin editor for blocks and plugins. Changing Settings here will configure your plugin!
            </p>
          )}
        </div>
      </div>
      {type === 'text' && <TextBlockEditor block={block} />}
      {type === 'HTML' && <HTMLBlockEditor block={block} />}
      {type === 'image' && <ImageBlockEditor block={block} />}
      {type === 'editor' && <EditorBlockEditor block={block} setSidebarWidth={setSidebarWidth} />}
      {/* <ThirdPartyPluginEditor /> */}
    </div>
  );
};
