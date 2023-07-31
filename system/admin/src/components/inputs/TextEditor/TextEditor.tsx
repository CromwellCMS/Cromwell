import { getRandStr, TBasePageEntity } from '@cromwell/core';
import { destroyEditor, initTextEditor } from '@helpers/editor';
import React from 'react';

import styles from './TextEditor.module.scss';

export class TextEditor extends React.Component<{
  initialValue: string | undefined;
  entity: TBasePageEntity;
  onChange?: (value: any) => void;
  label?: React.ReactNode;
  placeholder?: string;
  fixedHeight?: boolean;
  getId?: (id: string) => void;
  id?: string;
}> {
  public editorId: string;
  public initialValue: string;
  public initPromise: null | Promise<void>;

  constructor(props: any) {
    super(props);

    this.editorId = 'editor_' + getRandStr(12);
    this.initialValue = this.editorId;
  }

  componentDidMount() {
    this.checkUpdate();
  }

  componentDidUpdate() {
    this.checkUpdate();
  }

  componentWillUnmount() {
    destroyEditor(this.editorId);
  }

  private checkUpdate = () => {
    if (this.props.initialValue !== this.initialValue) {
      this.initialValue = this.props.initialValue;
      this.initEditor();
    }
  };

  private initEditor = async () => {
    let data:
      | {
          html: string;
          json: string;
        }
      | undefined = undefined;
    if (this.initPromise) await this.initPromise;
    let initDone;
    this.initPromise = new Promise((done) => (initDone = done));

    const target = document.getElementById(this.editorId);
    if (!target) return;
    await destroyEditor(this.editorId);
    target.innerHTML = '';

    if (this.initialValue) {
      try {
        data = JSON.parse(this.initialValue);
      } catch (error) {
        console.error(error);
      }
    }

    await initTextEditor({
      htmlId: this.editorId,
      data: data?.json,
      placeholder: this.props.placeholder,
      onChange: () => {
        this.props.onChange?.(null);
      },
    });

    initDone();
  };

  render() {
    this.props?.getId?.(this.editorId);

    return (
      <>
        {this.props.label && (
          <label htmlFor={this.props.id} className="font-bold block active:text-indigo-500">
            {this.props.label}
          </label>
        )}
        <div
          style={{
            margin: '15px 0',
            overflow: this.props?.fixedHeight ? 'auto' : undefined,
            maxHeight: this.props?.fixedHeight ? '400px' : undefined,
          }}
          className={styles.descriptionEditor}
        >
          <div style={{ minHeight: '350px' }} id={this.editorId}></div>
        </div>
      </>
    );
  }
}
