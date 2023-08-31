import { IconButton } from '@components/buttons/IconButton';
import { TextButton } from '@components/buttons/TextButton';
import { getBlockInstance, getRandStr, sleep } from '@cromwell/core';
import { CList, getRestApiClient, Lightbox, TCList } from '@cromwell/core-frontend';
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  ChevronRightIcon,
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  FolderPlusIcon,
  HomeIcon,
  PaperAirplaneIcon,
  TrashIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { Breadcrumbs, TextField, Tooltip } from '@mui/material';
import React from 'react';

import { LoadingStatus } from '../loadBox/LoadingStatus';
import { askConfirmation } from '../modal/Confirmation';
import Modal from '../modal/Modal';
import Pagination from '../pagination/Pagination';
import { toast } from '../toast/toast';
import { FileItem } from './FileItem';
import styles from './FileManager.module.scss';
import { fileManagerStore } from './helpers';
import { IFileManager, TItemType, TState } from './types';

class FileManager
  extends React.Component<
    {
      isActive?: boolean;
    },
    TState
  >
  implements IFileManager
{
  private filePromise: Promise<string | undefined> | null = null;
  private fileResolver: (fileName?: string) => void;
  private currentPath: string = '/';
  private previousPaths: string[] = [];
  private nextPaths: string[] = [];
  private currentItems: string[] | null | undefined = null;
  private selectButton: React.RefObject<HTMLButtonElement> = React.createRef();
  private createFolderBtn: React.RefObject<HTMLButtonElement> = React.createRef();
  private deleteItemBtn: React.RefObject<HTMLButtonElement> = React.createRef();
  private downloadItemBtn: React.RefObject<HTMLButtonElement> = React.createRef();
  private createFolderWindow: React.RefObject<HTMLDivElement> = React.createRef();
  private listRef: React.RefObject<HTMLDivElement> = React.createRef();
  private selectedItem: HTMLLIElement | null = null;
  private selectedFileName: string | null = null;
  private pageSize = 21;
  private listId = 'FileManager_List_' + getRandStr(12);

  constructor(props) {
    super(props);

    this.state = {
      isActive: props?.isActive ?? false,
      isLoading: false,
      isSelecting: false,
      isCreatingFolder: false,
      hasLoadingStatus: false,
    };

    fileManagerStore.getState().setInstance(this);
  }

  private listEl: HTMLDivElement;

  componentDidUpdate() {
    if (this.listRef.current && this.listEl !== this.listRef.current) {
      if (this.listEl) {
        this.listEl.removeEventListener('drop', this.onDrop);
        this.listEl.removeEventListener('dragover', this.onDragover);
        this.listEl.removeEventListener('dragleave', this.onDragleave);
      }
      this.listEl = this.listRef.current;

      this.listEl.addEventListener('drop', this.onDrop);
      this.listEl.addEventListener('dragover', this.onDragover);
      this.listEl.addEventListener('dragleave', this.onDragleave);
    }
  }

  private setLightbox?: (open: boolean, index: number, images: string[]) => void;

  private onDrop = async (ev: DragEvent) => {
    ev.preventDefault();
    this.listEl.classList.remove(styles.dragOverList);

    if (!ev.dataTransfer) return;
    const files: File[] = [];

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          const file = ev.dataTransfer.items[i].getAsFile();
          if (file) files.push(file);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        files.push(ev.dataTransfer.files[i]);
      }
    }

    if (!files.length) return;

    this.setState({ isLoading: true });

    try {
      await getRestApiClient()?.uploadPublicFiles(this.currentPath, files);
      await this.fetchCurrentItems();
    } catch (e) {
      console.error(e);
    }
    this.setState({ isLoading: false });
  };

  private onDragover = (event: DragEvent) => {
    event.preventDefault();
    this.listEl.classList.add(styles.dragOverList);
  };

  private onDragleave = () => {
    this.listEl.classList.remove(styles.dragOverList);
  };

  private openHome = async () => {
    this.currentPath = '/';
    this.currentItems = [];
    this.setState({ isActive: true });
    await this.fetchCurrentItems();
  };

  private fetchCurrentItems = async () => {
    this.setState({ isLoading: true });
    try {
      this.currentItems = (await this.getFilesInPath(this.currentPath)) || [];
      this.currentItems.sort((a, b) => (a < b ? -1 : 1));
      this.currentItems = [
        ...this.currentItems.filter((item) => this.getItemType(item) === 'folder'),
        ...this.currentItems.filter((item) => this.getItemType(item) !== 'folder'),
      ];
    } catch (e) {
      console.error(e);
      if (this.currentPath !== '/') {
        // Path not found
        await this.openHome();
      }
    }
    this.setState({ isLoading: false });
  };

  public open: IFileManager['open'] = async (settings) => {
    if (settings?.initialPath) {
      this.openPath(settings.initialPath);
    } else if (settings?.initialFileLocation) {
      this.openFileLocation(settings.initialFileLocation, true);
    } else {
      this.openHome();
    }
  };

  public getPhoto: IFileManager['getPhoto'] = async (settings) => {
    this.filePromise = new Promise((resolver) => {
      this.fileResolver = resolver;
    });
    this.setState({ isSelecting: true, selectingType: 'image' });
    this.open(settings);

    return this.filePromise;
  };

  private getFilesInPath = (path?: string) => {
    return getRestApiClient()?.readPublicDir(path, { disableLog: true });
  };

  private createFolder = async (dirName: string) => {
    try {
      await getRestApiClient()?.createPublicDir(dirName, this.currentPath);
    } catch (e) {
      console.error(e);
    }
  };

  private getItemType = (fileName): TItemType => {
    let itemType: TItemType = 'folder';
    if (fileName.includes('.')) {
      const extension = fileName.split('.').splice(-1, 1)[0].toLowerCase();
      const supportedImageExtensions = ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif', 'bmp', 'ico'];
      if (supportedImageExtensions.includes(extension)) {
        itemType = 'image';
      } else {
        itemType = 'file';
      }
    }
    return itemType;
  };

  private goBack = () => {
    this.nextPaths.push(this.currentPath);
    const prev = this.previousPaths.pop();
    if (prev) {
      this.currentPath = prev;
      this.applyNavigate();
    }
  };

  private goForward = () => {
    this.previousPaths.push(this.currentPath);
    const next = this.nextPaths.pop();
    if (next) {
      this.currentPath = next;
      this.applyNavigate();
    }
  };

  private openFolder = (folderName: string) => {
    this.previousPaths.push(this.currentPath);
    this.nextPaths = [];
    this.currentPath = this.normalize(this.currentPath + '/' + folderName);
    this.applyNavigate();
  };

  private openPath = async (fullPath: string) => {
    this.setState({ isActive: true });
    fullPath = this.normalize(fullPath);
    this.previousPaths.push(this.currentPath);
    this.nextPaths = [];
    this.currentPath = this.normalize('/' + fullPath);
    await this.fetchCurrentItems();
  };

  private openFileLocation = async (fullPath: string, isSelecting?: boolean) => {
    fullPath = this.normalize(fullPath);
    const paths = fullPath.split('/');
    paths.pop();
    await this.openPath(paths.join('/'));

    // Find page of selected file
    const itemToOpen = fullPath.split('/').pop();
    let index = 0;
    this.currentItems?.forEach((item, idx) => item === itemToOpen && (index = idx));

    await sleep(0.2);

    const list = getBlockInstance<TCList>(this.listId)?.getContentInstance();
    const page = Math.ceil((index + 1) / this.pageSize);
    list?.openPage(page);

    if (itemToOpen) {
      setTimeout(() => {
        if (isSelecting) {
          this.selectItem(itemToOpen);
          this.selectedItem?.scrollIntoView();
        }
      }, 100);
    }
  };

  private applyNavigate = () => {
    this.fetchCurrentItems();
    if (this.selectedItem) this.selectedItem.classList.remove(styles.selectedItem);
    this.selectedItem = null;
    this.selectedFileName = null;
    if (this.selectButton.current) this.selectButton.current.style.opacity = '0.5';
    if (this.deleteItemBtn.current) this.deleteItemBtn.current.style.opacity = '0.5';
    if (this.downloadItemBtn.current) this.downloadItemBtn.current.style.opacity = '0.5';
  };

  private onItemClick = (itemName: string) => () => {
    const target = document.getElementById('item__' + itemName) as HTMLLIElement;
    if (!target) return;

    const isDoubleClick = this.selectedItem === target;
    const itemType = this.getItemType(itemName);

    if (!isDoubleClick) {
      this.selectItem(itemName);
    }

    if (itemType === 'folder') {
      if (isDoubleClick) {
        this.openFolder(itemName);
      }
    }
    if (itemType === 'image') {
      // this.openPreview(itemName);
    }
  };

  private selectItem = (itemName: string) => {
    if (this.selectedItem) this.selectedItem.classList.remove(styles.selectedItem);
    document.querySelectorAll('.' + styles.selectedItem).forEach((item) => {
      item.classList.remove(styles.selectedItem);
    });

    this.selectedFileName = itemName;

    const target = document.getElementById('item__' + itemName) as HTMLLIElement | undefined;
    const itemType = this.getItemType(itemName);

    if (target) {
      this.selectedItem = target;
      this.selectedItem?.classList.add(styles.selectedItem);
    }

    if (this.state.isSelecting && this.selectButton.current && itemType !== 'folder') {
      if (this.state.selectingType === 'image') {
        if (itemType === 'image') {
          this.selectButton.current.style.opacity = '1';
        } else {
          this.selectButton.current.style.opacity = '0.5';
        }
      } else {
        this.selectButton.current.style.opacity = '1';
      }
    }

    if (this.deleteItemBtn.current) this.deleteItemBtn.current.style.opacity = '1';
    if (this.downloadItemBtn.current) this.downloadItemBtn.current.style.opacity = '1';
  };

  private normalize = (path: string) => {
    return path.replace(/\/\//g, '/').replace(/\/\//g, '/');
  };

  private openPreview = (fileName: string) => {
    const index = this.currentItems.indexOf(fileName);

    this.setLightbox?.(
      true,
      index,
      this.currentItems.map((fileName) => this.normalize(`/${this.currentPath}/${fileName}`)),
    );
  };

  private handleApplySelect = () => {
    if (this.selectedFileName && this.fileResolver) {
      const itemType = this.getItemType(this.selectedFileName);
      if (this.state.selectingType === 'image' && itemType !== 'image') return;

      this.fileResolver(this.normalize(`/${this.currentPath}/${this.selectedFileName}`));
      this.setState({ isSelecting: false, isActive: false, selectingType: undefined });
    }
  };

  private handleClose = () => {
    if (this.fileResolver) this.fileResolver(undefined);
    this.setState({ isSelecting: false, isActive: false, isLoading: false, selectingType: undefined });
    this.currentItems = null;
  };

  private handleCreateFolder = () => {
    if (this.createFolderWindow.current) this.createFolderWindow.current.style.display = 'flex';
  };
  private handleCloseCreateFolder = () => {
    if (this.createFolderWindow.current) this.createFolderWindow.current.style.display = 'none';
  };
  private handleApplyCreateFolder = async () => {
    const input = document.getElementById('create-new-folder-input') as HTMLInputElement;
    this.handleCloseCreateFolder();

    this.setState({ isLoading: true });
    if (input?.value) {
      try {
        await this.createFolder(input.value);
        await this.fetchCurrentItems();
      } catch (e) {
        console.error(e);
      }
    }
    this.setState({ isLoading: false });
  };

  private handleDeleteItem = async () => {
    if (this.selectedItem && this.selectedFileName) {
      const confirm = await askConfirmation({
        title: `Delete ${this.selectedFileName} ?`,
      });
      if (!confirm) return;
      try {
        await getRestApiClient()?.removePublicDir(this.selectedFileName, this.currentPath);
        this.fetchCurrentItems();
      } catch (e) {
        console.error(e);
      }
    }
  };

  private handleDownloadItem = async () => {
    if (this.selectedItem && this.selectedFileName) {
      this.setState({ hasLoadingStatus: true });
      try {
        await getRestApiClient()?.downloadPublicFile(
          this.selectedFileName,
          this.getItemType(this.selectedFileName) === 'folder' ? 'dir' : 'file',
          this.currentPath,
        );
      } catch (e) {
        toast.error(e);
        console.error(e);
      }
      this.setState({ hasLoadingStatus: false });
    }
  };

  private handleUploadFile = async () => {
    const input = document.getElementById('hidden-file-upload-input') as HTMLInputElement;
    if (!input) return;

    input.click();
  };

  private onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;
    if (!files?.length) return;

    this.setState({ isLoading: true });

    try {
      await getRestApiClient()?.uploadPublicFiles(this.currentPath, Array.from(files));
      await this.fetchCurrentItems();
    } catch (e) {
      console.error(e);
    }

    e.target.files = new DataTransfer().files;

    this.setState({ isLoading: false });
  };

  render() {
    const breadcrumbsPath = this.currentPath.split('/').filter(Boolean).join('/');

    return (
      <Modal
        className={styles.FileManager}
        open={this.state.isActive}
        blurSelector="#root"
        onClose={this.handleClose}
        disableEnforceFocus
        modalClassName={styles.modalWrapper}
      >
        <div className={styles.header} data-testid={'FileManagerContainer'}>
          <div className={styles.headerLeft}>
            <Tooltip title="Back">
              <span>
                <IconButton className={styles.action} disabled={this.previousPaths.length === 0} onClick={this.goBack}>
                  <ArrowLeftCircleIcon className="w-6 h-6" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Forward">
              <span>
                <IconButton className={styles.action} disabled={this.nextPaths.length === 0} onClick={this.goForward}>
                  <ArrowRightCircleIcon className="w-6 h-6" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Create folder">
              <IconButton className={styles.action} onClick={this.handleCreateFolder} ref={this.createFolderBtn}>
                <FolderPlusIcon className="w-6 h-6" />
              </IconButton>
            </Tooltip>
            <div ref={this.createFolderWindow} className={styles.createFolderWindow} style={{ display: 'none' }}>
              <TextField variant="standard" id="create-new-folder-input" placeholder="Folder name" />
              <IconButton onClick={this.handleApplyCreateFolder}>
                <PaperAirplaneIcon className="w-6 h-6" />
              </IconButton>
              <IconButton onClick={this.handleCloseCreateFolder}>
                <XCircleIcon className="w-6 h-6" />
              </IconButton>
            </div>
            <Tooltip title="Upload file">
              <IconButton onClick={this.handleUploadFile} className={styles.action}>
                <CloudArrowUpIcon className="w-6 h-6" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download file">
              <IconButton
                className={styles.action}
                ref={this.downloadItemBtn}
                style={{ opacity: '0.5' }}
                onClick={this.handleDownloadItem}
              >
                <CloudArrowDownIcon className="w-6 h-6" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                className={styles.action}
                ref={this.deleteItemBtn}
                style={{ opacity: '0.5' }}
                onClick={this.handleDeleteItem}
              >
                <TrashIcon className="w-6 h-6" />
              </IconButton>
            </Tooltip>
          </div>
          <div className={styles.headerRight}>
            {this.state.isSelecting && (
              <TextButton
                variant="filled"
                className={styles.selectBtn}
                onClick={this.handleApplySelect}
                ref={this.selectButton}
                style={{ opacity: '0.5' }}
                role="button"
              >
                Select
              </TextButton>
            )}
            <Tooltip title="Close">
              <IconButton className={styles.action} onClick={this.handleClose}>
                <XCircleIcon className="w-6 h-6" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className={styles.breadcrumbs}>
          <Breadcrumbs separator={<ChevronRightIcon className="w-4 h-4" />} aria-label="breadcrumb">
            <div className={styles.pathChunk} onClick={() => this.openPath('/')} key={'/'}>
              <HomeIcon className="w-5 h-5" />
            </div>
            {breadcrumbsPath.split('/').map((pathChunk, index) => {
              const fullPath = breadcrumbsPath
                .split('/')
                .slice(0, index + 1)
                .join('/');
              return (
                <p className={styles.pathChunk} onClick={() => this.openPath(fullPath)} key={index}>
                  {pathChunk}
                </p>
              );
            })}
          </Breadcrumbs>
        </div>
        <div className={styles.listContainer} ref={this.listRef} id="file-list-container">
          <div className={styles.dragAreaHighlight}></div>
          {this.currentItems && (
            <CList
              className={styles.list}
              cssClasses={{ page: styles.content }}
              id={this.listId}
              dataList={this.currentItems}
              ListItem={FileItem}
              pageSize={this.pageSize}
              usePagination
              listItemProps={{
                currentPath: this.currentPath,
                getItemType: this.getItemType,
                normalize: this.normalize,
                onItemClick: this.onItemClick,
                openPreview: this.openPreview,
                selectedFileName: this.selectedFileName,
              }}
              elements={{
                pagination: Pagination,
              }}
            />
          )}
          {this.state.isLoading && (
            <div className="flex flex-row h-full w-full top-0 left-0 z-30 absolute backdrop-filter backdrop-blur-md items-center">
              <ArrowPathIcon className="bg-white rounded-full mx-auto h-16 p-2 animate-spin fill-indigo-600 w-16 self-center" />
            </div>
          )}
        </div>
        <Lightbox
          getState={(setOpen) => {
            this.setLightbox = setOpen;
          }}
        />
        <div style={{ display: 'none' }}>
          <input type="file" id="hidden-file-upload-input" multiple onChange={(e) => this.onFileInputChange(e)} />
        </div>
        <LoadingStatus isActive={this.state?.hasLoadingStatus} />
      </Modal>
    );
  }
}

export default FileManager;
