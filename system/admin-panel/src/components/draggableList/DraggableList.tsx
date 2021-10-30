import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React, { Component } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

import styles from './DraggableList.modules.scss';

const ResponsiveGridLayout = WidthProvider(Responsive);

export class DraggableList<TData extends { id: string | number }, TCompProps = Record<string, any>> extends Component<{
    data: TData[];
    component: React.ComponentType<{
        data: TData;
        itemProps?: TCompProps;
    }>;
    onChange?: (data: TData[]) => void;
    itemProps?: TCompProps;
}> {
    private uncontrolledInput: TData[] = [];

    private getGridLayout = (data: TData[]) => {
        return {
            xxs: data.map((item, index) => {
                return { i: (item.id ?? index) + '', x: 0, y: index, w: 1, h: 1 }
            }),
        }
    }

    private onLayoutChange = (data: TData[]) => (layout) => {
        const sortedItems: TData[] = [];
        const sorted = [...layout].sort((a, b) => (a.x + a.y * 10) - (b.x + b.y * 10));
        sorted.forEach(item => {
            const it = data.find((_it, index) => (_it.id ?? index) + '' === item.i);
            if (it) sortedItems.push(it);
        });

        this.uncontrolledInput = sortedItems;
        this.props.onChange?.(sortedItems);
    }

    render() {
        const ItemComponent = this.props.component;

        return (
            <div className={styles.DraggableList}>
                <ResponsiveGridLayout
                    margin={[0, 0]}
                    isResizable={false}
                    breakpoints={{ xs: 480, xxs: 0 }}
                    rowHeight={64}
                    layouts={this.getGridLayout(this.props.data)}
                    onLayoutChange={this.onLayoutChange(this.props.data)}
                    cols={{ xs: 1, xxs: 1 }}
                    draggableHandle='.draggableHandle'
                >
                    {this.props.data.map((item, index) => {
                        return (<div
                            key={(item?.id ?? index) + ''}
                            className={styles.item}
                        >
                            <IconButton style={{ cursor: 'move', marginRight: '10px' }}
                                className="draggableHandle">
                                <DragIndicatorIcon />
                            </IconButton>
                            <ItemComponent data={item} itemProps={this.props.itemProps} />
                        </div>)
                    })}
                </ResponsiveGridLayout>
            </div>
        );
    }
}
