import { TCromwellBlock } from '@cromwell/core';
import React, { useEffect } from 'react';

import { destroyEditor, getEditorData, getEditorHtml, initTextEditor } from '../../../../helpers/editor/editor';
import { usePageBuilder } from '../../hooks/usePageBuilder';

const editorId = 'blockEditor';

export const EditorBlockEditor = ({
  block,
  setSidebarWidth = () => {},
}: {
  block?: TCromwellBlock;
  setSidebarWidth?: any;
}) => {
  const { createBlockProps, updateFramesPosition } = usePageBuilder();
  const data = block?.getData();
  // const blockValue = data.html?.innerHTML as string;
  // const editor = useRef()

  useEffect(() => {
    setSidebarWidth(850);
  }, []);

  useEffect(() => {
    const init = async () => {
      const bData = block?.getData();
      const blockProps = createBlockProps(block);
      const handler = () => {
        requestAnimationFrame(async () => {
          const nextData = block?.getData();
          if (!nextData) return;
          const editorData = await getEditorData(editorId);
          const html = await getEditorHtml(editorId, editorData);

          if (!nextData.editor) nextData.editor = {};
          nextData.editor.data = JSON.stringify(editorData);
          nextData.editor.html = html;
          blockProps.modifyData(nextData);
          requestAnimationFrame(() => {
            updateFramesPosition();
          });
        });
      };

      await initTextEditor({
        htmlId: editorId,
        data: JSON.parse(bData?.editor?.data ?? null),
        onChange: handler,
      });
    };

    init();

    return () => {
      destroyEditor(editorId);
    };
  }, [block]);

  return (
    <div className="text-xs p-2">
      <p className="font-bold text-xs uppercase">Editor block</p>
      <span className="font-bold mt-3 text-xs block">content</span>
      <div id={editorId} />
    </div>
  );
};
