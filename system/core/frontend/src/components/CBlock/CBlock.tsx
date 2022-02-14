import './CBlock.module.scss';

import {
    getRandStr,
    getStoreItem,
    isServer,
    setStoreItem,
    TBlockContentProvider,
    TCromwellBlock,
    TCromwellBlockData,
    TCromwellBlockProps,
} from '@cromwell/core';
import React, { Component } from 'react';

import {
    BlockContentConsumer,
    blockCssClass,
    BlockStoreConsumer,
    getBlockHtmlId,
    getBlockHtmlType,
    getDynamicLoader,
    getHtmlPluginBlockName,
} from '../../constants';
import { CContainer } from '../CContainer/CContainer';
import { CEditor } from '../CEditor/CEditor';
import { CGallery } from '../CGallery/CGallery';
import { CHTML } from '../CHTML/CHTML';
import { CImage } from '../CImage/CImage';
import { CPlugin } from '../CPlugin/CPlugin';
import { CText } from '../CText/CText';


/** @internal */
export class CBlock<TContentBlock = React.Component> extends
    Component<TCromwellBlockProps<TContentBlock>> implements TCromwellBlock<TContentBlock> {

    private data?: TCromwellBlockData;
    private htmlId: string;
    private contentInstance: React.Component & TContentBlock;
    private childBlocks: TCromwellBlockData[] = [];
    private hasBeenMoved?: boolean = false;
    private blockRef = React.createRef<HTMLDivElement>();
    private movedBlockRef = React.createRef<HTMLDivElement>();
    private rerenderResolver?: (() => void | undefined);
    private rerenderPromise: Promise<void> | undefined;
    private unmounted: boolean = false;
    public movedCompForceUpdate?: () => void;
    private pageInstances: Record<string, TCromwellBlock | undefined> | undefined;
    private childResolvers: Record<string, ((block: TCromwellBlock) => void) | undefined> = {};
    private childPromises: Record<string, (Promise<TCromwellBlock>) | undefined> = {};
    private instanceId = getRandStr(12);
    public getInstanceId = () => this.instanceId;

    private didUpdateListeners: Record<string, (() => void)> = {};

    public getData = () => {
        this.readConfig();
        const { ...restProps } = this.props;
        return Object.assign({}, restProps, this.data);
    }

    public getBlockRef = () => this.blockRef;
    public getContentInstance = () => this.contentInstance;
    public setContentInstance = (contentInstance) => this.contentInstance = contentInstance;

    public getBlockInstance = (id: string): TCromwellBlock | undefined => {
        return this.pageInstances?.[id];
    }
    public setBlockInstance = (id: string, inst: TCromwellBlock | undefined) => {
        if (this.pageInstances) {
            this.pageInstances[id] = inst;
        }
    }

    public registerGlobalBlockInstance = () => {
        let instances = getStoreItem('blockInstances');
        if (!instances) {
            instances = {};
            setStoreItem('blockInstances', instances);
        }
        instances[this.props.id] = this as any;
    }

    constructor(props: TCromwellBlockProps<TContentBlock>) {
        super(props);

        this.registerGlobalBlockInstance();
        this.readConfig();
        this.props.blockRef?.(this);
    }

    componentDidMount() {
        this.didUpdate();
        this.contextComponentDidUpdate?.();
    }

    componentDidUpdate() {
        this.didUpdate();
        this.contextComponentDidUpdate?.();
    }

    componentWillUnmount() {
        this.didUpdate();
        this.unmounted = true;

        const data = this.getData();
        const blockInst = this.getBlockInstance(data.id);
        if (blockInst?.getInstanceId() === this.instanceId) {
            this.setBlockInstance(data.id, undefined);
        }
    }

    private contextComponentDidUpdate: undefined | (() => void) = undefined;

    private didUpdate = async () => {
        this.props.blockRef?.(this);

        if (this.movedBlockRef.current) {
            this.movedBlockRef.current.removeAttribute('class');
            this.movedBlockRef.current.removeAttribute('id');
            this.movedBlockRef.current.style.display = 'none';
        }

        if (this.rerenderResolver) {
            this.rerenderResolver();
            this.rerenderResolver = undefined;
            this.rerenderPromise = undefined;
        }

        Object.values(this.didUpdateListeners).forEach(func => func());
    }


    public addDidUpdateListener = (id: string, func: () => void) => {
        this.didUpdateListeners[id] = func;
    }

    public rerender = () => {
        if (this.unmounted) return;
        if (!this.rerenderPromise) this.rerenderPromise = new Promise(done => {
            this.rerenderResolver = done;
        });

        this.contentInstance?.forceUpdate?.();
        this.movedCompForceUpdate?.();
        this.forceUpdate();

        return this.rerenderPromise;
    }

    private readConfig() {
        this.data = undefined;

        if (this.props.type) this.data = { id: this.props.id, type: this.props.type };

        this.htmlId = getBlockHtmlId(this.props.id);

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
            });
        }

        this.hasBeenMoved = false;
        if (this.data?.parentId && !this.data?.isVirtual) {
            this.hasBeenMoved = true;
        }

        return this;
    }

    private getVirtualBlock = (b: TCromwellBlockData): JSX.Element => {
        const data = this.getData();

        const defProps = {
            id: b.id,
            key: b.id + '_virtual',
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
        if (b.type === 'editor') {
            return <CEditor
                {...defProps}
            />
        }

        return (
            <CBlock
                {...defProps}
            />
        )
    }

    public notifyChildRegistered(childInst) {
        const childId = childInst.getData()?.id;
        if (childId) {
            const resolver = this.childResolvers[childId];
            if (resolver) {
                this.childResolvers[childId] = undefined;
                this.childPromises[childId] = undefined;
                resolver(childInst);
            }
        }
    }

    public getChildBlocks(): React.ReactNode[] {
        this.childBlocks = this.childBlocks.sort((a, b) => (a?.index ?? 0) - (b?.index ?? 0));

        return this.childBlocks.map((block) => {
            if (block.isVirtual) {
                return this.getVirtualBlock(block);
            }

            if (isServer()) {
                return null;
            }

            const blockInst = this.getBlockInstance(block.id);

            // Works only for initialized components at the time of render of this component.
            // If some JSX component was moved from other place as child of this
            // and at time of execution wasn't constructed by React, then
            // `blockInst` will be `undefined` and nothing will return at the first render,
            if (blockInst) {
                return blockInst.consumerRender();

            } else {
                // Child wasn't initialized yet. Return dynamic loader 
                // and wait until child notifies this parent component
                // to render its content. Works only client-side. At server all elements
                // will be at their original position. next/dynamic doesn't work with SSR
                // this way.
                const childPromise = new Promise<TCromwellBlock>(done => {
                    this.childResolvers[block.id] = done;
                });
                this.childPromises[block.id] = childPromise;

                const DynamicComp = getDynamicLoader()(async (): Promise<React.ComponentType> => {
                    const child = await childPromise;
                    return () => {
                        return child.consumerRender() ?? null;
                    }
                });
                return <DynamicComp key={block.id + 'dynamicComp'} />;
            }
        });
    }

    public getDefaultContent(setClasses?: (classes: string) => void): React.ReactNode | null {
        const data = this.getData();

        const jsxChildren = this.props.content?.(this.data,
            this.blockRef,
            inst => this.contentInstance = inst,
            setClasses,
        );

        if (data?.type === 'container') {
            return (
                <>
                    {this.getChildBlocks()}
                    {jsxChildren}
                </>
            )
        }

        if (this.props.content) {
            return jsxChildren;
        }

        return this.props.children;
    }

    public contentRender(getContent?: TBlockContentProvider['getter'] | null, className?: string): React.ReactNode | null {
        const data = this.getData();

        if (this.data?.isDeleted) {
            return null;
        }

        let customBlockClasses;
        const getCustomClasses = (classes: string) => customBlockClasses = classes;

        const blockContent = getContent ? getContent(this as any) : this.getDefaultContent(getCustomClasses);

        const elementClassName = blockCssClass
            + (this.data && this.data.type ? ' ' + getBlockHtmlType(this.data.type) : '')
            + (this.props.className ? ` ${this.props.className}` : '')
            + (this.data && this.data.type && this.data.type === 'plugin' && this.data.plugin && this.data.plugin.pluginName
                ? ` ${getHtmlPluginBlockName(this.data.plugin.pluginName)}` : '')
            + (className ? ' ' + className : '')
            + (customBlockClasses && customBlockClasses !== '' ? ' ' + customBlockClasses : '');

        let blockStyles: React.CSSProperties = {};

        // Interpretation of PageBuilder's UI styles
        const eSt = data?.editorStyles;
        if (eSt) {
            if (eSt.align) {
                if (eSt.align === 'center') {
                    blockStyles.marginLeft = 'auto';
                    blockStyles.marginRight = 'auto';
                }
                if (eSt.align === 'left') {
                    blockStyles.marginRight = 'auto';
                    blockStyles.marginLeft = '0';
                }
                if (eSt.align === 'right') {
                    blockStyles.marginLeft = 'auto';
                    blockStyles.marginRight = '0';
                }
            }
            if (eSt.offsetBottom !== undefined) {
                blockStyles.marginBottom = eSt.offsetBottom + 'px';
            }
            if (eSt.offsetTop !== undefined) {
                blockStyles.marginTop = eSt.offsetTop + 'px';
            }
            if (eSt.offsetLeft !== undefined) {
                blockStyles.marginLeft = eSt.offsetLeft + 'px';
            }
            if (eSt.offsetRight !== undefined) {
                blockStyles.marginRight = eSt.offsetRight + 'px';
            }
            if (eSt.maxWidth !== undefined) {
                blockStyles.maxWidth = eSt.maxWidth + 'px';
            }
        }

        // Merge with custom css from config
        if (data.style) {
            try {
                const stylesParsed = typeof data.style === 'string' ? JSON.parse(data.style) : data.style;
                blockStyles = {
                    ...blockStyles,
                    ...stylesParsed,
                }
            } catch (e) {
                console.error('CBlock: provided style prop is not JSON: ' + data.style, e);
            }
        }

        return (
            <div id={this.htmlId} key={this.hasBeenMoved ? this.htmlId + '_moved' : this.htmlId + '_orig'}
                onClick={this.props.onClick}
                style={blockStyles}
                className={elementClassName}
                ref={this.blockRef}
            >{blockContent}</div>
        );
    }

    public consumerRender(): JSX.Element | null {
        return (<BlockContentConsumer key={this.htmlId + '_consumer'}>
            {(content) => {
                this.contextComponentDidUpdate = content?.componentDidUpdate;
                return this.contentRender(content?.getter, content?.blockClass)
            }}
        </BlockContentConsumer>);
    }

    render(): React.ReactNode | null {
        this.readConfig();
        // console.log('CBlock::render id: ' + this.props.id, this.hasBeenMoved, this.getData());

        return (<BlockStoreConsumer key={this.htmlId + '_render'}>
            {(value) => {
                this.pageInstances = value?.instances;
                if (!isServer()) (window as any).pageInstances = this.pageInstances;

                if (this.pageInstances && (!this.pageInstances[this.props.id] ||
                    this.pageInstances[this.props.id]?.getInstanceId() !== this.getInstanceId())) {

                    this.setBlockInstance(this.props.id, this as any);

                    if (this.data?.parentId && this.hasBeenMoved) {
                        const parentInst = this.getBlockInstance(this.data?.parentId);
                        if (parentInst) {
                            parentInst.notifyChildRegistered(this as any);
                        }
                    }
                }
                if (this.hasBeenMoved && !isServer()) {
                    return null;
                }
                return this.consumerRender();
            }}
        </BlockStoreConsumer>);
    }
}
