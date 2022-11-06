import 'date-fns';

import { IconButton } from '@components/buttons/IconButton';
import { TextButton } from '@components/buttons/TextButton';
import { AutocompleteInput } from '@components/inputs/AutocompleteInput';
import { DateInput } from '@components/inputs/DateInput/DateInput';
import { SwitchInput } from '@components/inputs/SwitchInput';
import { TextInput } from '@components/inputs/TextInput/TextInput';
import { EDBEntity, resolvePageRoute, serviceLocator, TPost, TTag } from '@cromwell/core';
import { Close as CloseIcon } from '@mui/icons-material';
import { Popover, Tooltip } from '@mui/material';
import React, { useContext } from 'react';

import { ImageInput } from '../../../components/inputs/Image/ImageInput';
import { getCustomMetaFor, RenderCustomFields } from '../../../helpers/customFields';
import { useForceUpdate } from '../../../helpers/forceUpdate';
import { PostContext } from '../contexts/PostContext';
import styles from './PostSettings.module.scss';

const PostSettings = (props: {
  isSettingsOpen: boolean;
  anchorEl: Element;
  allTags?: TTag[] | null;
  onClose: () => void;
  isSaving?: boolean;
  handleUnpublish: () => void;
  refetchMeta: () => Promise<Record<string, string> | undefined>;
}) => {
  const { refetchMeta, isSettingsOpen } = props;
  const context = useContext(PostContext);
  const data = context.dataRef.current;
  const forceUpdate = useForceUpdate();

  const changeValue = <TKey extends keyof TPost>(key: TKey, value: TPost[TKey]) => {
    context.dataRef.current[key] = value;
    forceUpdate();
  }
  const getValue = <TKey extends keyof TPost>(key: TKey): TPost[TKey] => {
    return context.dataRef.current?.[key];
  }

  const handleChangeTags = (event: any, newValue: TTag[]) => {
    changeValue('tags', newValue);
  }

  const handleChangeKeywords = (event: any, newValue: string[]) => {
    if (!context.dataRef.current.meta) context.dataRef.current.meta = {};
    context.dataRef.current.meta.keywords = newValue;
    forceUpdate();
  }

  const handleClose = async () => {
    context.dataRef.current.customMeta = Object.assign({}, context.dataRef.current.customMeta,
      await getCustomMetaFor(EDBEntity.Post));

    props.onClose();
  }

  const handleChangePublishDate = (newValue: Date | null) => {
    if (!newValue) {
      changeValue('publishDate', null);
      return;
    }
    const date = new Date(newValue);
    if (isNaN(date.getTime())) {
      changeValue('publishDate', null);
      return;
    }
    changeValue('publishDate', date);
  }


  const pageFullUrl = serviceLocator.getFrontendUrl() + resolvePageRoute('post', {
    slug: data?.slug ?? data?.id + ''
  });

  return (
    <Popover
      disableEnforceFocus
      open={isSettingsOpen}
      elevation={0}
      anchorEl={props.anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      classes={{ paper: styles.popover }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <div className={styles.PostSettings}>
        <p className={styles.headerText}>Post meta</p>
        <IconButton className={styles.closeBtn}
          id="post-settings-close-btn"
          onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <TextInput
          label="Title"
          value={getValue('title') ?? ''}
          className={styles.settingItem}
          onChange={e => changeValue('title', e.target.value)}
        />
        <TextInput
          label="Page URL"
          className={styles.settingItem}
          value={getValue('slug') ?? ''}
          onChange={e => changeValue('slug', e.target.value)}
          description={pageFullUrl}
        />
        <ImageInput
          label="Main image"
          onChange={(val) => changeValue('mainImage', val)}
          value={getValue('mainImage')}
          className={styles.imageBox}
          backgroundSize='cover'
          showRemove
        />
        <AutocompleteInput
          multiple
          className={styles.settingItem}
          options={props.allTags ?? []}
          value={getValue('tags')?.map(tag => (props.allTags ?? []).find(allTag => allTag.name === tag.name)) ?? []}
          getOptionLabel={(option) => option.name}
          onChange={handleChangeTags}
          label="Tags"
        />
        <DateInput
          label="Publish date"
          dateType="datetime"
          value={getValue('publishDate')}
          onChange={handleChangePublishDate}
          className={styles.settingItem}
        />
        <SwitchInput
          value={getValue('featured')}
          onChange={() => changeValue('featured', !getValue('featured'))}
          className={styles.settingItem}
          label="Featured post"
        />
        <TextInput
          label="Meta title"
          className={styles.settingItem}
          value={getValue('pageTitle') ?? ''}
          onChange={e => changeValue('pageTitle', e.target.value)}
        />
        <TextInput
          label="Meta description"
          className={styles.settingItem}
          value={getValue('pageDescription') ?? ''}
          onChange={e => changeValue('pageDescription', e.target.value)}
        />
        <AutocompleteInput
          multiple
          freeSolo
          options={[]}
          value={(getValue('meta')?.keywords ?? []) as any}
          getOptionLabel={(option) => option}
          onChange={handleChangeKeywords}
          label="Meta keywords"
          tooltip="Press ENTER to add"
          className={styles.settingItem}
        />
        {getValue('published') && (
          <Tooltip title="Remove post from publication">
            <TextButton
              className={styles.publishBtn}
              disabled={props.isSaving}
              onClick={props.handleUnpublish}
            >Unpublish</TextButton>
          </Tooltip>
        )}
        <div style={{ marginBottom: '15px' }}></div>
        {data && isSettingsOpen && (
          <RenderCustomFields
            entityType={EDBEntity.Post}
            entityData={data}
            refetchMeta={refetchMeta}
          />
        )}
      </div>
    </Popover>
  )
}

export default PostSettings;