import {
  getStoreItem,
  sleep,
  TCromwellBlockData,
  TCromwellStore,
  TPageConfig,
  TPalette,
  TPluginEntity,
  TThemeConfig,
} from "@cromwell/core";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  TEditorInstances,
  TExtendedPageConfig,
  TExtendedPageInfo,
} from "../ThemeEdit";
import queryString from "query-string";
import {
  getGraphQLClient,
  getRestApiClient,
} from "@cromwell/core-frontend";

const unsavedPrompt =
  "Your unsaved changes will be lost. Do you want to discard and leave this page?";

const useThemeEditorContext = () => {
  const [pageInfos, setPageInfos] = useState<
    TExtendedPageInfo[]
  >([]);
  const [editingPageConfig, setEditingPageConfig] =
    useState<TExtendedPageConfig | null | undefined>(null);
  const [pageConfigOverrides, overrideConfig] = useState<Partial<TExtendedPageConfig> | null |undefined>(null);
  const [themeName] = useState<string>(
    getStoreItem("cmsSettings")?.themeName,
  );
  const [themePalette, setThemePalette] = useState<TPalette>();
  const [minimizeLeftbar, setMinimizeLeftbar] =
    useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [rerender, forceRerender] = useState(0);
  const [changedPalette, setChangedPalette] =
    useState(false);
  const [changedPageInfo, setChangedPageInfo] =
    useState(false);
  const [changedModifications, setChangedModifications] =
    useState<TCromwellBlockData[] | null | undefined>(null);
  const [plugins, setPlugins] = useState<TPluginEntity[]>(
    [],
  );
  const [themeConfig, setThemeConfig] = useState<TThemeConfig>(null);
  // const [isChangingPage, setIsChangingPage] = useState(false);
  const pageFrameRef = useRef<HTMLIFrameElement>();
  const pageBuilderContent = useRef<HTMLDivElement>();
  const [frameWidth, setFrameWidth] = useState<0|1|2|3|4>(4);

  const hasUnsavedModifications =
    changedPalette ||
    !!(changedPageInfo || changedModifications?.length > 0);

  const fetchPageInfos = useCallback(async () => {
    try {
      let infos: TExtendedPageInfo[] =
        await getRestApiClient()?.getPagesInfo(themeName);
      if (infos) {
        infos = infos.map((page) => {
          const isGeneric =
            page.route &&
            (page.route.endsWith("[slug]") ||
              page.route.endsWith("[id]"));
          if (isGeneric && !page.previewUrl) {
            page.previewUrl = page.route
              .replace("[slug]", "1")
              .replace("[id]", "1");
          }
          return page;
        });

        setPageInfos(infos);
        return infos;
      }
    } catch (e) {
      console.error(e);
    }
  }, [themeName]);


  const handleOpenPage = useCallback(
    async (pageInfo: TExtendedPageInfo) => {
      if (
        hasUnsavedModifications &&
        !window.confirm(unsavedPrompt)
      ) return;
      setIsPageLoading(true);
      setChangedPageInfo(false);
      setChangedModifications(null);
      overrideConfig(null);

      let pageConfig: TPageConfig | undefined;
      if (pageInfo?.isSaved !== false) {
        try {
          if (pageInfo.route && pageInfo.route !== "") {
            pageConfig =
              await getRestApiClient()?.getPageConfig(
                pageInfo.route,
                themeName,
              );
          }

          pageInfo = Object.assign(
            {},
            pageInfo,
            pageConfig,
          );
          try {
            await fetch(
              `${window.location.origin}/${
                pageInfo.previewUrl ?? pageInfo.route
              }`,
            );
          } catch (error) {
            console.error(error);
          }
        } catch (e) {
          console.error(e);
        }
      }
      forceRerender((o) => o + 1);

      pageConfig = Object.assign({}, pageInfo, pageConfig);
      pageConfig.modifications = [
        ...(pageConfig.modifications ?? []),
      ];
      setEditingPageConfig(pageConfig);
      // setChangedPageInfo(pageInfo.isSaved)

      setIsPageLoading(false);
      setTimeout(() => {
        setLoading(false);
      }, 300);

      const parsedUrl = queryString.parseUrl(
        window.location.href,
        { parseFragmentIdentifier: true },
      );
      parsedUrl.query["page"] = pageInfo.route;
      window.history.pushState(
        {},
        "",
        queryString.stringifyUrl(parsedUrl, {
          encode: false,
        }),
      );
      const palette = await getRestApiClient().getThemePalette(themeName);
      if (palette) {
         setThemePalette(palette)
      }
    },
    [hasUnsavedModifications],
  );

  const handlePageModificationsChange = useCallback(
    (
      modifications:
        | TCromwellBlockData[]
        | null
        | undefined,
    ) => {
      setChangedModifications(modifications);
    },
    [],
  );

  const resetModifications = useCallback(() => {
    setChangedModifications(null);
  }, []);

  const fetchPlugins = useCallback(async () => {
    const graphQLClient = getGraphQLClient();

    try {
      const pluginEntities: TPluginEntity[] =
        await graphQLClient.getAllEntities(
          "Plugin",
          graphQLClient.PluginFragment,
          "PluginFragment",
        );
      if (pluginEntities && Array.isArray(pluginEntities)) {
        setPlugins(pluginEntities);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const init = useCallback(async () => {
    const infos = await fetchPageInfos();
    await fetchPlugins();

    const parsedUrl = queryString.parseUrl(
      window.location.href,
      { parseFragmentIdentifier: true },
    );
    const route = parsedUrl.query["page"];

    const info =
      infos?.find((i) => i.route === route) ??
      pageInfos?.[0];
    if (info) handleOpenPage(info);
    
    const themeConf = await getRestApiClient().getThemeConfig(themeName)
    try {
      if (themeConf) {
        setThemeConfig(themeConfig)
      }
    } catch (e) {
      console.error(e);
    }
  }, [fetchPageInfos, fetchPlugins, handleOpenPage, themeName]);

  useEffect(() => {
    init();
  }, []);

  const forceUpdate = () => forceRerender(o => o + 1);

  return {
    pageInfos,
    editingPageConfig,
    themeName,
    minimizeLeftbar,
    isLoading,
    isPageLoading,
    rerender,
    changedPageInfo,
    changedPalette,
    changedModifications,
    plugins,
    setPageInfos,
    pageConfigOverrides,
    overrideConfig,
    setEditingPageConfig,
    setMinimizeLeftbar,
    setLoading,
    themePalette,
    setThemePalette,
    themeConfig,
    setThemeConfig,
    setIsPageLoading,
    forceRerender,
    setChangedPalette,
    setChangedPageInfo,
    setChangedModifications,
    hasUnsavedModifications,
    fetchPageInfos,
    handleOpenPage,
    pageFrameRef,
    handlePageModificationsChange,
    resetModifications,
    frameWidth,
    init,
    setFrameWidth,
    forceUpdate,
  };
};

export const useThemeEditor = () => {
  return React.useContext(ThemeEditorContext);
};

type ContextType = ReturnType<typeof useThemeEditorContext>;
const Empty = {} as ContextType;

const ThemeEditorContext =
  React.createContext<ContextType>(Empty);

export const ThemeEditorProvider = ({ children }) => {
  const value = useThemeEditorContext();

  return (
    <ThemeEditorContext.Provider value={value}>
      {children}
    </ThemeEditorContext.Provider>
  );
};
