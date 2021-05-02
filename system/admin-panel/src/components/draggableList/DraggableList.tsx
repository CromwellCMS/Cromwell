import { getRandStr } from '@cromwell/core';
import React, { Component } from 'react';

import { Draggable } from '../../helpers/Draggable/Draggable';
import styles from './DraggableList.modules.scss';


class DraggableList<TData, TCompProps = Record<string, any>> extends Component<{
    data: TData[];
    onChange: (data: TData[]) => void;
    component: React.ComponentType<{
        data: TData;
        itemProps?: TCompProps;
    }>;
    componentProps?: TCompProps;
}> {
    private draggable: Draggable;

    private refsData: {
        index: number;
        ref: React.RefObject<HTMLDivElement>;
    }[] = [];

    private randId = getRandStr(6);
    private itemClass = 'item_' + this.randId;
    private containerClass = 'container_' + this.randId;

    componentDidMount() {
        this.draggable = new Draggable({
            draggableSelector: '.' + this.itemClass,
            containerSelector: '.' + this.containerClass,
            rootElementSelector: '.' + this.containerClass,
            onBlockInserted: this.onBlockInserted,
            dragPlacement: 'element',
            createFrame: true,
            disableInsert: true,
            primaryColor: 'transparent',
        });
    }

    componentDidUpdate() {
        this.draggable?.updateBlocks();
    }

    private onBlockInserted = (container: HTMLElement, draggedBlock: HTMLElement, nextElement?: HTMLElement) => {
        let data = [...this.props.data];

        const index = this.refsData.find(data => data.ref.current === draggedBlock)?.index;
        const nextIndex = this.refsData.find(data => data.ref.current === nextElement)?.index ?? -1;

        if (index !== undefined) {
            const item = data[index];

            delete data[index];

            if (nextIndex === -1) {
                data.push(item);
            } else {
                const filtered: TData[] = []
                data.forEach((it, i) => {
                    if (i === nextIndex) {
                        filtered.push(item);
                    }
                    filtered.push(it);
                });
                data = filtered;
                if (!data.includes(item)) data.push(item);
            }
            data = data.filter(Boolean);

            this.props.onChange?.(data);
        }
    }


    render() {
        const ItemComponent = this.props.component;
        this.refsData = [];

        return (
            <div className={`${this.itemClass} ${this.containerClass} ${styles.container}`}>
                {this.props.data.map((item, index) => {

                    const ref = React.createRef<HTMLDivElement>();
                    this.refsData[index] = {
                        index, ref,
                    }
                    return (
                        <div className={this.itemClass} ref={ref} key={index}>
                            <ItemComponent itemProps={this.props.componentProps} data={item} />
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default DraggableList;
