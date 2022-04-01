import {
  CubeIcon,
  DocumentIcon,
} from "@heroicons/react/outline";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForceUpdate } from "../../../helpers/forceUpdate";
import { usePageBuilder } from "../hooks/usePageBuilder";
import { useThemeEditor } from "../hooks/useThemeEditor";
import { PageDesignEditor } from "./components/PageDesignEditor";
import { PageSettings } from "./components/PageSettings";
import { PluginEditor } from "./components/PluginEditor";

const BlockSubViews = ({ view, setView }) => {
  const { selectedEditableBlock } = usePageBuilder();
  const data = selectedEditableBlock.current?.getData();

  if (data?.isConstant) {
    return null;
  }

  return (
    <>
      <div className="bg-indigo-100 text-xs w-full text-gray-500">
        <div className="bg-white h-2 w-full" />
        <div className="grid grid-cols-2">
          <span
            onClick={() => setView("design")}
            className={`border-b border-white p-2 w-full text-center ${
              view === "design"
                ? "text-black font-bold border-indigo-500 bg-white"
                : ""
            }`}>
            Design
          </span>
          <span
            onClick={() => setView("plugin")}
            className={`border-b border-white p-2 w-full text-center ${
              view === "plugin"
                ? "text-black font-bold border-indigo-500 bg-white"
                : ""
            }`}>
            Function
          </span>
        </div>
      </div>

      <hr className="my-2 w-full" />

      <div className="w-full max-h-[calc(100%-70px)] overflow-y-scroll scrollbar-slim">
        {view === "design" && (
          <PageDesignEditor
            block={selectedEditableBlock.current}
          />
        )}
        {view === "plugin" && (
          <PluginEditor
            block={selectedEditableBlock.current}
          />
        )}
      </div>
    </>
  );
};

export const PageEditorSidebar = () => {
  const [blockSettings, setBlockSettings] = useState(false);
  const [blockView, setBlockView] = useState<
    "design" | "plugin"
  >("design");
  const { editingPageConfig } = useThemeEditor()
  const { selectedEditableBlock, updateFramesPosition } =
    usePageBuilder();
  const boundingRef = useRef<HTMLDivElement>();
  const [resizeSnapshot, setResizeSnapshot] = useState(0);
  const [resizeW, setResizeW] = useState(295);
  const [tempW, setTempW] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const forceUpdate = useForceUpdate();
  // const { pageFrameRef } = useThemeEditor();

  useEffect(() => {
    if (selectedEditableBlock.current) {
      const data = selectedEditableBlock.current?.getData();
      if (!data.isDeleted && !data.isConstant) {
        setBlockSettings(true);
      }
    }
  }, [selectedEditableBlock.current]);

  const resizePanel = useCallback(
    (event) => {
      setIsResizing(true);
      // const rect = event.target.getBoundingClientRect();
      const rect =
        boundingRef?.current?.getBoundingClientRect?.();
      const start = event.clientX - rect.left;
      const startingX = parseInt(
        `${Math.min(Math.max(190, start), 900)}`,
        10,
      );
      setTempW(startingX);
      const initialValue = resizeW ? resizeW : 0;
      setResizeSnapshot(initialValue);
    },
    [resizeW],
  );

  useEffect(() => {
    // Only change the value if the drag was actually started.
    const onUpdate = (event) => {
      if (tempW) {
        const rect =
          boundingRef.current?.getBoundingClientRect();
        const posX = (event.clientX - rect.left) / -1;
        const start = posX + resizeSnapshot;
        const nextVal = parseInt(
          `${Math.min(Math.max(190, start), 900)}`,
          10,
        );
        setResizeW(nextVal);
        updateFramesPosition();
      }
    };

    // Stop the drag operation now.
    const onEnd = () => {
      setTempW(0);
      setIsResizing(false);
    };

    if (tempW > 0) {
      document.addEventListener("mousemove", onUpdate);
      document.addEventListener("mouseup", onEnd);

      return () => {
        document.removeEventListener("mousemove", onUpdate);
        document.removeEventListener("mouseup", onEnd);
      };
    }
  }, [tempW, setResizeW, resizeSnapshot]);

  useEffect(() => {
    if (!isResizing) {
      setResizeSnapshot(resizeW);
    }
  }, [resizeW, isResizing]);

  useEffect(() => {
    forceUpdate()
  }, [editingPageConfig])

  return (
    <div
      ref={boundingRef}
      style={{ width: resizeW }}
      className="bg-white border-l h-screen border-gray-300 pt-14 pb-14 w-72 relative">
      <div
        onMouseDown={resizePanel}
        className="cursor-w-resize h-full top-0 left-0 w-[2px] absolute">
        <span
          className={`w-[1200px] h-full absolute right-0 top-0 ${
            isResizing ? "" : "hidden"
          }`}
        />
      </div>

      <div className="bg-indigo-200 text-xs w-full px-4 text-gray-500 relative">
        <div className="grid grid-cols-3">
          <span
            onClick={() => {
              if (selectedEditableBlock.current) {
                setBlockSettings(true);
              }
            }}
            className={`p-2 text-center ${
              blockSettings
                ? "text-black font-bold bg-white rounded-t-md"
                : ""
            } ${
              selectedEditableBlock.current
                ? ""
                : "cursor-not-allowed"
            }`}>
            <CubeIcon className="mx-auto h-5 w-5 block" />
            Block
          </span>
          <span
            onClick={() => setBlockSettings(false)}
            className={`p-2 text-center ${
              !blockSettings
                ? "text-black font-bold bg-white rounded-t-md"
                : ""
            }`}>
            <DocumentIcon className="mx-auto h-5 w-5 block" />
            Page
          </span>
        </div>
        {resizeW !== 295 && (
          <span
            onClick={() => setResizeW(295)}
            className="cursor-pointer text-xs p-2 top-0 right-0 text-gray-600 absolute">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </span>
        )}
      </div>
      <div className="h-full">
        {blockSettings && selectedEditableBlock.current && (
          <BlockSubViews
            view={blockView}
            setView={setBlockView}
          />
        )}
        {
          !blockSettings && editingPageConfig && (
            <PageSettings />
          )
        }
        {
          !blockSettings && !editingPageConfig && (
            <div className="p-2">
              <h2 className="font-bold my-2 text-lg">No page selected</h2>
              <p className="text-xs">
                Page and block specific settings can be configured here. To start editing, select a page on the left!
              </p>
            </div>
          )
        }
      </div>
    </div>
  );
};
