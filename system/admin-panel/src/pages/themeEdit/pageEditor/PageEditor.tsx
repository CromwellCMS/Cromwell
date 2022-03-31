import React, { useEffect } from "react";
import {
  PageBuilderProvider,
  usePageBuilder,
} from "../hooks/usePageBuilder";
import { useThemeEditor } from "../hooks/useThemeEditor";

export const InnerPageFrame = () => {
  const { editingPageConfig, pageFrameRef, plugins, rerender } =
    useThemeEditor();
  const { onPageChange } = usePageBuilder();
  const activePage = editingPageConfig;

  useEffect(() => {
    if (editingPageConfig) {
      onPageChange();
      console.log("REWIRED");
    }
  }, [editingPageConfig]);

  if (!activePage) return null;

  const url = `${window.location.origin}/${
    activePage?.previewUrl ?? activePage?.route
  }`;

  return (
    <div className="h-full w-full relative">
      <div
        id="editorWidgetWrapperCropped"
        className="top-0 right-0 bottom-0 left-0 absolute pointer-events-none overflow-hidden">
      </div>
      <div
        id="editorWidgetWrapper"
        className="top-0 right-0 bottom-0 left-0 absolute pointer-events-none overflow-hidden">
      </div>
      <iframe
        ref={pageFrameRef}
        className="h-full w-full"
        src={url}
      />
    </div>
  );
};

export const PageFrame = () => {
  return (
      <InnerPageFrame />
  );
};
