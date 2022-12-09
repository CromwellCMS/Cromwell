import React from 'react';
import type { TextareaCodeEditorProps } from '@uiw/react-textarea-code-editor';
import TextareaCodeEditor from '@uiw/react-textarea-code-editor/dist/editor.js';

export const CodeEditor = (props: TextareaCodeEditorProps & React.RefAttributes<HTMLTextAreaElement>) => {
  return <TextareaCodeEditor {...props} />;
};
