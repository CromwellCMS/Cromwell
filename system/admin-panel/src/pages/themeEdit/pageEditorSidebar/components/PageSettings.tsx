import { getRandStr, TPageConfig } from "@cromwell/core";
import {
  CodeIcon,
  HashtagIcon,
  InformationCircleIcon,
  LinkIcon,
} from "@heroicons/react/outline";
import React, { useEffect, useRef, useState } from "react";
import {
  useDebounce,
  useDebounceFn,
} from "../../hooks/useDebounce";
import { usePageBuilder } from "../../hooks/usePageBuilder";
import { useThemeEditor } from "../../hooks/useThemeEditor";
import {
  TExtendedPageConfig,
  TExtendedPageInfo,
} from "../../ThemeEdit";
import { TextAreaInput, TextInput } from "./TextInput";
import CodeEditor from "@uiw/react-textarea-code-editor";
import {
  askConfirmation,
  toast,
} from "../../../../exports";
import { getRestApiClient } from "@cromwell/core-frontend";

export const PageMetaSettings = ({
  onInputChange = (inp: string, val: any) => {},
  config = null,
}: {
  onInputChange?: (inp: string, val: any) => void;
  config?: TExtendedPageConfig;
}) => {
  return (
    <div className="mt-6 px-3">
      <p className="my-2 text-xs uppercase">Meta</p>
      <TextInput
        disabled={!config.isVirtual}
        prefixElement={
          <LinkIcon className="h-4 w-4 inline" />
        }
        name="route"
        value={config?.route || ""}
        label="route"
        onChange={(e) =>
          onInputChange("route", e.target.value)
        }
      />
      <TextInput
        prefixElement={
          <InformationCircleIcon className="h-4 w-4 inline" />
        }
        name="name"
        value={config?.name || ""}
        label="name (internal)"
        onChange={(e) =>
          onInputChange("name", e.target.value)
        }
      />
      <TextInput
        prefixElement={
          <div className="h-4 text-xs pl-1 w-4 inline">
            T
          </div>
        }
        name="title"
        value={config?.title || ""}
        label="meta title"
        onChange={(e) =>
          onInputChange("title", e.target.value)
        }
      />
      <TextAreaInput
        rows={4}
        prefixElement={
          <HashtagIcon className="h-4 w-4 inline" />
        }
        name="description"
        value={config?.description || ""}
        label="meta description"
        onChange={(e) =>
          onInputChange("description", e.target.value)
        }
      />

      <span className="font-bold mt-3 text-xs block">
        Head HTML
      </span>
      <CodeEditor
        className="bg-white rounded-lg min-h-[150px]"
        language="html"
        value={config?.headHtml}
        onChange={(e) =>
          onInputChange("headHtml", e.target.value)
        }
      />
      {/* <TextAreaInput rows={8} prefixElement={<CodeIcon className="h-4 w-4 inline" />} name="headHtml" value={config?.headHtml || ""} label="Head HTML" onChange={(e) => onInputChange("headHtml", e.target.value)} /> */}
      <span className="font-bold mt-3 text-xs block">
        Footer HTML
      </span>
      <CodeEditor
        className="bg-white rounded-lg min-h-[150px]"
        language="html"
        value={config?.footerHtml}
        onChange={(e) =>
          onInputChange("footerHtml", e.target.value)
        }
      />
    </div>
  );
};

export const PageSettings = () => {
  const {
    editingPageConfig,
    themeConfig,
    overrideConfig,
    setChangedPageInfo,
    resetModifications,
    setPageInfos,
    themeName,
    pageInfos,
    init,
    handleOpenPage,
  } = useThemeEditor();
  const { resetCurrentPage, deletePage } = usePageBuilder();
  const [, forceUpdate] = useState(0);
  const [config, setTmpConfig] = useState(
    editingPageConfig,
  );
  const genericPages = themeConfig?.genericPages ?? [
    { route: "pages/[slug]", name: "default" },
  ];

  const pageLayout = useRef(
    config?.layoutRoute ?? genericPages[0].route,
  );

  useEffect(() => {
    setTmpConfig(editingPageConfig);
  }, [editingPageConfig]);

  const handleChange = (
    prop: keyof TPageConfig,
    val: any,
  ) => {
    if (config?.isVirtual && prop === "route") {
      if (!val) val = "";
      const prefix = pageLayout.current.replace(
        "[slug]",
        "",
      );
      val = val.replace(prefix, "");
      val = val.replace(/\W/g, "-");
      val = prefix + val;
    }
    overrideConfig((prev) => {
      return {
        ...prev,
        [prop]: val,
        layoutRoute: pageLayout.current,
      };
    });
    setTmpConfig((prev) => {
      return {
        ...prev,
        [prop]: val,
        layoutRoute: pageLayout.current,
      };
    });
    setChangedPageInfo(true);
    // forceUpdate();
    forceUpdate((o) => o + 1);
  };

  const handleDeleteCurrentPage = async () => {
    if (!editingPageConfig?.route) return;

    setChangedPageInfo(false);
    resetModifications();
    await deletePage(editingPageConfig);
    await handleOpenPage(pageInfos.find(p => p.route === "index"))
  };

  return (
    <div className="w-full scrollbar-slim overflow-x-hidden overflow-y-auto">
      <PageMetaSettings
        onInputChange={handleChange}
        config={config}
      />
      <hr className="mt-12" />
      <div className="mt-2 text-xs px-4">
        <button
          onClick={resetCurrentPage}
          className="rounded-lg w-full p-3 transform transition-colors text-red-700 hover:bg-red-700 hover:text-red-100">
          reset page
        </button>
      </div>

      {config.isVirtual && (
        <>
          <hr className="mt-4" />
          <div className="mt-2 text-xs px-4">
            <button
              onClick={handleDeleteCurrentPage}
              className="rounded-lg w-full p-3 transform transition-colors text-red-700 hover:bg-red-700 hover:text-red-100">
              delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};
