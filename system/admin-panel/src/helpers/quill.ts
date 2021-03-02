import Quill from 'quill';
import { getFileManager } from '../components/fileManager/helpers';

export const initQuillEditor = (selector: string, postContent?: Record<string, any>): Quill | undefined => {
    const container = document.querySelector(selector);
    if (!container) {
        console.error('initQuillEditor: Failed to find container by selector: ' + selector);
        return;
    }

    const quill = new Quill(container, {
        theme: 'snow',
        placeholder: "Let's write an awesome story!",
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'font': [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'align': [] }],
                ['link', 'blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'color': [] }, { 'background': [] }],
                ['clean'],
                ['image']
            ],
            history: {
                maxStack: 500,
                userOnly: true
            },
        },
    });


    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', async (prop) => {
        const photoPath = await getFileManager()?.getPhoto();
        if (photoPath) {
            const selection = quill.getSelection();
            quill.insertEmbed(selection.index, 'image', photoPath);
        }
    });

    if (postContent) {
        quill.setContents(postContent as any);
    }

    return quill;
}

export const getQuillHTML = (quill: Quill, selector: string): string | undefined => {
    quill.disable();
    let descriptionHTML;
    const editorEl = document.querySelector(selector);
    if (editorEl) {
        const editorCloneEl = editorEl.cloneNode(true) as HTMLDivElement;
        const clipboard = editorCloneEl.querySelector('.ql-clipboard');
        if (clipboard) clipboard.remove();

        const tooltip = editorCloneEl.querySelector('.ql-tooltip');
        if (tooltip) tooltip.remove();

        descriptionHTML = editorCloneEl.outerHTML;
        editorCloneEl.remove();
    }

    quill.enable();
    return descriptionHTML;
}