import { getStoreItem, TPost, TPostInput, TUser } from '@cromwell/core';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const PostContext = React.createContext<{
  settingsOpen: boolean;
  setSettingsOpen?: (value: boolean) => void;
  getEditorDataRef?: React.MutableRefObject<(() => Promise<{ content: string; delta: string }>) | null>;
  dataRef?: React.MutableRefObject<TPost>;
  hasChangesRef?: React.MutableRefObject<boolean>;
  getInput?: () => Promise<TPostInput>;
}>({
  settingsOpen: false,
});

export const PostContextProvider = (props: { children: React.ReactNode }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const getEditorDataRef = useRef<(() => Promise<{ content: string; delta: string }>) | null>(null);
  const dataRef = useRef<TPost | null>(null);
  const hasChangesRef = useRef<boolean>(false);
  const history = useHistory();

  const getInput = async (): Promise<TPostInput> => {
    const data = dataRef.current;
    if (!data || !getEditorDataRef.current) return;
    const userInfo: TUser | undefined = getStoreItem('userInfo');
    const editorData = await getEditorDataRef.current();

    return {
      slug: data.slug,
      pageTitle: data.pageTitle,
      pageDescription: data.pageDescription,
      title: data.title,
      mainImage: data.mainImage,
      publishDate: data.publishDate,
      published: data.published,
      featured: data.featured,
      isEnabled: data.isEnabled,
      meta: {
        keywords: data.meta?.keywords,
      },
      tagIds: data.tags?.map((tag) => tag.id)?.filter(Boolean),
      authorId: data?.author?.id ?? userInfo?.id,
      delta: editorData.delta,
      content: editorData.content,
      customMeta: data.customMeta,
    };
  };

  useEffect(() => {
    const unregisterBlock = history.block(() => {
      if (hasChangesRef.current)
        return 'Your unsaved changes will be lost. Do you want to discard and leave this page?';
    });

    return () => {
      unregisterBlock();
    };
  }, []);

  return (
    <PostContext.Provider
      value={{
        settingsOpen,
        setSettingsOpen,
        getEditorDataRef,
        dataRef,
        hasChangesRef,
        getInput,
      }}
    >
      {props.children}
    </PostContext.Provider>
  );
};
