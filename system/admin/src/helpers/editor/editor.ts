import type { API, BlockAPI, OutputData } from '@editorjs/editorjs';

import { getFileManager } from '../../components/fileManager/helpers';
import { toast } from '../../components/toast/toast';
import { getCustomHtmlClass } from './customHtml/CustomHtml';
import { FontSize } from './fontSize/FontSize';

let EditorJS: typeof import('@editorjs/editorjs');
let EditorHeader: typeof import('@editorjs/header');
let EditorList: typeof import('@editorjs/list');
let EditorImage: any; // typeof import('@editorjs/image');
let EditorEmbed: any; // typeof import('@editorjs/embed');
let EditorQuote: any; // typeof import('@editorjs/quote');
let EditorDelimiter: any; // typeof import('@editorjs/delimiter');
// let EditorRaw: typeof import('@editorjs/raw');
let EditorTable: typeof import('@editorjs/table');
let EditorMarker: typeof import('@editorjs/marker');
let EditorCode: typeof import('@editorjs/code');
let EditorLink: typeof import('@editorjs/link');
let EditorWarning: typeof import('@editorjs/warning');

const importDependencies = async () => {
  if (!EditorJS) {
    [
      EditorJS,
      EditorHeader,
      EditorList,
      EditorImage,
      EditorEmbed,
      EditorQuote,
      EditorDelimiter,
      // EditorRaw,
      EditorTable,
      EditorMarker,
      EditorCode,
      EditorLink,
      EditorWarning,
    ] = await Promise.all([
      import('@editorjs/editorjs'),
      import('@editorjs/header'),
      import('@editorjs/list'),
      import('@cromwell/editorjs-image'),
      import('@editorjs/embed'),
      import('@editorjs/quote'),
      import('@editorjs/delimiter'),
      // import('@editorjs/raw'),
      import('@editorjs/table'),
      import('@editorjs/marker'),
      import('@editorjs/code'),
      import('@editorjs/link'),
      import('@editorjs/warning'),
    ]);
  }
};

const getTools = (onChange?: (...args) => any, readOnly?: boolean) => ({
  image: {
    class: EditorImage.default,
    inlineToolbar: !readOnly,
    config: readOnly
      ? undefined
      : {
          onSelectFile: async () => {
            return getFileManager()?.getPhoto();
          },
          uploader: {
            uploadByFile: () => {
              toast.error('Please upload image via File manager');
              return new Promise<any>((done) =>
                done({
                  success: 0,
                }),
              );
            },
            uploadByUrl: (url: string) => {
              if (url.startsWith(window.location.origin)) {
                return new Promise<any>((done) =>
                  done({
                    success: 1,
                    file: {
                      url,
                    },
                  }),
                );
              } else {
                toast.error('Please upload image via File manage');
                return new Promise<any>((done) =>
                  done({
                    success: 0,
                  }),
                );
              }
            },
          },
        },
  },
  header: {
    class: EditorHeader.default,
    inlineToolbar: !readOnly,
  },
  list: {
    class: EditorList.default,
    inlineToolbar: !readOnly,
  },
  embed: {
    class: EditorEmbed.default,
    inlineToolbar: !readOnly,
  },
  quote: {
    class: EditorQuote.default,
    inlineToolbar: !readOnly,
  },
  delimiter: {
    class: EditorDelimiter.default,
    inlineToolbar: !readOnly,
  },
  // raw: {
  //     class: EditorRaw.default,
  //     inlineToolbar: true,
  // },
  table: {
    class: EditorTable.default,
    inlineToolbar: !readOnly,
  },
  Marker: {
    class: EditorMarker.default,
    inlineToolbar: !readOnly,
    shortcut: 'CMD+SHIFT+M',
  },
  'code editor': {
    class: EditorCode.default,
    inlineToolbar: true,
  },
  linkTool: {
    class: EditorLink.default,
    inlineToolbar: !readOnly,
  },
  warning: {
    class: EditorWarning.default,
    inlineToolbar: !readOnly,
  },
  fontSize: FontSize,
  customHtml: getCustomHtmlClass(onChange),
});

const editors: Record<string, EditorJS.default> = {};

export const initTextEditor = async (options: {
  htmlId: string;
  placeholder?: string;
  container?: HTMLElement | null;
  data?: any;
  autofocus?: boolean;
  onChange?: (api: API, block: BlockAPI) => any;
}): Promise<void> => {
  const { htmlId, data, onChange, placeholder, autofocus } = options;

  await importDependencies();

  if (editors[htmlId]) {
    await editors[htmlId].isReady;
    if (typeof editors[htmlId]?.destroy === 'function') await editors[htmlId].destroy();
    delete editors[htmlId];
  }

  const container = options.container || document.querySelector(`#${htmlId}`);
  if (!container) {
    console.error('initTextEditor: Failed to find container by id: ' + htmlId);
    return;
  }
  container.classList.add('crw-text-editor');

  const editor = new EditorJS.default({
    holder: htmlId,
    data: data,
    // readOnly: true,
    minHeight: 0,
    tools: {
      ...getTools(onChange, false),
    },
    onChange,
    autofocus,
    placeholder: placeholder ?? 'Let`s write an awesome story!',
  });
  editors[htmlId] = editor;
  await editor.isReady;
};

export const getEditorHtml = async (htmlId: string, data?: OutputData) => {
  if (!data) data = await getEditorData(htmlId);
  if (!data) return;

  const saverId = 'editorSaverContainer';

  let editor = editors['saver'];
  let saverContainer = document.getElementById(saverId);

  if (editor) {
    await editor.isReady;
    await editor.render(data);
    await editor.isReady;
  } else {
    saverContainer = document.createElement('div');
    saverContainer.id = saverId;
    saverContainer.style.display = 'none';
    document.body.appendChild(saverContainer);

    editor = new EditorJS.default({
      holder: saverId,
      data: data,
      minHeight: 0,
      readOnly: true,
      autofocus: false,
      tools: {
        ...getTools(() => null, true),
      },
    });
    await editor.isReady;
  }

  editors['saver'] = editor;

  const redactor = saverContainer?.querySelector('.codex-editor__redactor');
  if (!redactor) return null;

  (redactor as any).style = null;
  redactor.querySelectorAll('*').forEach((element) => {
    element.removeAttribute('contentEditable');
    element.removeAttribute('data-placeholder');
  });

  redactor.querySelectorAll('.embed-tool__url').forEach((el) => el.remove());
  redactor.querySelectorAll('.embed-tool__caption').forEach((el) => el.remove());
  redactor.querySelectorAll('iframe.embed-tool__content').forEach((el) => el.classList.remove('embed-tool__content'));

  const content = redactor.outerHTML;
  return content;
};

export const getEditorData = async (htmlId: string): Promise<OutputData | undefined> => {
  const editor = editors[htmlId];
  if (!editor || typeof editor.save !== 'function') {
    return;
  }
  return await editor.save();
};

export const destroyEditor = async (htmlId: string) => {
  const editor = editors[htmlId];
  if (!editor) {
    return;
  }
  if (typeof editor.destroy === 'function') await editor.destroy();
  delete editors[htmlId];
};
