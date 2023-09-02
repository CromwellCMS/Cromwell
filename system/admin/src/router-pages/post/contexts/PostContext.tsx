import { getStoreItem, TPost, TPostInput, TUser } from '@cromwell/core';
import { usePrompt } from '@hooks/useBlocker';
import React, { useRef, useState } from 'react';

export const PostContext = React.createContext<{
  settingsOpen: boolean;
  setSettingsOpen?: (value: boolean) => void;
  getEditorDataRef: React.MutableRefObject<
    (() => Promise<{ content: string | null | undefined; delta: string | null | undefined }>) | null
  >;
  dataRef: React.MutableRefObject<TPost | null | undefined>;
  hasChangesRef: React.MutableRefObject<boolean>;
  getInput?: () => Promise<TPostInput>;
}>({
  settingsOpen: false,
} as any);

export const PostContextProvider = (props: { children: React.ReactNode }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const getEditorDataRef = useRef<
    (() => Promise<{ content: string | null | undefined; delta: string | null | undefined }>) | null
  >(null);
  const dataRef = useRef<TPost | null>(null);
  const hasChangesRef = useRef<boolean>(false);

  usePrompt('Your unsaved changes will be lost. Do you want to discard and leave this page?', hasChangesRef.current);

  const getInput = async (): Promise<TPostInput> => {
    const data = dataRef.current;
    if (!data || !getEditorDataRef.current) return {};
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
