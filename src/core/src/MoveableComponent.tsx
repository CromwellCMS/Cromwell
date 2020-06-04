import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { getStoreItem } from './GlobalStore';
import { isServer } from './constants';

const getMoveableComponentId = (id: string): string => `MoveableComponent_${id}`

type MoveableComponentProps = {
    id: string;
}

export class MoveableComponent extends Component<MoveableComponentProps> {

    private targetElement?: HTMLDivElement;

    constructor(props: MoveableComponentProps) {
        super(props);

        if (!isServer()) {
            const data = getStoreItem('moveableComponentsData');
            const body = document.getElementById('__next');
            console.log('body', body, body ? body.innerHTML : 'NO innerHTML')
            if (data && Array.isArray(data)) {
                data.forEach(d => {
                    console.log('d', d, d.componentId, this.props.id)
                    if (d.componentId == this.props.id && d.destinationComponentId && d.position) {
                        const destinationComponent = document.getElementById(getMoveableComponentId(props.id)) as HTMLDivElement | undefined;
                        console.log('destinationComponent', getMoveableComponentId(props.id), destinationComponent)
                        if (destinationComponent && destinationComponent.parentNode) {
                            console.log('Moving MoveableComponent ' + this.props.id + ' to ' + d.destinationComponentId);

                            if (d.position === 'after') {
                                const destWrapper = document.createElement('div');
                                destinationComponent.parentNode.insertBefore(destWrapper, destinationComponent.nextSibling);
                                this.targetElement = destWrapper;
                            }
                        }
                    }
                })
            }
        }

    }

    render(): JSX.Element {

        const element = (
            <div className="MoveableComponent" id={getMoveableComponentId(this.props.id)}>
                {this.props.children}
            </div>
        );

        if (this.targetElement) {
            return ReactDOM.createPortal(element, this.targetElement);
        }
        return element;

    }
}
