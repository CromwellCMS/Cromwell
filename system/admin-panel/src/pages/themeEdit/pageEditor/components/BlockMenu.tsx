import { TCromwellBlock, TCromwellBlockData, TCromwellBlockType, TPluginEntity } from "@cromwell/core";
import {
  CodeIcon,
  CollectionIcon,
  CubeTransparentIcon,
  LinkIcon,
  MenuAlt2Icon,
  PhotographIcon,
  PuzzleIcon,
  DocumentTextIcon,
  TrashIcon,
  GlobeIcon,
  PlusIcon,
  XIcon,
} from "@heroicons/react/outline";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useForceUpdate } from "../../../../helpers/forceUpdate";
import { onPluginBlockRegister } from "../../../../helpers/registerThemeEditor";
import { usePageBuilder } from "../../hooks/usePageBuilder";
import { useThemeEditor } from "../../hooks/useThemeEditor";
import { NewBlockMenu } from "./NewBlockMenu";

export type TBlockMenuProps = {
  block?: TCromwellBlock;
  global?: boolean,
  isGlobalElem: (block: HTMLElement) => boolean;
  getBlockElementById: (typeof import('@cromwell/core-frontend'))['getBlockElementById'];
  modifyData?: (data: TCromwellBlockData) => void;
  deleteBlock?: () => void;
  addBlock?: (block: TCromwellBlockData, position: "top"|"bottom") => void;
  addNewBlockAfter?: (bType: TCromwellBlockType) => void;
  createBlockAfter?: (bType: TCromwellBlockType, pluginInfo?: { pluginName?: string; blockName?: string }) => void;
  icon?: JSX.Element;
  menuItems?: JSX.Element | JSX.Element[];
  settingsContent?: React.ReactNode;
  plugins: TPluginEntity[] | null;
  setCanDrag: (canDrag: boolean) => void;
  setCanDeselect: (canDeselect: boolean) => void;
  updateFramesPosition: () => any;
}

export const BlockMenu = () => {
  const {
    selectedFrames,
    selectedBlock,
    selectedEditableBlock,
    createBlockProps,
  } = usePageBuilder();
  const { pageFrameRef, forceUpdate } = useThemeEditor();
  const frame =
    selectedFrames.current?.[selectedBlock.current?.id];
  const blockProps = createBlockProps(
    selectedEditableBlock.current,
  );
  const [showTopbar, setShowTopbar] = useState(true);

  useEffect(() => {
    if (selectedEditableBlock.current) {
      setShowTopbar(true)
    }
  }, [selectedEditableBlock.current])

  if (!frame) return null;

  const iFrameRect =
    pageFrameRef.current?.getBoundingClientRect();
  const frameRect = frame?.getBoundingClientRect();
  const showTop = frameRect?.top > 100;

  const showLeft =
    iFrameRect?.right - frameRect?.right > 250 ||
    frameRect?.left - iFrameRect?.left < 350;

  const data = selectedEditableBlock.current?.getData();
  const bType = data?.type;
  const isConstant = data?.isConstant;
  const isGlobal = data?.global

  const addNewBlock = (block?: any, position?: "top"|"bottom") => {
    blockProps?.addBlock(block, position)
  }

  return ReactDOM.createPortal(
    <>
      <NewBlockMenu position="bottom" onAddBlock={addNewBlock} />
      <NewBlockMenu position="top" onAddBlock={addNewBlock} />
      {!isConstant && showTopbar && (
        <div
          className={`bg-white border border-purple-300 rounded-lg h-10 w-52 ${
            showLeft ? "left-[-2px]" : "right-[-2px]"
          } shadow-md px-1 py-1 absolute pointer-events-auto ${
            showTop ? "-top-10" : "-bottom-10"
          }`}>
          <div className="flex flex-row w-full justify-between">
            { isGlobal && <div className="rounded-lg h-full p-1 px-2">
              <GlobeIcon className="h-5 w-5" />
            </div> }
            <button className="rounded-lg h-full p-1 pr-4 hover:bg-gray-100">
              <BlockIcon bType={bType} />{" "}
              <span className="font-bold text-xs ml-1 pb-1 leading-5 uppercase">
                {bType}
              </span>
            </button>
            <div className="mt-[1px]">
              <button
                onClick={blockProps.deleteBlock}
                className="rounded-lg h-full p-1 hover:bg-red-500 hover:text-white">
                <TrashIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowTopbar(false)}
                className="rounded-lg h-full p-1 top-[-2px] text-gray-500 relative hover:text-gray-400">
                  <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
    frame,
  );
};

export const BlockIcon = ({ bType }) => {
  let icon: any = null;

  switch (bType) {
    case "text": {
      icon = (
        <MenuAlt2Icon className="h-5 pb-1 w-5 inline-block" />
      );
      break;
    }
    case "container": {
      icon = (
        <CubeTransparentIcon className="h-5 pb-1 w-5 inline-block" />
      );
      break;
    }
    case "plugin": {
      icon = (
        <PuzzleIcon className="h-5 pb-1 w-5 inline-block" />
      );
      break;
    }
    case "HTML": {
      icon = <CodeIcon className="h-5 pb-1 w-5 inline-block" />;
      break;
    }
    case "image": {
      icon = (
        <PhotographIcon className="h-5 pb-1 w-5 inline-block" />
      );
      break;
    }
    case "link": {
      icon = <LinkIcon className="h-5 pb-1 w-5 inline-block" />;
      break;
    }
    case "gallery": {
      icon = (
        <CollectionIcon className="h-5 pb-1 w-5 inline-block" />
      );
      break;
    }
    case "editor": {
      icon = (
        <DocumentTextIcon className="h-5 pb-1 w-5 inline-block" />
      );
      break;
    }
  }

  return icon;
};
