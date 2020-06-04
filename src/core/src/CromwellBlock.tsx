import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getStoreItem } from './GlobalStore';
import { isServer } from './constants';
import { CromwellBlockDataType } from './types';
import './scss/CromwellBlock.scss';

const getCromwellBlockId = (id: string): string => `CromwellBlock_${id}`
const getCromwellBlockIdBefore = (id: string): string => `${getCromwellBlockId(id)}_before`
const getCromwellBlockIdAfter = (id: string): string => `${getCromwellBlockId(id)}_after`

type CromwellBlockProps = {
    id: string;
}

export class CromwellBlock extends Component<CromwellBlockProps> {

    private data?: CromwellBlockDataType;
    private blockRef: React.RefObject<HTMLDivElement> = React.createRef();

    private targetElement?: HTMLElement;

    private shouldBeMoved = false;

    private hasPortalBefore = false;
    private hasPortalAfter = false;
    private hasPortalInside = false;

    constructor(props: CromwellBlockProps) {
        super(props);

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

                    if (!isServer()) {
                        const destinationComponent = this.getDestinationComponent(d);
                        if (destinationComponent) {
                            // console.log('Moving component ' + props.id + ' to ' + d.destinationComponentId);
                            this.targetElement = destinationComponent;
                        }
                    }
                }

                // Check if current component has other components moved to it.
                // If has, it will create wrappers for portals of other components
                if (this.props.id == d.destinationComponentId && d.componentId && d.destinationPosition) {
                    if (d.destinationPosition === 'after') this.hasPortalAfter = true;
                    if (d.destinationPosition === 'before') this.hasPortalBefore = true;
                    if (d.destinationPosition === 'inside') this.hasPortalInside = true;
                }
            })
        }
    }

    componentDidMount() {
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
                const destinationComponent = this.getDestinationComponent(this.data);
                if (destinationComponent) {
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

    render(): JSX.Element | null {
        // Will return null only at client and at first render if it hasn't found destination. If it won't find in componentDidMount then it will set 'shouldBeMoved' to false and render
        if (!isServer() && this.shouldBeMoved && !this.targetElement) {
            return null;
        }
        const id = getCromwellBlockId(this.props.id);
        const idBefore = getCromwellBlockIdBefore(this.props.id);
        const idAfter = getCromwellBlockIdAfter(this.props.id);
        const elementClassName = 'CromwellBlock'
            + (this.hasPortalInside ? ' CromwellBlockWrapper' : '')
            + (this.shouldBeMoved ? ' CromwellBlockInner' : '')
            + (this.shouldBeMoved && isServer() ? ' CromwellBlockInnerServer' : '');
        // console.log('this.shouldBeMoved && isServer()', getCromwellBlockId(this.props.id), this.shouldBeMoved, isServer(), elementClassName)

        const element = (<>
            {this.hasPortalBefore && (
                <div id={idBefore} key={idBefore} className="CromwellBlockWrapper"></div>
            )}
            <div id={id} key={id} className={elementClassName} ref={this.blockRef} >
                {this.props.children}
            </div>
            {this.hasPortalAfter && (
                <div id={idAfter} key={idAfter} className="CromwellBlockWrapper"></div>
            )}
        </>);

        if (this.targetElement) {
            return ReactDOM.createPortal(element, this.targetElement);
        }
        return element;

    }
}
