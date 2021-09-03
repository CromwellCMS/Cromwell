import { API, InlineTool } from '@editorjs/editorjs';
import React from 'react';

import { layoutActions } from '../../LayoutPortal';
import { InputSlider } from './InputSlider';

export class FontSize implements InlineTool {
    private button: HTMLButtonElement | null;
    private _state: boolean;
    private api: API;
    private tag: string;
    private icon = '<svg viewBox="0 0 24 24" width="20" height="18"><path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z"></path></svg>';
    private actions: HTMLDivElement;
    private currentSpan: HTMLSpanElement | null;
    private lastRange: Range;
    private hasShownActions = false;
    private appliedSize = false;

    static title = 'Font size';

    static get isInline() {
        return true;
    }

    get state() {
        return this._state;
    }

    set state(state) {
        this._state = state;

        this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
    }

    constructor({ api }) {
        this.api = api;
        this.button = null;
        this._state = false;
        this.tag = 'span';
    }

    render() {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.innerHTML = this.icon;
        this.button.classList.add(this.api.styles.inlineToolButton);
        return this.button;
    }

    renderActions() {
        this.actions = document.createElement('div');
        return this.actions;
    }

    surround(range: Range) {
        this.lastRange = range;
        if (!range) {
            return;
        }
        this.showActions();
    }

    handleSizeChange = (value: number) => {
        if (!this.appliedSize) {
            this.wrap();
        }
        if (!this.currentSpan) return;
        this.appliedSize = true;

        const innerSpans = [...this.currentSpan.querySelectorAll('span')];
        innerSpans.push(this.currentSpan);

        innerSpans.forEach(span => {
            if (value === undefined) {
                span.style.fontSize = null;
            } else {
                span.style.fontSize = value + 'px';
                span.style.lineHeight = value + 10 + 'px';
            }
        });
    }

    showActions() {
        this.appliedSize = false;
        const range = this.lastRange;
        if (range.collapsed) return;

        const firstParent = range.startContainer?.parentNode as HTMLElement;
        const initialSize = window.getComputedStyle(firstParent, null).getPropertyValue('font-size');

        if (this.hasShownActions) {
            layoutActions.closePortal('fontSizeTool');
            this.hasShownActions = false;
            return;
        }
        setTimeout(() => {
            this.hasShownActions = true;
        }, 50);

        layoutActions.renderPortal('fontSizeTool', (
            <InputSlider
                initialVal={parseFloat(initialSize) ?? 16}
                onChange={this.handleSizeChange}
            />
        ), this.actions)
    }

    wrap() {
        const range = this.lastRange;
        if (range.collapsed) return;

        // Selected only one SPAN tag
        const firstParent = range.startContainer?.parentNode as HTMLElement;
        if (firstParent && firstParent.tagName === 'SPAN' && firstParent.innerText === range.toString()) {
            this.currentSpan = range.startContainer?.parentNode as HTMLSpanElement;
        } else {
            // Selected many tags or text
            const content = range.extractContents();
            this.currentSpan = document.createElement(this.tag);
            this.currentSpan.classList.add('fontSize');

            // If many same spans, then merge
            if (content.children.length > 1 &&
                [...content.children].every(tag => tag.tagName === 'SPAN'
                    && tag.classList.contains('fontSize'))) {
                this.currentSpan.innerHTML = [...content.children].map(child => child.innerHTML).join('');
            } else {
                // If text, then wrap it
                this.currentSpan.appendChild(content);
            }

            range.insertNode(this.currentSpan);

            // Remove empty span tags
            (this.currentSpan?.parentElement ?? this.currentSpan).querySelectorAll('span').forEach(span => {
                if (span.innerText === '') span.remove();
            });
        }

        if (this.currentSpan)
            this.api.selection.expandToTag(this.currentSpan);
    }

    checkState() {
        if (this.hasShownActions) {
            layoutActions.closePortal('fontSizeTool');
            this.hasShownActions = false;
        }
        return true;
    }

    hideActions() {
        this.actions.onclick = null;
        this.actions.hidden = true;
    }

    static get sanitize() {
        return {
            span: {
                class: 'fontSize',
                style: true,
            },
        };
    }

    /**
     * Get Tool icon's SVG
     * @return {string}
     */
    get toolboxIcon() {
        return this.icon;
    }
}

