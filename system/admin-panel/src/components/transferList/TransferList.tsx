import { Button, Grid } from '@material-ui/core';
import React from 'react';

import { CheckList } from './CheckList';
import { intersection, not } from './helpers';
import styles from './TransferList.Module.scss';

export default function TransferList(props: {
    left: string[];
    setLeft: (data: string[]) => void;
    right: string[];
    setRight: (data: string[]) => void;
    itemComp?: React.ComponentType<{ value: string }>;
}) {
    const [checked, setChecked] = React.useState<string[]>([]);
    const { left, setLeft, right, setRight } = props;

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    return (
        <Grid container spacing={2} justify="center" alignItems="center" className={styles.root}>
            <Grid item>
                <CheckList title='Choices'
                    items={left}
                    checked={checked}
                    setChecked={setChecked}
                    itemComp={props.itemComp}
                />
            </Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        variant="outlined"
                        size="small"
                        className={styles.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={styles.button}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item>
                <CheckList title='Chosen'
                    items={right}
                    checked={checked}
                    setChecked={setChecked}
                    itemComp={props.itemComp}
                />
            </Grid>
        </Grid>
    );
}
