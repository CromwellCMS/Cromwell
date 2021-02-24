import { apiV1BaseRoute, isServer, serviceLocator } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { Button, IconButton, MenuItem, TextField, Tooltip } from '@material-ui/core';
import {
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    Cancel as CancelIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    CreateNewFolder as CreateNewFolderIcon,
    DeleteForever as DeleteForeverIcon,
    Description as DescriptionIcon,
    FolderOpen as FolderOpenIcon,
    Publish as PublishIcon,
    ZoomIn as ZoomInIcon,
} from '@material-ui/icons';
import React from 'react';
import LazyLoad from 'react-lazy-load';
import LoadBox from '../loadBox/LoadBox';
import Modal from '../modal/Modal';
import styles from './FileManager.module.scss';
import { IFileManager, TItemType, TState } from './types';


class FileManager extends React.Component<any, TState> implements IFileManager {

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
    private createFolderWindow: React.RefObject<HTMLDivElement> = React.createRef();
    private selectedItem: HTMLLIElement | null = null;
    private selectedFileName: string | null = null;


    constructor(props) {
        super(props);

        this.state = {
            isActive: false,
            isLoading: false,
            isSelecting: false,
            isCreatingFolder: false,
        };

        if (!isServer()) window.CromwellFileManager = this;
        else global.CromwellFileManager = this;
    }

    private open = async () => {
        this.currentPath = '/';
        this.setState({ isActive: true });
        await this.fetchCurrentItems();
    }

    private fetchCurrentItems = async () => {
        this.setState({ isLoading: true });
        this.currentItems = await this.getFilesInPath(this.currentPath);
        this.setState({ isLoading: false });
    }

    public getPhoto = async (settings?: {
        initialPath?: string;
    }) => {
        this.currentPath = settings?.initialPath ?? '/';
        this.filePromise = new Promise(resolver => {
            this.fileResolver = resolver;
        });
        this.open();
        this.setState({ isSelecting: true })
        return this.filePromise;
    }

    private getFilesInPath = (path?: string) => {
        return getRestAPIClient()?.readPublicDir(path);
    }

    private createFolder = async (dirName?: string) => {
        try {
            await getRestAPIClient()?.createPublicDir(dirName, this.currentPath)
        } catch (e) {
            console.error(e)
        }
    }

    private getItemType = (fileName): TItemType => {
        let itemType: TItemType = 'folder';
        if (fileName.includes('.')) {
            const extension = fileName.split('.').splice(-1, 1)[0];
            if (extension === 'jpg' || extension === 'jpeg' ||
                extension === 'png' || extension === 'svg') {
                itemType = 'image';
            }
            else {
                itemType = 'file';
            }
        }
        return itemType;
    }

    private goBack = () => {
        this.nextPaths.push(this.currentPath);
        this.currentPath = this.previousPaths.pop();
        this.applyNavigate();
    }

    private goForward = () => {
        this.previousPaths.push(this.currentPath);
        this.currentPath = this.nextPaths.pop();
        this.applyNavigate();
    }

    private openDir = (dirName: string) => {
        this.previousPaths.push(this.currentPath);
        this.nextPaths = [];
        this.currentPath = this.normalize(this.currentPath + '/' + dirName);
        this.applyNavigate();
    }

    private applyNavigate = () => {
        this.fetchCurrentItems();
        if (this.selectedItem) this.selectedItem.classList.remove(styles.selectedItem);
        this.selectedItem = null;
        this.selectedFileName = null;
        if (this.selectButton.current) this.selectButton.current.style.opacity = '0.5';
        if (this.deleteItemBtn.current) this.deleteItemBtn.current.style.opacity = '0.5';
    }

    private onItemClick = (itemName: string) => (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const target = document.getElementById('item__' + itemName) as HTMLLIElement;
        if (!target) return;

        const isDoubleClick = this.selectedItem === target;
        const itemType = this.getItemType(itemName);

        if (!isDoubleClick) {
            if (this.selectedItem) this.selectedItem.classList.remove(styles.selectedItem);
            this.selectedItem = target;
            this.selectedFileName = itemName;
            this.selectedItem.classList.add(styles.selectedItem);

            if (this.state.isSelecting && this.selectButton.current && itemType !== 'folder')
                this.selectButton.current.style.opacity = '1';

            if (this.deleteItemBtn.current) this.deleteItemBtn.current.style.opacity = '1';
        }


        if (itemType === 'folder') {
            if (isDoubleClick) {
                this.openDir(itemName);
            }
        }
        if (itemType === 'image') {
            // this.openPreview(itemName);
        }
    }

    private normalize = (path: string) => {
        return path.replace(/\/\//g, '/').replace(/\/\//g, '/');
    }

    private openPreview = (fileName: string) => {
        if (this.photoPreview.current && this.photoPreviewContainer.current) {
            this.photoPreviewContainer.current.style.display = 'flex';
            this.photoPreview.current.src = this.normalize(`/${this.currentPath}/${fileName}`);
        }
    }

    private closePreview = () => {
        this.photoPreviewContainer.current.style.display = 'none';
        this.photoPreview.current.src = '';
    }

    private handleApplySelect = () => {
        if (this.selectedFileName && this.fileResolver) {
            this.fileResolver(this.normalize(`/${this.currentPath}/${this.selectedFileName}`));
            this.setState({ isSelecting: false, isActive: false })
        }
    }

    private handleClose = () => {
        if (this.fileResolver) this.fileResolver(undefined);
        this.setState({ isSelecting: false, isActive: false, isLoading: false })
    }

    private handleCreateFolder = () => {
        if (this.createFolderWindow.current)
            this.createFolderWindow.current.style.display = 'flex';
    }
    private handleCloseCreateFolder = () => {
        if (this.createFolderWindow.current)
            this.createFolderWindow.current.style.display = 'none';

    }
    private handleApplyCreateFolder = async () => {
        const input = document.getElementById('create-new-folder-input') as HTMLInputElement;
        this.handleCloseCreateFolder();

        this.setState({ isLoading: true });
        if (input && input.value && input.value !== '') {
            await this.createFolder(input.value);
            this.fetchCurrentItems();
        }
    }

    private handleDeleteItem = async () => {
        if (this.selectedItem && this.selectedFileName) {
            try {
                await getRestAPIClient()?.removePublicDir(this.selectedFileName, this.currentPath)
                this.fetchCurrentItems();
            } catch (e) {
                console.error(e)
            }
        }
    }

    private handleUploadFile = async () => {
        const input = document.getElementById('hidden-file-upload-input') as HTMLInputElement;
        if (!input) return;

        input.click();

        input.addEventListener("change", async (e) => {
            // Get the selected file from the input element
            //@ts-ignore
            var files = e.target?.files;
            if (!files) return;

            this.setState({ isLoading: true });

            try {
                await getRestAPIClient()?.uploadPublicFiles(this.currentPath, files)
                this.fetchCurrentItems();
            } catch (e) {
                console.error(e)
            }

        })
    }

    render() {
        return (
            <Modal
                className={styles.FileManager}
                open={this.state.isActive}
                blurSelector="#root"
                onClose={this.handleClose}
                disableEnforceFocus
            >
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <Tooltip title="Back">
                            <span>
                                <IconButton className={styles.action}
                                    disabled={this.previousPaths.length === 0}
                                    onClick={this.goBack}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Forward">
                            <span>
                                <IconButton className={styles.action}
                                    disabled={this.nextPaths.length === 0}
                                    onClick={this.goForward}
                                >
                                    <ArrowForwardIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Create new folder">
                            <IconButton className={styles.action}
                                onClick={this.handleCreateFolder}
                                ref={this.createFolderBtn}
                            >
                                <CreateNewFolderIcon />
                            </IconButton>
                        </Tooltip>
                        <div
                            ref={this.createFolderWindow}
                            className={styles.createFolderWindow}
                            style={{ display: 'none' }}
                        >
                            <TextField id="create-new-folder-input" />
                            <IconButton
                                onClick={this.handleApplyCreateFolder}
                            >
                                <CheckCircleOutlineIcon />
                            </IconButton>
                            <IconButton
                                onClick={this.handleCloseCreateFolder}
                            >
                                <CancelIcon />
                            </IconButton>
                        </div>
                        <Tooltip title="Upload file">
                            <IconButton
                                onClick={this.handleUploadFile}
                                className={styles.action}>
                                <PublishIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton className={styles.action}
                                ref={this.deleteItemBtn}
                                style={{ opacity: '0.5' }}
                                onClick={this.handleDeleteItem}
                            >
                                <DeleteForeverIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className={styles.headerRight}>
                        {this.state.isSelecting && (
                            <Button variant="contained" color="primary"
                                className={styles.selectBtn}
                                size="small"
                                onClick={this.handleApplySelect}
                                ref={this.selectButton}
                                style={{ opacity: '0.5' }}
                                role="button"
                            >Select</Button>
                        )}
                        <Tooltip title="Close">
                            <IconButton className={styles.action}
                                onClick={this.handleClose}
                            >
                                <CancelIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div className={styles.content}>
                    {this.currentItems?.map(item => {
                        const itemType: TItemType = this.getItemType(item);
                        let ItemIcon;

                        if (itemType === 'file') {
                            ItemIcon = <DescriptionIcon className={styles.itemIcon} />;
                        }
                        if (itemType === 'image') {
                            ItemIcon = (<div className={styles.itemImageContainer}>
                                <LazyLoad height={60} offsetVertical={60}>
                                    <img className={styles.itemImage}
                                        src={this.normalize(`/${this.currentPath}/${item}`)} />
                                </LazyLoad>
                            </div>);
                        }
                        if (itemType === 'folder') {
                            ItemIcon = <FolderOpenIcon className={styles.itemIcon} />;
                        }

                        return (
                            <MenuItem className={styles.item}
                                onClick={this.onItemClick(item)}
                                id={'item__' + item}
                            >
                                {itemType === 'image' && (
                                    <IconButton className={styles.zoomItemBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.openPreview(item);
                                        }}
                                    >
                                        <ZoomInIcon />
                                    </IconButton>
                                )}
                                {ItemIcon}
                                <p>{item}</p>
                            </MenuItem>
                        )
                    })}
                    {this.state.isLoading && (
                        <LoadBox absolute />
                    )}
                </div>
                <div
                    style={{ display: 'none' }}
                    ref={this.photoPreviewContainer}
                    className={styles.photoPreviewContainer}>
                    <IconButton className={styles.photoPreviewCloseBtn}
                        onClick={this.closePreview}
                    >
                        <CancelIcon className={styles.photoPreviewCloseIcon} />
                    </IconButton>
                    <img
                        className={styles.photoPreview}
                        ref={this.photoPreview}
                    />
                </div>
                <div style={{ display: 'none' }}>
                    <input type="file" id="hidden-file-upload-input" multiple />
                </div>
            </Modal>
        );
    }

}

export default FileManager;