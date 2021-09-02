import { Tooltip } from '@material-ui/core';
import { EditOutlined as EditOutlinedIcon, Public as PublicIcon } from '@material-ui/icons';
import React from 'react';
import { debounce } from 'throttle-debounce';

import { destroyEditor, getEditorData, getEditorHtml, initTextEditor } from '../../../../helpers/editor/editor';
import { StylesEditor } from '../components/StylesEditor';
import styles from './BaseBlock.module.scss';
import { TBlockMenuProps } from './BlockMenu';


export class EditorBlockSidebar extends React.Component<TBlockMenuProps> {

    private editorId = 'blockEditor';
    private editor;
    private unmounted = false;

    componentDidMount() {
        this.init();
    }

    private async init() {
        const data = this.props.block?.getData();
        this.editor = await initTextEditor({
            htmlId: this.editorId,
            data: JSON.parse(data?.editor?.data ?? null),
            onChange: () => this.handleSaveDebounced(),
        });
        await getEditorHtml(this.editorId);
    }

    componentWillUnmount() {
        destroyEditor(this.editorId);
        this.unmounted = true;
    }

    private handleSaveDebounced = debounce(200, async () => {
        this.handleSaveEditor();
    });

    private handleSaveEditor = async () => {
        if (this.unmounted) return;
        const data = this.props.block?.getData();
        if (!data) return;

        const editorData = await getEditorData(this.editorId);
        const html = await getEditorHtml(this.editorId, editorData);

        if (!data.editor) data.editor = {};
        data.editor.data = JSON.stringify(editorData);
        data.editor.html = html;
        this.props.modifyData?.(data);
        setTimeout(() => {
            this.props.updateFramesPosition();
        }, 100);
    }

    render() {
        const props = this.props;
        const data = props.block?.getData();
        return (
            <div className={styles.containerSettings}>
                <div className={styles.settingsHeader}>
                    <EditOutlinedIcon />
                    {props.isGlobalElem(props.getBlockElementById(data?.id)) && (
                        <div className={styles.headerIcon}>
                            <Tooltip title="Global block">
                                <PublicIcon />
                            </Tooltip>
                        </div>
                    )}
                    <h3 className={styles.settingsTitle}>Editor settings</h3>
                </div>
                <div id={this.editorId}></div>
                <StylesEditor
                    forceUpdate={() => this.forceUpdate()}
                    blockProps={props}
                />
            </div>
        );
    }
}
