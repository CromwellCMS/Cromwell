import { CubeIcon, DocumentIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { usePageBuilder } from "../hooks/usePageBuilder";
import { useThemeEditor } from "../hooks/useThemeEditor";
import { PageDesignEditor } from "./components/PageDesignEditor";
import { PluginEditor } from "./components/PluginEditor";

const BlockSubViews = ({
  view, setView
}) => {
  const { selectedEditableBlock } = usePageBuilder();
  const data = selectedEditableBlock.current?.getData();

  if (data?.isConstant) {
    return (
      null
    )
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
              view === "plugin" ? "text-black font-bold border-indigo-500 bg-white" : ""
            }`}>
            Function
          </span>
        </div>
      </div>

      <hr className="my-2 w-full" />

      <div className="w-full">
        {view === "design" && (
          <PageDesignEditor
            block={selectedEditableBlock.current}
          />
        )}
        {
          view === 'plugin' && (
            <PluginEditor block={selectedEditableBlock.current} />
          )
        }
      </div>
    </>
  )
}

export const PageEditorSidebar = () => {
  const [blockSettings, setBlockSettings] = useState(false)
  const [blockView, setBlockView] = useState<
    "design" | "plugin"
  >("design");
  const { selectedEditableBlock } = usePageBuilder();
  // const { pageFrameRef } = useThemeEditor();

  useEffect(() => {
    if (selectedEditableBlock.current) {
      const data = selectedEditableBlock.current?.getData();
      if (!data.isDeleted && !data.isConstant) {
        setBlockSettings(true);
      }
    }
  }, [selectedEditableBlock.current])

  return (
    <div className="h-full">
      <div className="bg-indigo-200 text-xs w-full px-4 text-gray-500">
        <div className="grid grid-cols-3">
          <span
            onClick={() => {
              if (selectedEditableBlock.current) {
                setBlockSettings(true)
              }
            }}
            className={`p-2 text-center ${
              blockSettings
                ? "text-black font-bold bg-white rounded-t-md"
                : ""
            } ${
              selectedEditableBlock.current ? "" : "cursor-not-allowed"
            }`}>
              <CubeIcon className="mx-auto h-5 w-5 block" />
            Block
          </span>
          <span
            onClick={() => setBlockSettings(false)}
            className={`p-2 text-center ${
              !blockSettings ? "text-black font-bold bg-white rounded-t-md" : ""
            }`}>
              <DocumentIcon className="mx-auto h-5 w-5 block" />
            Page
          </span>
        </div>
      </div>
      <div className="h-full">
        {blockSettings && selectedEditableBlock.current && (
          <BlockSubViews view={blockView} setView={setBlockView} />
        )}
      </div>
    </div>
  );
};



