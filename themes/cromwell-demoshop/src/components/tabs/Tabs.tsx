import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {
    AppBar,
    Tabs,
    Tab
} from '@material-ui/core';

type TSwipeableTabsProps = {
    tabs: {
        label: string;
        node: React.ReactNode;
    }[]
}

export class SwipeableTabs extends React.Component<TSwipeableTabsProps> {
    state = {
        index: 0,
    };

    handleChange = (event: React.ChangeEvent<{}>, value: any) => {
        this.setState({
            index: value,
        });
    };

    handleChangeIndex = (index: number) => {
        this.setState({
            index,
        });
    };

    render() {
        const { index } = this.state;

        return (
            <>
                <AppBar position="static" color="default">
                    <Tabs value={index}
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={this.handleChange}
                    >
                        {this.props.tabs.map(t => <Tab label={t.label} />)}
                    </Tabs>
                </AppBar>
                <SwipeableViews animateHeight index={index}
                    onChangeIndex={this.handleChangeIndex}>
                    {this.props.tabs.map(t => t.node)}
                </SwipeableViews>
            </>
        );
    }
}
