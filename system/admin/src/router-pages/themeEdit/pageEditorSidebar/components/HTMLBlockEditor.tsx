import { CodeEditor } from '@components/inputs/CodeEditor';
import { TCromwellBlock } from '@cromwell/core';
import { useForceUpdate } from '@cromwell/core-frontend';
import React from 'react';

import { usePageBuilder } from '../../hooks/usePageBuilder';
import { useThemeEditor } from '../../hooks/useThemeEditor';

export const HTMLBlockEditor = ({ block }: { block?: TCromwellBlock }) => {
  const data = block?.getData();
  const blockValue = data.html?.innerHTML as string;

  const rerender = useForceUpdate();
  const { createBlockProps } = usePageBuilder();
  const { forceUpdate } = useThemeEditor();
  const blockProps = createBlockProps(block);

  const setBlockValue = (value: string) => {
    const data = block?.getData();
    if (data) {
      if (!data.html) data.html = {};
      data.html.innerHTML = value;
    }
    blockProps.modifyData?.(data);
    rerender();
    forceUpdate();
    block?.forceUpdate();
  };

  return (
    <div className="text-xs p-2">
      <p className="font-bold text-xs uppercase">html block</p>
      <span className="font-bold mt-3 text-xs block">code</span>
      <CodeEditor
        className="bg-white rounded-lg min-h-[250px]"
        language="html"
        value={blockValue}
        onChange={(e) => setBlockValue(e.target.value)}
      />
    </div>
  );
};
