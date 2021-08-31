import { API, BlockAPI, OutputData } from '@editorjs/editorjs';

import { getFileManager } from '../components/fileManager/helpers';
import { toast } from '../components/toast/toast';

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
// let EditorCode: typeof import('@editorjs/code');
let EditorLink: typeof import('@editorjs/link');
let EditorWarning: typeof import('@editorjs/warning');

let importPromise;
(async () => {
    let importResolver;
    importPromise = new Promise(done => {
        importResolver = done;
    });

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
            // EditorCode,
            EditorLink,
            EditorWarning,
        ] = await Promise.all([
            await import('@editorjs/editorjs'),
            await import('@editorjs/header'),
            await import('@editorjs/list'),
            await import('@cromwell/editorjs-image'),
            await import('@editorjs/embed'),
            await import('@editorjs/quote'),
            await import('@editorjs/delimiter'),
            // await import('@editorjs/raw'),
            await import('@editorjs/table'),
            await import('@editorjs/marker'),
            // await import('@editorjs/code'),
            await import('@editorjs/link'),
            await import('@editorjs/warning'),
        ]);
    }

    importResolver();
})();

const editors: Record<string, EditorJS.default> = {};

export const initTextEditor = async (options: {
    htmlId: string;
    placeholder?: string;
    data?: any;
    autofocus?: boolean;
    onChange?: (api: API, block: BlockAPI) => any;
}): Promise<void> => {
    const { htmlId, data, onChange, placeholder, autofocus } = options;

    if (importPromise) await importPromise;

    if (editors[htmlId]) {
        await editors[htmlId].isReady;
        if (typeof editors[htmlId]?.destroy === 'function')
            await editors[htmlId].destroy();
        delete editors[htmlId];
    }

    const container = document.querySelector(`#${htmlId}`);
    if (!container) {
        console.error('initTextEditor: Failed to find container by id: ' + htmlId);
        return;
    }
    container.classList.add('crw-text-editor');

    const editor = new EditorJS.default({
        holder: htmlId,
        data: data,
        minHeight: 0,
        tools: {
            header: {
                class: EditorHeader.default,
                inlineToolbar: true
            },
            list: {
                class: EditorList.default,
                inlineToolbar: true,
            },
            image: {
                class: EditorImage.default,
                inlineToolbar: true,
                config: {
                    onSelectFile: async () => {
                        return getFileManager().getPhoto();
                    },
                    uploader: {
                        uploadByFile: () => {
                            toast.error('Please upload image via File manager')
                            return new Promise<any>(done => done({
                                success: 0,
                            }));
                        },
                        uploadByUrl: (url: string) => {
                            if (url.startsWith(window.location.origin)) {
                                return new Promise<any>(done => done({
                                    success: 1,
                                    file: {
                                        url,
                                    }
                                }));
                            } else {
                                toast.error('Please upload image via File manage')
                                return new Promise<any>(done => done({
                                    success: 0,
                                }));
                            }
                        }
                    },
                }
            },
            embed: {
                class: EditorEmbed.default,
                inlineToolbar: true,
            },
            quote: {
                class: EditorQuote.default,
                inlineToolbar: true,
            },
            delimiter: {
                class: EditorDelimiter.default,
                inlineToolbar: true,
            },
            // raw: {
            //     class: EditorRaw.default,
            //     inlineToolbar: true,
            // },
            table: {
                class: EditorTable.default,
                inlineToolbar: true,
            },
            Marker: {
                class: EditorMarker.default,
                inlineToolbar: true,
                shortcut: 'CMD+SHIFT+M',
            },
            // code: {
            //     class: EditorCode.default,
            //     inlineToolbar: true,
            // },
            linkTool: {
                class: EditorLink.default,
                inlineToolbar: true,
            },
            warning: {
                class: EditorWarning.default,
                inlineToolbar: true,
            },
        },
        onChange,
        autofocus,
        placeholder: placeholder ?? 'Let`s write an awesome story!',
    });
    editors[htmlId] = editor;
    await editor.isReady;
}

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
            readOnly: true,
            autofocus: false,
            tools: {
                header: {
                    class: EditorHeader.default,
                },
                list: {
                    class: EditorList.default,
                },
                image: {
                    class: EditorImage.default,
                },
                embed: {
                    class: EditorEmbed.default,
                },
                quote: {
                    class: EditorQuote.default,
                },
                delimiter: {
                    class: EditorDelimiter.default,
                },
                // raw: {
                //     class: EditorRaw.default,
                // },
                table: {
                    class: EditorTable.default,
                },
                Marker: {
                    class: EditorMarker.default,
                },
                // code: {
                //     class: EditorCode.default,
                // },
                linkTool: {
                    class: EditorLink.default,
                },
                warning: {
                    class: EditorWarning.default,
                },
            },
        });
        await editor.isReady;
    }

    editors['saver'] = editor;

    const redactor = saverContainer.querySelector('.codex-editor__redactor');
    (redactor as any).style = null;

    const content = redactor.outerHTML;
    return content;

}

export const getEditorData = async (htmlId: string): Promise<OutputData | undefined> => {
    const editor = editors[htmlId];
    if (!editor) {
        return;
    }
    return await editor.save();
}

export const destroyEditor = async (htmlId: string) => {
    const editor = editors[htmlId];
    if (!editor) {
        return;
    }
    if (typeof editor.destroy === 'function')
        await editor.destroy();
    delete editors[htmlId];
}