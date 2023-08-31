import { getRandStr } from '@cromwell/core';
import { getEditorData, getEditorHtml, initTextEditor } from '@helpers/editor';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const CustomTextEditorInputField = ({ label, name }: { id?: string; label?: any; name?: string }) => {
  const [editorId] = useState('editor_' + getRandStr(12));
  const { setValue, getValues } = useFormContext();
  const editorDivRef = useRef<HTMLDivElement | null>(null);

  const initialValueRef = useRef<null | any>(getValues(name));

  const initEditor = async () => {
    let data:
      | {
          html: string;
          json: string;
        }
      | undefined = undefined;

    if (initialValueRef.current) {
      try {
        data = initialValueRef.current;
      } catch (error) {
        console.error(error);
      }
    }

    await initTextEditor({
      htmlId: editorId,
      data: data?.json,
      placeholder: 'Add your text...',
      container: editorDivRef.current,
      onChange: async () => {
        const json = await getEditorData(editorId);
        if (!json?.blocks?.length) return null;
        const html = await getEditorHtml(editorId);

        setValue(
          name,
          { json, html },
          {
            shouldDirty: true,
          },
        );
      },
    });
  };

  useEffect(() => {
    // initialValueRef.current = value;
    if (editorDivRef.current) initEditor();
  }, [editorDivRef.current]);

  return (
    <div className="col-span-2">
      <label className="group active:text-indigo-500">
        <p className="font-bold pb-1 pl-[2px] text-gray-700">{label}</p>
      </label>
      <div className="border rounded-lg shadow-md w-full py-3 px-3 col-span-2">
        <div id={editorId} ref={editorDivRef} className="min-h-[250px] w-full"></div>
      </div>
    </div>
  );
};
