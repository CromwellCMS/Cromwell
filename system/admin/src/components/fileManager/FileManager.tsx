import { getBlockInstance, isServer } from '@cromwell/core';
import { CList, getRestApiClient, TCList } from '@cromwell/core-frontend';
import { Breadcrumbs, Button, IconButton, TextField, Tooltip } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowForward as ArrowForwardIcon,
  Cancel as CancelIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  CreateNewFolder as CreateNewFolderIcon,
  DeleteForever as DeleteForeverIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Publish as PublishIcon,
} from '@mui/icons-material';
import React from 'react';

import LoadBox from '../loadBox/LoadBox';
import { LoadingStatus } from '../loadBox/LoadingStatus';
import { askConfirmation } from '../modal/Confirmation';
import Modal from '../modal/Modal';
import Pagination from '../pagination/Pagination';
import { toast } from '../toast/toast';
import { FileItem } from './FileItem';
import styles from './FileManager.module.scss';
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
  private currentPath: string | null = '/';
  private previousPaths: string[] = [];
  private nextPaths: string[] = [];
  private currentItems: string[] | null | undefined = null;
  private photoPreview: React.RefObject<HTMLImageElement> = React.createRef();
  private photoPreviewContainer: React.RefObject<HTMLDivElement> = React.createRef();
  private selectButton: React.RefObject<HTMLButtonElement> = React.createRef();
  private createFolderBtn: React.RefObject<HTMLButtonElement> = React.createRef();
  private deleteItemBtn: React.RefObject<HTMLButtonElement> = React.createRef();
  private downloadItemBtn: React.RefObject<HTMLButtonElement> = React.createRef();
  private createFolderWindow: React.RefObject<HTMLDivElement> = React.createRef();
  private listRef: React.RefObject<HTMLDivElement> = React.createRef();
  private selectedItem: HTMLLIElement | null = null;
  private selectedFileName: string | null = null;
  private pageSize = 21;
  private listId = 'FileManager_List';

  constructor(props) {
    super(props);

    this.state = {
      isActive: props?.isActive ?? false,
      isLoading: false,
      isSelecting: false,
      isCreatingFolder: false,
      hasLoadingStatus: false,
    };

    if (!isServer()) window.CromwellFileManager = this;
    else global.CromwellFileManager = this;
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
          files.push(ev.dataTransfer.items[i].getAsFile());
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
      this.currentItems = await this.getFilesInPath(this.currentPath);
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

  private createFolder = async (dirName?: string) => {
    try {
      await getRestApiClient()?.createPublicDir(dirName, this.currentPath);
    } catch (e) {
      console.error(e);
    }
  };

  private getItemType = (fileName): TItemType => {
    let itemType: TItemType = 'folder';
    if (fileName.includes('.')) {
      const extension = fileName.split('.').splice(-1, 1)[0];
      if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'svg') {
        itemType = 'image';
      } else {
        itemType = 'file';
      }
    }
    return itemType;
  };

  private goBack = () => {
    this.nextPaths.push(this.currentPath);
    this.currentPath = this.previousPaths.pop();
    this.applyNavigate();
  };

  private goForward = () => {
    this.previousPaths.push(this.currentPath);
    this.currentPath = this.nextPaths.pop();
    this.applyNavigate();
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
    this.currentItems.forEach((item, idx) => item === itemToOpen && (index = idx));

    const list = getBlockInstance<TCList>(this.listId)?.getContentInstance();
    const page = Math.ceil((index + 1) / this.pageSize);
    list?.openPage(page);

    setTimeout(() => {
      if (isSelecting) {
        this.selectItem(itemToOpen);
        this.selectedItem?.scrollIntoView();
      }
    }, 100);
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

    const target = document.getElementById('item__' + itemName) as HTMLLIElement | undefined;
    const itemType = this.getItemType(itemName);

    this.selectedItem = target;
    this.selectedFileName = itemName;
    this.selectedItem?.classList.add(styles.selectedItem);

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
    if (this.photoPreview.current && this.photoPreviewContainer.current) {
      this.photoPreviewContainer.current.style.display = 'flex';
      this.photoPreview.current.src = this.normalize(`/${this.currentPath}/${fileName}`);
    }
  };

  private closePreview = () => {
    this.photoPreviewContainer.current.style.display = 'none';
    this.photoPreview.current.src = '';
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

    input.addEventListener('change', async (e: any) => {
      // Get the selected file from the input element
      const files = e.target?.files;
      if (!files?.length) return;

      this.setState({ isLoading: true });

      try {
        await getRestApiClient()?.uploadPublicFiles(this.currentPath, files);
        await this.fetchCurrentItems();
      } catch (e) {
        console.error(e);
      }

      this.setState({ isLoading: false });
    });
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
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Tooltip title="Back">
              <span>
                <IconButton className={styles.action} disabled={this.previousPaths.length === 0} onClick={this.goBack}>
                  <ArrowBackIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Forward">
              <span>
                <IconButton className={styles.action} disabled={this.nextPaths.length === 0} onClick={this.goForward}>
                  <ArrowForwardIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Create folder">
              <IconButton className={styles.action} onClick={this.handleCreateFolder} ref={this.createFolderBtn}>
                <CreateNewFolderIcon />
              </IconButton>
            </Tooltip>
            <div ref={this.createFolderWindow} className={styles.createFolderWindow} style={{ display: 'none' }}>
              <TextField variant="standard" id="create-new-folder-input" />
              <IconButton onClick={this.handleApplyCreateFolder}>
                <CheckCircleOutlineIcon />
              </IconButton>
              <IconButton onClick={this.handleCloseCreateFolder}>
                <CancelIcon />
              </IconButton>
            </div>
            <Tooltip title="Upload file">
              <IconButton onClick={this.handleUploadFile} className={styles.action}>
                <PublishIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                className={styles.action}
                ref={this.deleteItemBtn}
                style={{ opacity: '0.5' }}
                onClick={this.handleDeleteItem}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download file">
              <IconButton
                className={styles.action}
                ref={this.downloadItemBtn}
                style={{ opacity: '0.5' }}
                onClick={this.handleDownloadItem}
              >
                <ArrowDownwardIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div className={styles.headerRight}>
            {this.state.isSelecting && (
              <Button
                variant="contained"
                color="primary"
                className={styles.selectBtn}
                size="small"
                onClick={this.handleApplySelect}
                ref={this.selectButton}
                style={{ opacity: '0.5' }}
                role="button"
              >
                Select
              </Button>
            )}
            <Tooltip title="Close">
              <IconButton className={styles.action} onClick={this.handleClose}>
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className={styles.breadcrumbs}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <div className={styles.pathChunk} onClick={() => this.openPath('/')} key={'/'}>
              <HomeIcon style={{ fontSize: '21px' }} />
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
          {this.state.isLoading && <LoadBox absolute />}
        </div>
        <div
          style={{ display: 'none' }}
          ref={this.photoPreviewContainer}
          className={styles.photoPreviewContainer}
          onClick={this.closePreview}
        >
          <IconButton className={styles.photoPreviewCloseBtn} onClick={this.closePreview}>
            <CancelIcon className={styles.photoPreviewCloseIcon} />
          </IconButton>
          <img className={styles.photoPreview} ref={this.photoPreview} onClick={(event) => event.stopPropagation()} />
        </div>
        <div style={{ display: 'none' }}>
          <input type="file" id="hidden-file-upload-input" multiple />
        </div>
        <LoadingStatus isActive={this.state?.hasLoadingStatus} />
      </Modal>
    );
  }
}

export default FileManager;
