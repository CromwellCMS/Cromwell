import type { BlockTool, API } from '@editorjs/editorjs';

type DataType = {
  html: string;
};

export const getCustomHtmlClass = (onChange?: () => any) => {
  class CustomHtml implements BlockTool {
    state: {
      data?: DataType;
      api?: API;
      readOnly: boolean;
    } = { readOnly: false };

    static get isReadOnlySupported() {
      return true;
    }

    static get enableLineBreaks() {
      return true;
    }

    constructor(opts) {
      const { data, readOnly, api } = opts;
      this.state.readOnly = readOnly;
      this.state.data = data as DataType;
      this.state.api = api;
    }

    static get toolbox() {
      return {
        title: 'Custom HTML',
        icon: '<p style="font-weight: 700;letter-spacing: 1px;transform: scaleX(0.9);">&lt;/&gt;</p>',
      };
    }

    render() {
      if (this.state.readOnly) {
        const container = document.createElement('div');
        container.innerHTML = this.state.data?.html || '';
        return container;
      } else {
        const container = document.createElement('div');
        container.classList.add('cdx-block');

        const input = document.createElement('textarea');
        input.classList.add('cdx-input');
        input.value = this.state.data?.html || '';

        const changeTracker = document.createElement('div');
        changeTracker.style.display = 'none';
        changeTracker.contentEditable = 'true';

        input.addEventListener('input', () => {
          // Send manually since editorjs won't send it if only value is changed
          onChange?.();
        });

        container.appendChild(input);
        container.appendChild(changeTracker);
        return container;
      }
    }

    save(blockContent): DataType {
      return {
        html: blockContent.querySelector('textarea').value,
      };
    }
  }

  return CustomHtml;
};
