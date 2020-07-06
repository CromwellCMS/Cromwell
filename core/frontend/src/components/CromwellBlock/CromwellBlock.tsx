import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getStoreItem, isServer, CromwellBlockDataType, BlockDestinationPositionType } from '@cromwell/core';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import PowerIcon from '@material-ui/icons/Power';
import CodeIcon from '@material-ui/icons/Code';

//@ts-ignore
import classes from './CromwellBlock.module.scss';

const getCromwellBlockId = (id: string): string => `CromwellBlock_${id}`
const getCromwellBlockIdBefore = (id: string): string => `${getCromwellBlockId(id)}_before`
const getCromwellBlockIdAfter = (id: string): string => `${getCromwellBlockId(id)}_after`

type CromwellBlockProps = {
    id: string;
    config?: CromwellBlockDataType;
}

export class CromwellBlock extends Component<CromwellBlockProps> {

    private data?: CromwellBlockDataType;
    private blockRef: React.RefObject<HTMLDivElement> = React.createRef();

    private virtualBlocks: CromwellBlockDataType[] = [];

    private targetElement?: HTMLElement;

    private shouldBeMoved = false;

    private hasPortalBefore = false;
    private hasPortalAfter = false;
    private hasPortalInside = false;

    private id: string;
    private idBefore: string;
    private idAfter: string;

    private pluginComponent?: React.ComponentType;

    constructor(props: CromwellBlockProps) {
        super(props);

        if (props.config) this.data = props.config;
        this.id = getCromwellBlockId(this.props.id);
        this.idBefore = getCromwellBlockIdBefore(this.props.id);
        this.idAfter = getCromwellBlockIdAfter(this.props.id);

        const data = getStoreItem('blocksData');
        if (data && Array.isArray(data)) {
            data.forEach(d => {
                if (d.componentId == this.props.id) {
                    this.data = d;
                }
                // Check if current component should be moved to another component
                // If should, it will create portal to destinationComponent's wrapper
                if (d.componentId == this.props.id && d.destinationComponentId && d.destinationPosition) {
                    this.shouldBeMoved = true;
                }

                // Check if current component has other components moved to it.
                // If has, it will create wrappers for portals of other components
                if (this.props.id == d.destinationComponentId && d.componentId && d.destinationPosition) {
                    if (d.destinationPosition === 'after') this.hasPortalAfter = true;
                    if (d.destinationPosition === 'before') this.hasPortalBefore = true;
                    if (d.destinationPosition === 'inside') this.hasPortalInside = true;

                    // Save virtual (existing only in config) blocks that targeted at this component.
                    // This component will draw them
                    if (d.isVirtual) this.virtualBlocks.push(d)
                }
            })
        }

        if (this.data) {
            // Check if current Block is Plugin 
            if (this.data.pluginName) {
                const importDynamicPlugin = getStoreItem('importDynamicPlugin');
                if (importDynamicPlugin) {
                    this.pluginComponent = importDynamicPlugin(this.data.pluginName);
                }
            }
        }
    }

    componentDidMount(): void {
        if (this.data) {
            if (this.data.styles && this.blockRef.current) {
                this.blockRef.current.setAttribute('style', this.data.styles);
            }
        }

        if (this.shouldBeMoved) {
            const element = document.getElementById(getCromwellBlockId(this.props.id));
            if (element) {
                element.classList.remove('CromwellBlockInnerServer');
            }
            if (this.data && this.data.destinationComponentId && !this.targetElement) {

                // if (!isServer()) {
                //     const destinationComponent = this.getDestinationComponent(this.data);
                //     if (destinationComponent) {
                //         console.log('Moving component ' + this.props.id + ' to ' + this.data.destinationComponentId);
                //         this.targetElement = destinationComponent;
                //     }
                // }
                // console.log('CromwellBlock::componentDidMount id: ' + this.id + ' data: ' + JSON.stringify(this.data))

                const destinationComponent = this.getDestinationComponent(this.data);
                if (destinationComponent) {
                    // console.log('Moving component ' + this.props.id + ' to ' + this.data.destinationComponentId);
                    this.targetElement = destinationComponent;
                }
                else {
                    console.error(getCromwellBlockId(this.props.id) + ':: Failed to find destinationComponent: '
                        + getCromwellBlockId(this.data.destinationComponentId));
                    this.shouldBeMoved = false;
                }
                this.forceUpdate();
            }
        }

    }

    private getDestinationComponent = (data: CromwellBlockDataType): HTMLElement | null => {
        let destinationComponent: HTMLElement | null = null;
        if (data.destinationComponentId) {
            if (data.destinationPosition === 'before') {
                destinationComponent = document.getElementById(getCromwellBlockIdBefore(data.destinationComponentId))
            }
            if (data.destinationPosition === 'after') {
                destinationComponent = document.getElementById(getCromwellBlockIdAfter(data.destinationComponentId))
            }
            if (data.destinationPosition === 'inside') {
                destinationComponent = document.getElementById(getCromwellBlockId(data.destinationComponentId))
            }
        }
        return destinationComponent;
    }

    private getVirtualBlocks = (postion: BlockDestinationPositionType): JSX.Element[] => {
        return this.virtualBlocks.filter(b => b.destinationPosition === postion)
            .map(b => <CromwellBlock id={b.componentId} key={b.componentId} />)
    }

    render(): JSX.Element | null {
        // console.log('CromwellBlock::render id: ' + this.id + ' data: ' + JSON.stringify(this.data));
        // console.log('isServer', isServer(), 'this.shouldBeMoved', this.shouldBeMoved, 'this.targetElement', this.targetElement);

        // Will return null only at client at first render if it hasn't found destination. If it won't find in componentDidMount then it will set 'shouldBeMoved' to false and render
        if (!isServer() && this.shouldBeMoved && !this.targetElement) {
            // console.log('CromwellBlock::render returned null id: ' + this.id)
            return null;
        }
        if (getCromwellBlockId(this.props.id) !== this.id) {
            return <div style={{ color: 'red' }}>Error. Block id was changed</div>
        }
        const isAdminPanel = getStoreItem('isAdminPanel');

        const elementClassName = 'CromwellBlock'
            + (this.hasPortalInside ? ' CromwellBlockWrapper' : '')
            + (this.shouldBeMoved ? ' CromwellBlockInner' : '')
            + (this.shouldBeMoved && isServer() ? ' CromwellBlockInnerServer' : '');

        let blockContent: React.ReactNode | null = null;
        if (this.data) {
            if (this.data.type === 'plugin') {
                if (!isAdminPanel && this.pluginComponent) {
                    blockContent = <this.pluginComponent />;
                }
            }
            if (this.data.type === 'text' || this.data.type === 'HTML') {
                blockContent = this.props.children;
            }


            if (isAdminPanel) {
                blockContent = (
                    <div className={'CromwellBlock__adminPanelView'}>
                        {this.data.type === 'plugin' && (
                            <><PowerIcon className={'CromwellBlock__adminPanelIcon'} />
                                <p>{this.data.pluginName}</p></>
                        )}
                        {this.data.type === 'text' && (
                            <><TextFormatIcon className={'CromwellBlock__adminPanelIcon'} />
                                {this.props.children}</>
                        )}
                        {this.data.type === 'HTML' && (
                            <><CodeIcon className={'CromwellBlock__adminPanelIcon'} />
                                {this.props.children}</>
                        )}
                    </div>
                )
            }
        }


        const element = (<>
            {this.hasPortalBefore && (
                <div id={this.idBefore} key={this.idBefore} className="CromwellBlockWrapper">
                    {this.getVirtualBlocks('before')}
                </div>
            )}
            <div id={this.id} key={this.id} className={elementClassName} ref={this.blockRef} >
                {blockContent}
                {this.getVirtualBlocks('inside')}
            </div>
            {this.hasPortalAfter && (
                <div id={this.idAfter} key={this.idAfter} className="CromwellBlockWrapper">
                    {this.getVirtualBlocks('after')}
                </div>
            )}
        </>);

        if (this.targetElement) {
            return ReactDOM.createPortal(element, this.targetElement);
        }
        return element;

    }
}
