import {
    Button,
    Card,
    CardHeader,
    Checkbox,
    createStyles,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Theme,
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: 'auto',
        },
        cardHeader: {
            padding: theme.spacing(1, 2),
        },
        list: {
            height: 230,
            backgroundColor: theme.palette.background.paper,
            overflow: 'auto',
        },
        button: {
            margin: theme.spacing(0.5, 0),
        },
    }),
);

function not(a: string[], b: string[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: string[], b: string[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: string[], b: string[]) {
    return [...a, ...not(b, a)];
}

export default function TransferList(props: {
    left: string[];
    setLeft: (data: string[]) => void;
    right: string[];
    setRight: (data: string[]) => void;
    itemComp?: React.ComponentType<{ value: string }>;
}) {
    const classes = useStyles();
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
        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
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
                        className={classes.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
          </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
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

export const CheckList = (props: {
    title: React.ReactNode;
    items: string[];
    itemComp?: React.ComponentType<{ value: string }>;
    checked: string[];
    setChecked: (items: string[]) => any;
    actions?: React.ReactNode;
    fullWidthToggle?: boolean;
}) => {
    const { title, items, itemComp, checked, setChecked, fullWidthToggle } = props;
    const classes = useStyles();

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items: string[]) => intersection(checked, items).length;

    const handleToggleAll = (items: string[]) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    return (
        <Card>
            <div
                style={{ padding: '16px', display: 'flex', alignItems: 'center' }}
                className={classes.cardHeader}
            >
                <div style={{ marginRight: '16px' }}>
                    <Checkbox
                        color="primary"
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{ 'aria-label': 'all items selected' }}
                    />

                </div>
                <div>
                    <p style={{ fontWeight: 500, fontSize: '1.1em', marginBottom: '6px' }}>{title}</p>
                    <p>{`${numberOfChecked(items)}/${items.length} selected`}</p>
                </div>
                {props.actions}
            </div>
            <Divider />
            <List className={classes.list} dense component="div" role="list">
                {items.map((value: string, index: number) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem key={index}
                            role="listitem" onClick={() => {
                                if (fullWidthToggle !== false) handleToggle(value)();
                            }}
                            button={fullWidthToggle !== false ? true : undefined}
                        >
                            <ListItemIcon
                                onClick={() => {
                                    if (fullWidthToggle === false) handleToggle(value)();
                                }}>
                                <Checkbox
                                    color="primary"
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            {props.itemComp ? (
                                <props.itemComp value={value} />
                            ) : (
                                    <ListItemText id={labelId} primary={value} />
                                )}
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card >
    )
}