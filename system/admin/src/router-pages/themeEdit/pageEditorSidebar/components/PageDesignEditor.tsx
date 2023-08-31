import { TCromwellBlock } from '@cromwell/core';
import React, { CSSProperties, useCallback, useState } from 'react';
import { usePageBuilder } from '../../hooks/usePageBuilder';
import { useThemeEditor } from '../../hooks/useThemeEditor';
import { BackgroundEditor } from './BackgroundEditor';
import { DimensionsEditor } from './DimensionsEditor';
import { FontEditor } from './FontEditor';
import { ShadowEditor } from './ShadowEditor';

export const PageDesignEditor = ({ block }: { block?: TCromwellBlock }) => {
  const data = block?.getData();
  const { createBlockProps, updateFramesPosition } = usePageBuilder();
  // const [data, setData] = useState(block?.getData());
  const { forceUpdate } = useThemeEditor();
  const [showHelp, setShowHelp] = useState(false);

  const blockProps = createBlockProps(block);

  const handleStyleChange = useCallback(
    (name: keyof CSSProperties, value: any, withType?: any) => {
      const newData = block?.getData?.();
      if (!newData?.id) return;
      if (!newData.style) newData.style = {};
      if (typeof newData.style === 'string') {
        newData.style = JSON.parse(newData.style);
      }
      if (value === null || value === '') {
        if (newData.style) delete newData.style[name];
      } else {
        if (!newData.style) newData.style = {};
        newData.style[name] = value + (withType ? withType : '');
      }

      blockProps.modifyData?.(newData);
      forceUpdate();
      updateFramesPosition();
    },
    [block, updateFramesPosition, forceUpdate],
  );

  // useEffect(() => {
  // const nextData = block?.getData()
  if (data && !data.style) data.style = {};
  if (typeof data?.style === 'string') data.style = JSON.parse(data?.style);

  //   setData(nextData);
  // }, [block]);

  if (!data) return null;
  if (!data?.style) return null;

  const styles = data?.style as CSSProperties;

  return (
    <div className="h-full text-xs w-full scrollbar-slim">
      <div className="w-full p-2">
        <div className="-mt-2 mb-2">
          <p onClick={() => setShowHelp((k) => !k)} className="cursor-pointer font-bold text-gray-600">
            How does it work?
          </p>
          {showHelp && (
            <p className="text-xs text-gray-500">
              This is the design editor for blocks and plugins. Changing Settings here will override the theme styling!
              If you want to reset the style of a block to theme defaults, press the X button on a field.
            </p>
          )}
        </div>
        <DimensionsEditor block={block} styles={styles} handleStyleChange={handleStyleChange} />
        <FontEditor block={block} styles={styles} handleStyleChange={handleStyleChange} />
        <BackgroundEditor block={block} styles={styles} handleStyleChange={handleStyleChange} />

        <ShadowEditor block={block} styles={styles} handleStyleChange={handleStyleChange} />
      </div>
    </div>
  );
};
