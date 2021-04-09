import {
    getStoreItem, setStoreItem, TCromwellBlockData,
    TCromwellBlockProps, TCromwellBlock, TBlockContentProvider
} from '@cromwell/core';
import React, { Component, useEffect } from 'react';
import { CContainer } from '../CContainer/CContainer';
import { CText } from '../CText/CText';
import { CHTML } from '../CHTML/CHTML';
import { CImage } from '../CImage/CImage';
import { CPlugin } from '../CPlugin/CPlugin';
import { CGallery } from '../CGallery/CGallery';
import {
    blockTypeToClassname, cromwellIdToHTML,
    cromwellBlockPluginNameToClassname, BlockContentConsumer, dynamicLoader
} from '../../constants';
import styles from './CromwellBlock.module.scss';


export class CromwellBlock extends Component<TCromwellBlockProps> implements TCromwellBlock {

    private data?: TCromwellBlockData;
    private htmlId: string;
    private contentInstance: React.Component;
    private childBlocks: TCromwellBlockData[] = [];
    private hasBeenMoved?: boolean = false;
    private blockRef = React.createRef<HTMLDivElement>();
    private childResolvers: Record<string, ((block: TCromwellBlock) => void) | undefined> = {};
    private childPromises: Record<string, (Promise<TCromwellBlock>) | undefined> = {};
    private rerenderResolver: (() => void | undefined);
    private rerenderPromise: Promise<void> | undefined;

    private didUpdateListeners: Record<string, (() => void)> = {};

    public getData = () => {
        this.readConfig();
        const { content, children, jsxParentId, ...restProps } = this.props;
        return Object.assign({}, restProps, this.data);
    }

    public getBlockRef = () => this.blockRef;
    public getContentInstance = () => this.contentInstance;
    public setContentInstance = (contentInstance: React.Component) => this.contentInstance = contentInstance;
    public getBlockInstance = (id: string): TCromwellBlock | undefined => getStoreItem('blockInstances')?.[id];

    constructor(props: TCromwellBlockProps) {
        super(props);

        let instances = getStoreItem('blockInstances');
        if (!instances) instances = {}
        instances[this.props.id] = this;
        setStoreItem('blockInstances', instances);

        this.readConfig();

        if (this.data?.parentId && this.hasBeenMoved) {
            const parentInst = this.getBlockInstance(this.data?.parentId);
            if (parentInst) {
                parentInst.notifyChildRegistered(this);
            }
        }
    }

    componentDidMount() {
        this.didUpdate();
        this.contextComponentDidUpdate?.();
    }

    componentDidUpdate() {
        this.didUpdate();
        this.contextComponentDidUpdate?.();
    }

    private contextComponentDidUpdate: undefined | (() => void) = undefined;

    private didUpdate = async () => {
        if (this.rerenderResolver) {
            this.rerenderResolver();
        }

        const childPromises = Object.values(this.childPromises).filter(p => Boolean(p?.then));
        if (childPromises.length > 0) {
            await Promise.all(childPromises);
        }

        Object.values(this.didUpdateListeners).forEach(func => func());
    }


    public addDidUpdateListener = (id: string, func: () => void) => {
        this.didUpdateListeners[id] = func;
    }

    public rerender = async () => {
        this.forceUpdate();
        if (!this.rerenderPromise) this.rerenderPromise = new Promise(done => {
            this.rerenderResolver = done;
        });

        return this.rerenderPromise;
    }

    private readConfig() {
        this.data = undefined;

        if (this.props.type) this.data = { id: this.props.id, type: this.props.type };

        this.htmlId = cromwellIdToHTML(this.props.id);

        this.childBlocks = [];
        const pageConfig = getStoreItem('pageConfig');

        if (pageConfig && pageConfig.modifications && Array.isArray(pageConfig.modifications)) {
            pageConfig.modifications.forEach(d => {

                if (d.id == this.props.id) {
                    this.data = d;
                }
                if (this.props.id == d.parentId && d.id) {
                    // Save blocks that targeted at this component.
                    // This component will draw them
                    this.childBlocks.push(d);
                }
            })
        }

        if (this.data?.parentId && !this.data?.isVirtual) {
            this.hasBeenMoved = true;
        }
    }

    private getVirtualBlock = (b: TCromwellBlockData): JSX.Element => {
        const data = this.getData();

        const defProps = {
            id: b.id,
            key: b.id,
            jsxParentId: data?.id,
        }

        if (b.type === 'HTML') {
            return <CHTML
                {...defProps}
            />
        }
        if (b.type === 'image') {
            return <CImage
                {...defProps}
            />
        }
        if (b.type === 'container') {
            return <CContainer
                {...defProps}
            />
        }
        if (b.type === 'text') {
            return <CText
                {...defProps}
            />
        }
        if (b.type === 'gallery') {
            return <CGallery
                {...defProps}
            />
        }
        if (b.type === 'plugin') {
            return <CPlugin
                {...defProps}
            />
        }

        return (
            <CromwellBlock
                {...defProps}
            />
        )
    }


    public notifyChildRegistered(inst: TCromwellBlock) {
        const id = inst.getData()?.id;
        if (id) {
            const resolver = this.childResolvers[id];
            if (resolver) {
                this.childResolvers[id] = undefined;
                this.childPromises[id] = undefined;
                resolver(inst);
            }
        }
    }

    public getChildBlocks(): React.ReactNode[] {
        const data = this.getData();
        this.childBlocks = this.childBlocks.sort((a, b) => (a?.index ?? 0) - (b?.index ?? 0));

        return this.childBlocks.map(block => {
            if (block.isVirtual) {
                return this.getVirtualBlock(block);
            }

            const blockInst = this.getBlockInstance(block.id);
            if (blockInst) {
                return blockInst.consumerRender(data?.id);

            } else {
                // Child wasn't initialized yet. Wait until it registers in the store 
                // and notifies this parent component
                const childPromise = new Promise<TCromwellBlock>(done => {
                    this.childResolvers[block.id] = done;
                });
                this.childPromises[block.id] = childPromise;

                const DynamicComp = dynamicLoader(async (): Promise<React.ComponentType> => {
                    const child = await childPromise;
                    return () => {
                        useEffect(() => {
                            this.componentDidUpdate();
                        }, []);
                        return child.consumerRender(data?.id) ?? <></>;
                    }
                });
                return <DynamicComp />;
            }
        })
    }

    public getDefaultContent(): React.ReactNode | null {
        const data = this.getData();
        if (data?.type === 'container') {
            return (
                <>
                    {this.props.children}
                    {this.getChildBlocks()}
                </>
            )
        }

        if (this.props.content) {
            return this.props.content(this.data, this.blockRef,
                inst => this.contentInstance = inst);
        }

        return this.props.children;

    }

    public contentRender(getContent?: TBlockContentProvider['getter'] | null, className?: string): React.ReactNode | null {
        this.readConfig();

        if (this.data?.isDeleted) {
            return <></>;
        }

        const elementClassName = styles.CromwellBlock
            // + (this.shouldBeMoved && isServer() ? ' CromwellBlockInnerServer' : '')
            + (this.data && this.data.type ? ' ' + blockTypeToClassname(this.data.type) : '')
            + (this.props.className ? ` ${this.props.className}` : '')
            + (this.data && this.data.type && this.data.type === 'plugin' && this.data.plugin && this.data.plugin.pluginName
                ? ` ${cromwellBlockPluginNameToClassname(this.data.plugin.pluginName)}` : '')
            + (className ? ' ' + className : '');


        const blockContent = getContent ? getContent(this) : this.getDefaultContent();

        return (
            <div id={this.htmlId} key={this.htmlId}
                // @TODO resolve styles type to store in config. Normal CSS or React.CSSProperties
                // style={this.data ? this.data.styles as any : undefined}
                className={elementClassName}
                ref={this.blockRef}
            >{blockContent}</div>
        );
    }

    public consumerRender(jsxParentId?: string): JSX.Element | null {
        return <BlockContentConsumer>
            {(content) => {
                this.contextComponentDidUpdate = content?.componentDidUpdate;
                return this.contentRender(content?.getter, content?.blockClass)
            }}
        </BlockContentConsumer>
    }

    render(): React.ReactNode | null {
        // console.log('CromwellBlock::render id: ' + this.props.id);
        this.readConfig();

        if (this.hasBeenMoved) {
            return <></>;
        } else {
            return this.consumerRender();
        }

    }
}