import { BlockDestinationPositionType, CromwellBlockDataType, getStoreItem } from '@cromwell/core';
import React, { Component } from 'react';

import {
    cromwellBlockTypeToClassname,
    cromwellIdToHTML
} from '../../constants';

//@ts-ignore
type CromwellBlockProps = {
    id: string;
    config?: CromwellBlockDataType;
    adminPanelContentView?: (id: string, config?: CromwellBlockDataType, children?: React.ReactNode) => React.ReactNode;
    className?: string;
}

export class CromwellBlock extends Component<CromwellBlockProps> {

    private data?: CromwellBlockDataType;
    // private blockRef: React.RefObject<HTMLDivElement> = React.createRef();
    private virtualBlocks: CromwellBlockDataType[] = [];
    private id: string;
    private pluginComponent?: React.ComponentType;

    constructor(props: CromwellBlockProps) {
        super(props);

        if (props.config) this.data = props.config;
        this.id = cromwellIdToHTML(this.props.id);

        const blocksData = getStoreItem('blocksData');
        if (blocksData && Array.isArray(blocksData)) {
            blocksData.forEach(d => {
                if (d.componentId == this.props.id) {
                    this.data = d;
                }
                if (this.props.id == d.destinationComponentId && d.componentId && d.destinationPosition) {
                    // Save virtual (existing only in config) blocks that targeted at this component.
                    // This component will draw them
                    if (d.isVirtual) this.virtualBlocks.push(d)
                }
            })
        }

        if (this.data && !this.data.isDeleted) {

            // Check if current Block is Plugin 
            if (this.data.pluginName) {
                const importDynamicPlugin = getStoreItem('importDynamicPlugin');
                if (importDynamicPlugin) {
                    this.pluginComponent = importDynamicPlugin(this.data.pluginName);
                }
            }
        }
    }

    private getVirtualBlocks = (postion: BlockDestinationPositionType): JSX.Element[] => {
        return this.virtualBlocks.filter(b => b.destinationPosition === postion)
            .map(b => <CromwellBlock id={b.componentId} key={b.componentId} adminPanelContentView={this.props.adminPanelContentView} />)
    }

    render(): JSX.Element | null {
        // console.log('CromwellBlock::render id: ' + this.id + ' data: ' + JSON.stringify(this.data));
        // console.log('isServer', isServer(), 'this.shouldBeMoved', this.shouldBeMoved, 'this.targetElement', this.targetElement);

        if (cromwellIdToHTML(this.props.id) !== this.id) {
            return <div style={{ color: 'red' }}>Error. Block id was changed between renders</div>
        }

        const elementClassName = 'CromwellBlock'
            // + (this.shouldBeMoved && isServer() ? ' CromwellBlockInnerServer' : '')
            + (this.data && this.data.type ? ' ' + cromwellBlockTypeToClassname(this.data.type) : '')
            + (this.props.className ? ` ${this.props.className}` : '');

        let blockContent: React.ReactNode | null = null;
        if (this.data) {
            if (this.data.type === 'plugin') {
                if (this.pluginComponent) {
                    blockContent = <this.pluginComponent />;
                }
            }
            if (this.data.type === 'text' || this.data.type === 'HTML') {
                blockContent = this.props.children;
            }


            if (this.props.adminPanelContentView) {
                blockContent = this.props.adminPanelContentView(this.id, this.data, this.props.children);
            }
        }


        const element = (<>
            {this.getVirtualBlocks('before')}
            <div id={this.id} key={this.id}
                // @TODO resolve styles type to store in config. Normal CSS or React.CSSProperties
                // style={this.data ? this.data.styles as any : undefined}
                className={elementClassName}
            // ref={this.blockRef}
            >
                {blockContent}
                {this.getVirtualBlocks('inside')}
            </div>
            {this.getVirtualBlocks('after')}
        </>);


        return element;

    }
}
