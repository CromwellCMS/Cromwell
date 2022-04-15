import { ArrowSmRightIcon, ArrowSmLeftIcon} from "@heroicons/react/outline";
import React, { useCallback, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  PageBuilderProvider,
  usePageBuilder,
} from "../hooks/usePageBuilder";
import { useThemeEditor } from "../hooks/useThemeEditor";
import { BlockMenu } from "./components/BlockMenu";

export const InnerPageFrame = () => {
  const { editingPageConfig, pageFrameRef, forceUpdate } =
    useThemeEditor();
  const { onPageChange, undoModification, redoModification } = usePageBuilder();
  const activePage = editingPageConfig;

  useHotkeys('ctrl+z', () => {
    undoModification();
    forceUpdate();
  })

  useHotkeys('ctrl+y', () => {
    redoModification()
    forceUpdate()
  })

  useHotkeys('ctrl+shift+z', () => {
    redoModification()
    forceUpdate()
  })

  useEffect(() => {
    if (editingPageConfig) {
      onPageChange();
    }
  }, [editingPageConfig]);

  if (!activePage) return (
    <div className="h-full w-full relative">
      <div className="font-bold -top-6 right-3 text-indigo-400 absolute float-right">
        Settings for blocks and page
        <ArrowSmRightIcon className="h-7 w-7 inline" />
      </div>
      <div className="font-bold -top-6 left-3 animate animate-pulse text-indigo-600 absolute float-right">
        <ArrowSmLeftIcon className="h-7 w-7 inline" />
        Select a page to start!
      </div>
      <div className="mx-auto max-w-lg my-20">
        <h1 className="font-bold text-center text-2xl">Welcome to the Theme Editor!</h1>
        <p className="my-10 text-center">
          This is the place where you can add new custom pages to your website, edit existing pages - or even change the theme pages! <br />
          <strong>To begin, select a page on the left (or add a new one 😊).</strong> <br />
          Anything that&apos;s related to the page as a whole (metadata, SEO settings, route, and much more!) will be available under &quot;Page&quot; on the right.<br />
          If you want to change the design of a Block (we call each element on a page a block), click on an element on the page and head to the &quot;block -{">"} design&quot; section on the right.
          Want to change plugin settings or text of an element: &quot;block -{">"} function&quot;!
        </p>
        <h2 className="font-bold text-lg text-center">Have fun customizing your website!</h2>
      </div>
    </div>
  );

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
      <BlockMenu />
      <iframe
        ref={pageFrameRef}
        className="h-full w-full scrollbar-md"
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
