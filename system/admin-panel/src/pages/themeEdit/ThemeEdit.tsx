import {
  getStoreItem,
  TCromwellBlockData,
  TPageConfig,
  TPageInfo,
  TPluginEntity,
} from "@cromwell/core";
import {
  getGraphQLClient,
  getRestApiClient,
} from "@cromwell/core-frontend";
import {
  ChevronLeftIcon,
  DeviceMobileIcon,
  DeviceTabletIcon,
} from "@heroicons/react/outline";
import { DesktopComputerIcon } from "@heroicons/react/solid";
import React from "react";
import {
  Link,
  RouteComponentProps,
} from "react-router-dom";

import { LoadingStatus } from "../../components/loadBox/LoadingStatus";
import { PageBuilderProvider } from "./hooks/usePageBuilder";
import {
  ThemeEditorProvider,
  useThemeEditor,
} from "./hooks/useThemeEditor";
import { PageBuilder } from "./pageBuilder/PageBuilder";
import { PageFrame } from "./pageEditor/PageEditor";
import { PageEditorSidebar } from "./pageEditorSidebar/PageEditorSidebar";
import { PageItem } from "./pageList/PageItem";
import { PageList } from "./pageList/PageList";
import styles from "./ThemeEdit.module.scss";
import { ThemeEditActions } from "./themeEditActions/ThemeEditActions";

export type TExtendedPageInfo = TPageInfo & {
  isSaved?: boolean;
  previewUrl?: string;
};

export type TEditorInstances = {
  pageBuilder?: PageBuilder;
  actions?: ThemeEditActions;
  // themeEditor?: ThemeEdit;
};

export type TExtendedPageConfig = TPageConfig &
  TExtendedPageInfo;

type ThemeEditState = {
  plugins: TPluginEntity[] | null;
  isPageLoading: boolean;
  loadingStatus: boolean;
};

export const InnerThemeEditor: React.FunctionComponent<
  RouteComponentProps
> = ({ history }) => {
  const {
    minimizeLeftbar,
    setMinimizeLeftbar,
    isPageLoading,
    frameWidth,
  } = useThemeEditor();

  return (
    <div className={`w-full h-full relative`}>
      <div className="bg-gray-900 h-14 w-full p-2 top-0 z-10 fixed">
        <div className="flex flex-row h-full w-full justify-between">
          <Link to="/" className="w-8">
            <img
              src="/admin/static/logo_small_black.svg"
              width="30px"
              className="m-2 my-1 w-8 self-center justify-self-start invert"
            />
          </Link>
          <div className="h-8 my-2 justify-self-end">
            <DeviceSwitcher />
          </div>
        </div>
      </div>
      <div className="flex flex-row builder select-none">
        <div
          className={`bg-white transform transition-all ${
            minimizeLeftbar
              ? "absolute left-0 top-14 w-56 h-9 overflow-hidden shadow-lg rounded-r-lg"
              : "w-72 h-screen pt-14 border-r border-gray-300"
          }`}>
          <div className="flex flex-row justify-between">
            <h2 className="text-xs py-2 px-4 text-gray-700">
              Pages
            </h2>
            <ChevronLeftIcon
              onClick={() => setMinimizeLeftbar((o) => !o)}
              className={`w-7 h-7 cursor-pointer hover:bg-gray-300 rounded-lg p-2 m-1 ${
                minimizeLeftbar ? "rotate-180" : ""
              }`}
            />
          </div>
          {!minimizeLeftbar && <PageList />}
        </div>
        <PageBuilderProvider>
          <div
            className={`w-full ${
              frameWidth > 1
                ? frameWidth === 4
                  ? "max-w-full"
                  : "w-[765px] h-[800px] mt-20 p-6 bg-black rounded-xl pb-14"
                : "w-[384px] h-[700px] mt-20 p-6 bg-black rounded-xl pb-14"
            } transform transition-all relative h-screen mx-auto pt-14`}>
            {!isPageLoading && <PageFrame />}
          </div>
          <PageEditorSidebar />
        </PageBuilderProvider>
      </div>
    </div>
  );
};

const DeviceSwitcher = () => {
  const { frameWidth, setFrameWidth } = useThemeEditor();
  return (
    <>
      <span
        className={`px-1 hover:text-indigo-300 cursor-pointer ${
          frameWidth <= 1 ? "text-white" : "text-gray-500"
        }`}
        onClick={() => setFrameWidth(0)}>
        <DeviceMobileIcon className="h-5 w-5 inline-block" />
      </span>
      <span
        className={`px-1 hover:text-indigo-300 cursor-pointer ${
          frameWidth > 1 && frameWidth < 4
            ? "text-white"
            : "text-gray-500"
        }`}
        onClick={() => setFrameWidth(2)}>
        <DeviceTabletIcon className="h-6 w-6 inline-block" />
      </span>
      <span
        className={`px-1 hover:text-indigo-300 cursor-pointer ${
          frameWidth === 4 ? "text-white" : "text-gray-500"
        }`}
        onClick={() => setFrameWidth(4)}>
        <DesktopComputerIcon className="h-6 w-6 inline-block" />
      </span>
    </>
  );
};

export const ThemeEditor: React.FunctionComponent<
  RouteComponentProps
> = (props) => {
  return (
    <ThemeEditorProvider>
      <InnerThemeEditor {...props} />
    </ThemeEditorProvider>
  );
};

export default ThemeEditor;

// export class ThemeEdit extends React.Component<
//   Partial<RouteComponentProps>,
//   ThemeEditState
// > {
//   // Keeps track of modifications that user made (added) currently. Does not store all mods from actual pageCofig!
//   // We need to send to the server only newly added modifications!
//   private changedModifications:
//     | TCromwellBlockData[]
//     | null
//     | undefined = null;
//   public getChangedModifications = () =>
//     this.changedModifications;

//   private pageBuilderContent =
//     React.createRef<HTMLDivElement>();

//   private editingPageConfig:
//     | TExtendedPageConfig
//     | null
//     | undefined = null;
//   public getEditingPageConfig = () =>
//     this.editingPageConfig;
//   public setEditingPageConfig = (
//     info: TPageConfig | null,
//   ) => (this.editingPageConfig = info);

//   private instances: TEditorInstances = {
//     themeEditor: this,
//   };

//   constructor(props: any) {
//     super(props);
//     this.state = {
//       plugins: null,
//       isPageLoading: false,
//       loadingStatus: false,
//     };
//   }

//   componentDidMount() {
//     this.init();
//   }

//   public init = async () => {
//     const graphQLClient = getGraphQLClient();

//     try {
//       const pluginEntities: TPluginEntity[] =
//         await graphQLClient.getAllEntities(
//           "Plugin",
//           graphQLClient.PluginFragment,
//           "PluginFragment",
//         );
//       if (pluginEntities && Array.isArray(pluginEntities)) {
//         this.setState({ plugins: pluginEntities });
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   private handlePageModificationsChange = (
//     modifications: TCromwellBlockData[] | null | undefined,
//   ) => {
//     this.changedModifications = modifications;
//   };

//   public pageChangeStart = () => {
//     this.instances.pageBuilder?.pageChangeStart();
//   };

//   public pageChangeFinish = () => {
//     this.instances.pageBuilder?.pageChangeFinish();
//   };

//   public resetModifications = () => {
//     this.changedModifications = null;
//   };

//   public undoModification = () => {
//     this.instances.pageBuilder.undoModification();
//   };

//   public redoModification = () => {
//     this.instances.pageBuilder.redoModification();
//   };

//   render() {
//     const { isPageLoading } = this.state;

//     return (
//       <div className="">
//         <div className={styles.header}>
//           <ThemeEditActions
//             instances={this.instances}
//             history={this.props.history}
//             undoModification={this.undoModification}
//             redoModification={this.redoModification}
//           />
//         </div>
//         {/* {(isPageLoading || !this.editingPageConfig) && (<LoadBox />)} */}
//         <div
//           className="h-screen"
//           ref={this.pageBuilderContent}>
//           {this.editingPageConfig && !isPageLoading && (
//             <PageBuilder
//               instances={this.instances}
//               plugins={this.state.plugins}
//               editingPageInfo={this.editingPageConfig}
//               onPageModificationsChange={
//                 this.handlePageModificationsChange
//               }
//             />
//           )}
//         </div>
//         <LoadingStatus
//           isActive={
//             this.state.loadingStatus || isPageLoading
//           }
//         />
//       </div>
//     );
//   }
// }

// export default ThemeEdit;
