import {
    getStoreItem, setStoreItem, TCromwellBlockData,
    TCromwellBlockProps, TCromwellBlock, TBlockContentGetter
} from '@cromwell/core';
import React, { Component } from 'react';
import { CContainer } from '../CContainer/CContainer';
import { CText } from '../CText/CText';
import { CHTML } from '../CHTML/CHTML';
import { CImage } from '../CImage/CImage';
import { CPlugin } from '../CPlugin/CPlugin';
import { CGallery } from '../CGallery/CGallery';
import {
    cromwellBlockTypeToClassname, cromwellIdToHTML,
    cromwellBlockPluginNameToClassname, BlockGetContentConsumer, dynamicLoader
} from '../../constants';
//@ts-ignore
import styles from './CromwellBlock.module.scss';


export class CromwellBlock extends Component<TCromwellBlockProps> implements TCromwellBlock {

    private data?: TCromwellBlockData;
    private htmlId: string;
    private contentInstance: React.Component;
    private childBlocks: TCromwellBlockData[] = [];
    private hasBeenMoved?: boolean = false;
    private blockRef = React.createRef<HTMLDivElement>();

    private childResolvers: Record<string, ((block: TCromwellBlock) => void) | undefined> = {};

    public getData = () => this.data;
    public getBlockRef = () => this.blockRef;

    constructor(props: TCromwellBlockProps) {
        super(props);
        let instances = getStoreItem('blockInstances');
        if (!instances) instances = {}
        instances[this.props.id] = this;
        setStoreItem('blockInstances', instances);

        this.readConfig();

        if (this.data?.parentId) {
            this.hasBeenMoved = true;

            const parentInst = this.getBlockInstance(this.data?.parentId);
            if (parentInst) {
                parentInst.notifyChildRegister(this);
            }
        }
    }

    public getBlockInstance(id: string): TCromwellBlock | undefined {
        return getStoreItem('blockInstances')?.[id];
    }

    componentWillUnmount() {
        // Remove this instance from the store
        const instances = getStoreItem('blockInstances');
        if (instances) {
            const inst = instances[this.props.id];
            // Check if a new instance with the same has been rendered and overwrited current one. 
            // We don't need to remove a new instance from the store.
            if (inst && inst.getBlockRef && inst.getBlockRef().current === this.blockRef.current) {
                // Remove only if refs the same
                delete instances[this.props.id];
                setStoreItem('blockInstances', instances);
            }
        }
    }

    public getContentInstance = () => this.contentInstance;
    public setContentInstance = (contentInstance: React.Component) => this.contentInstance = contentInstance;

    public notifyChildRegister(inst: TCromwellBlock) {
        const id = inst.getData()?.id;
        if (id) {
            const resolver = this.childResolvers[id];
            if (resolver) {
                this.childResolvers[id] = undefined;
                resolver(inst);
            }
        }
    }


    private readConfig = () => {
        this.data = undefined;
        // console.log('readConfig', this.props.id)

        if (this.props.type) this.data = { id: this.props.id, type: this.props.type };

        this.htmlId = cromwellIdToHTML(this.props.id);

        this.childBlocks = [];
        const pageConfig = getStoreItem('pageConfig');

        // console.log('pageConfig', pageConfig)
        if (pageConfig && pageConfig.modifications && Array.isArray(pageConfig.modifications)) {
            pageConfig.modifications.forEach(d => {

                if (d.id == this.props.id) {
                    this.data = d;
                }
                if (this.props.id == d.parentId && d.id) {
                    // Save blocks that targeted at this component.
                    // This component will draw them
                    this.childBlocks.push(d)
                }
            })
        }

    }

    private getVirtualBlock = (b: TCromwellBlockData): JSX.Element => {
        if (b.type === 'HTML') {
            return <CHTML
                id={b.id}
                key={b.id}
            />
        }
        if (b.type === 'image') {
            return <CImage
                id={b.id}
                key={b.id}
            />
        }
        if (b.type === 'container') {
            return <CContainer
                id={b.id}
                key={b.id}
            />
        }
        if (b.type === 'text') {
            return <CText
                id={b.id}
                key={b.id}
            />
        }
        if (b.type === 'gallery') {
            return <CGallery
                id={b.id}
                key={b.id}
            />
        }
        if (b.type === 'plugin') {
            return <CPlugin
                id={b.id}
                key={b.id}
            />
        }

        return (
            <CromwellBlock
                id={b.id}
                key={b.id}
            />
        )
    }

    public getChildBlocks(): React.ReactNode[] {
        this.childBlocks = this.childBlocks.sort((a, b) => {
            const ai = a?.index ?? 0;
            const bi = b?.index ?? 0;
            return ai - bi;
        });

        return this.childBlocks.map(block => {
            if (block.isVirtual) {
                return this.getVirtualBlock(block);
            }

            const blockInst = this.getBlockInstance(block.id);
            if (blockInst) {
                return blockInst.finalRender();

            } else {
                // Child wasnt wan't initialized yet. Wait until it registers in the store 
                // and notifies this parent component
                const childPromise = new Promise<TCromwellBlock>(done => {
                    this.childResolvers[block.id] = done;
                })
                const DynamicComp = dynamicLoader(async (): Promise<React.ComponentType> => {
                    const child = await childPromise;
                    return () => {
                        return <>{child.finalRender()}</>
                    }
                });
                return <DynamicComp />;

            }
        })
    }

    public getDefaultContent(): React.ReactNode | null {
        if (this.data?.type === 'container') {
            return (
                <>
                    {this.props.children}
                    {this.getChildBlocks()}
                </>
            )
        }

        if (this.props.content) {
            return this.props.content(this.data, this.blockRef,
                inst => this.contentInstance = inst)
        }

        return this.props.children;

    }

    public contentRender(getContent?: TBlockContentGetter | null): React.ReactNode | null {
        this.readConfig();

        if (this.data?.isDeleted) {
            return <></>;
        }

        const elementClassName = styles.CromwellBlock
            // + (this.shouldBeMoved && isServer() ? ' CromwellBlockInnerServer' : '')
            + (this.data && this.data.type ? ' ' + cromwellBlockTypeToClassname(this.data.type) : '')
            + (this.props.className ? ` ${this.props.className}` : '')
            + (this.data && this.data.type && this.data.type === 'plugin' && this.data.plugin && this.data.plugin.pluginName
                ? ` ${cromwellBlockPluginNameToClassname(this.data.plugin.pluginName)}` : '');


        const blockContent = getContent ? getContent(this) : this.getDefaultContent();

        return (
            <div id={this.htmlId} key={this.htmlId}
                // @TODO resolve styles type to store in config. Normal CSS or React.CSSProperties
                // style={this.data ? this.data.styles as any : undefined}
                className={elementClassName}
                ref={this.blockRef}
            >
                {blockContent}
            </div>
        );
    }

    public finalRender(): React.ReactNode | null {
        return <BlockGetContentConsumer>
            {(getContent) => {
                return this.contentRender(getContent)
            }}
        </BlockGetContentConsumer>
    }

    render(): React.ReactNode | null {
        // console.log('CromwellBlock::render id: ' + this.id + ' data: ' + JSON.stringify(this.data));
        this.readConfig();

        if (this.data?.parentId) {
            this.hasBeenMoved = true;
        }

        if (this.hasBeenMoved) {
            return <></>;
        } else {
            return this.finalRender();
        }

    }
}
