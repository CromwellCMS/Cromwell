import { TFieldsComponentProps } from '@components/entity/types';
import { TPost } from '@cromwell/core';
import { getEditorData, getEditorHtml, initTextEditor } from '@helpers/editor';
import { useForceUpdate } from '@helpers/forceUpdate';
import { Skeleton } from '@mui/material';
import React, { useContext, useEffect } from 'react';

import { PostContext } from '../contexts/PostContext';
import styles from './Post.module.scss';

const textPreloader: JSX.Element[] = [];
for (let i = 0; i < 30; i++) {
  textPreloader.push(<Skeleton variant="text" height="10px" style={{ margin: '3px 0' }} key={i} />);
}

export function PageContent(props: TFieldsComponentProps<TPost>) {
  const { isLoading } = props;
  const forceUpdate = useForceUpdate();
  const editorId = 'post-text-editor';
  const context = useContext(PostContext);

  const _initEditor = async (postContent?: any) => {
    await initTextEditor({
      htmlId: editorId,
      data: postContent,
      autofocus: true,
      onChange: () => {
        if (!context.hasChangesRef.current) {
          context.hasChangesRef.current = true;
          forceUpdate();
        }
      },
    });

    context.getEditorDataRef.current = async () => {
      return {
        content: await getEditorHtml(editorId),
        delta: JSON.stringify(await getEditorData(editorId)),
      };
    };
  };

  useEffect(() => {
    if (props.entityData) {
      context.dataRef.current = props.entityData;
      context.dataRef.current.title = context.dataRef?.current?.title ?? 'Untitled';
    }

    (async () => {
      try {
        await _initEditor(JSON.parse(props.entityData?.delta || '{}'));
      } catch (error) {
        console.error(error);
      }
    })();
  }, [props.entityData]);

  return (
    <div
      className={styles.Post}
      style={{
        margin: '0 0 20px 0',
      }}
    >
      {isLoading && (
        <>
          <Skeleton width="100%" height="100px" />
          {textPreloader}
        </>
      )}
      <div className={styles.editor} id={editorId}></div>
    </div>
  );
}
