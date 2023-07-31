import { IconButton } from '@components/buttons/IconButton';
import { TextButton } from '@components/buttons/TextButton';
import { TPost, TTag } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { useForceUpdate } from '@helpers/forceUpdate';
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { TFieldsComponentProps } from '../../../components/entity/types';
import { PostContext } from '../contexts/PostContext';
import styles from './Post.module.scss';
import PostSettings from './PostSettings';

export function HeaderActions(props: TFieldsComponentProps<TPost>) {
  const { entityData: data, isSaving, refetchMeta } = props;
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const [allTags, setAllTags] = useState<TTag[] | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const context = useContext(PostContext);
  const forceUpdate = useForceUpdate();

  const getPostTags = async () => {
    const client = getGraphQLClient();
    try {
      const data = (await client?.getTags({ pagedParams: { pageSize: 10000 } }))?.elements;
      if (data && Array.isArray(data)) {
        setAllTags(data.sort((a, b) => (a.name < b.name ? -1 : 1)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getPostTags();
  }, []);

  const handleToggleSettings = () => {
    context.setSettingsOpen(!context.settingsOpen);
  };

  const handleUnpublish = async () => {
    setIsUpdating(true);
    const data = context.dataRef?.current;
    if (!data) {
      console.error('!context.dataRef?.current');
      return;
    }
    data.published = false;
    await props.onSave();
    setIsUpdating(false);
  };

  const handlePublish = async () => {
    setIsUpdating(true);
    const data = context.dataRef?.current;
    if (!data) {
      console.error('!context.dataRef?.current');
      return;
    }
    data.published = true;
    data.publishDate = new Date(Date.now());
    await props.onSave();
    setIsUpdating(false);
  };

  const handleChangeTitle = (event: any) => {
    context.dataRef.current.title = event.target.value;
    forceUpdate();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingRight: '15px',
      }}
    >
      <input className={styles.postTitle} value={data?.title ?? ''} onChange={handleChangeTitle} />
      <Box ref={actionsRef} sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="Post meta info">
          <IconButton onClick={handleToggleSettings} style={{ marginRight: '10px' }} id="more-button">
            <MoreHorizIcon />
          </IconButton>
        </Tooltip>
        <PostSettings
          allTags={allTags}
          isSettingsOpen={context.settingsOpen}
          onClose={handleToggleSettings}
          anchorEl={actionsRef.current}
          isSaving={isSaving || isUpdating}
          handleUnpublish={handleUnpublish}
          refetchMeta={refetchMeta}
        />
        {!data?.published && (
          <TextButton className={styles.publishBtn} disabled={isSaving || isUpdating} onClick={handlePublish}>
            Publish
          </TextButton>
        )}
      </Box>
    </Box>
  );
}
