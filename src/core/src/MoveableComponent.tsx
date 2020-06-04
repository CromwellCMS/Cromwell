import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getStoreItem } from './GlobalStore';
import { isServer } from './constants';
import { MoveableComponentDataType } from './types';

const getMoveableComponentId = (id: string): string => `MoveableComponent_${id}`
const getMoveableComponentIdBefore = (id: string): string => `${getMoveableComponentId(id)}_before`
const getMoveableComponentIdAfter = (id: string): string => `${getMoveableComponentId(id)}_after`
const getMoveableComponentIdInside = (id: string): string => `${getMoveableComponentId(id)}}_inside`

type MoveableComponentProps = {
    id: string;
}

export class MoveableComponent extends Component<MoveableComponentProps> {

    private data?: MoveableComponentDataType;

    private targetElement?: HTMLElement;

    private shouldBeMoved = false;

    private hasPortalBefore = false;
    private hasPortalAfter = false;
    private hasPortalInside = false;

    constructor(props: MoveableComponentProps) {
        super(props);

        const data = getStoreItem('moveableComponentsData');
        if (data && Array.isArray(data)) {
            data.forEach(d => {
                if (d.componentId == this.props.id) {
                    this.data = d;
                }

                if (!isServer()) {
                    // Check if current component should be moved to another component
                    // If should, it will create portal to destinationComponent's wrapper
                    if (d.componentId == this.props.id && d.destinationComponentId && d.position) {
                        this.shouldBeMoved = true;
                        const destinationComponent = this.getDestinationComponent(d);

                        if (destinationComponent) {
                            // console.log('Moving component ' + props.id + ' to ' + d.destinationComponentId);
                            this.targetElement = destinationComponent;
                        }
                    }
                }

                // Check if current component has other components moved to it.
                // If has, it will create wrappers for portals of other components
                if (this.props.id == d.destinationComponentId && d.componentId && d.position) {
                    if (d.position === 'after') this.hasPortalAfter = true;
                    if (d.position === 'before') this.hasPortalBefore = true;
                    if (d.position === 'inside') this.hasPortalInside = true;
                }
            })
        }
    }

    componentDidMount() {
        if (this.data && this.shouldBeMoved && !this.targetElement) {
            const destinationComponent = this.getDestinationComponent(this.data);
            if (destinationComponent) {
                this.targetElement = destinationComponent;
                this.forceUpdate();
            }
            else {
                console.error('MoveableComponent ' + getMoveableComponentId(this.props.id) +
                    ':: Failed to find destinationComponent: ' + getMoveableComponentId(this.data.destinationComponentId));
                this.shouldBeMoved = false;
            }
        }
    }

    private getDestinationComponent = (data: MoveableComponentDataType): HTMLElement | null => {
        let destinationComponent: HTMLElement | null = null;
        if (data.position === 'before') {
            destinationComponent = document.getElementById(getMoveableComponentIdBefore(data.destinationComponentId))
        }
        if (data.position === 'after') {
            destinationComponent = document.getElementById(getMoveableComponentIdAfter(data.destinationComponentId))
        }
        if (data.position === 'inside') {
            destinationComponent = document.getElementById(getMoveableComponentId(data.destinationComponentId))
        }
        return destinationComponent;
    }

    render(): JSX.Element | null {
        if (this.shouldBeMoved && !this.targetElement) {
            return null;
        }
        const id = getMoveableComponentId(this.props.id);
        const idBefore = getMoveableComponentIdBefore(this.props.id);
        const idAfter = getMoveableComponentIdAfter(this.props.id);

        const element = (<>
            {this.hasPortalBefore && (
                <div id={idBefore} key={idBefore} className="MoveableComponentWrapper"></div>
            )}
            <div id={id} key={id} className={'MoveableComponent' + (this.hasPortalInside ? ' MoveableComponentWrapper' : '')} >
                {this.props.children}
            </div>
            {this.hasPortalAfter && (
                <div id={idAfter} key={idAfter} className="MoveableComponentWrapper"></div>
            )}
        </>);

        if (this.targetElement) {
            return ReactDOM.createPortal(element, this.targetElement);
        }
        return element;

    }
}
