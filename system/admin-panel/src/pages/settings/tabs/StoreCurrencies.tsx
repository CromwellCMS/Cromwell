import { TCurrency } from '@cromwell/core';
import { Add as AddIcon, DeleteForever as DeleteForeverIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { Badge, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { TTabProps } from '../Settings';
import styles from '../Settings.module.scss';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function StoreCurrencies(props: TTabProps) {
    const { settings, changeSettings } = props;
    const currencies = settings?.currencies ?? [];

    const handleDeleteCurrency = (tag: string) => {
        const currencies = (settings?.currencies ?? []);
        changeSettings('currencies', currencies.filter(curr => curr.tag !== tag));
    }

    const handleAddCurrency = () => {
        const currencies = (settings?.currencies ?? []);
        changeSettings('currencies', [...currencies, {
            tag: 'new',
            id: currencies.length + 1 + '',
        }]);
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <ResponsiveGridLayout
                    margin={[15, 15]}
                    layouts={{
                        xs: currencies.map((currency, index) => {
                            return { i: currency.id, x: (index % 2), y: Math.floor(index / 2), w: 1, h: 1 }
                        }),
                        xxs: currencies.map((currency, index) => {
                            return { i: currency.id, x: 0, y: index, w: 1, h: 1 }
                        })
                    }}
                    breakpoints={{ xs: 480, xxs: 0 }}
                    rowHeight={330}
                    isResizable={false}
                    cols={{ xs: 2, xxs: 1 }}
                    draggableHandle='.draggableHandle'
                    onLayoutChange={(layout) => {
                        const sortedCurrencies: TCurrency[] = [];
                        const sorted = [...layout].sort((a, b) => (a.x + a.y * 10) - (b.x + b.y * 10));
                        sorted.forEach(item => {
                            const curr = currencies.find(curr => curr.id === item.i);
                            if (curr) sortedCurrencies.push(curr);
                        });
                        changeSettings('currencies', sortedCurrencies)
                    }}
                >
                    {currencies.map((currency, index) => {
                        const onChange = (item) => {
                            const newCurrencies = [...currencies];
                            newCurrencies[index] = item;
                            changeSettings('currencies', newCurrencies)
                        }

                        const handleTextFieldChange = (key: keyof TCurrency, type?: 'number' | 'string') =>
                            (event: React.ChangeEvent<{ value: string }>) => {
                                let val: string | number | undefined = event.target.value;
                                if (type === 'number') {
                                    val = parseFloat(val);
                                    if (isNaN(val)) val = undefined;
                                }
                                onChange({
                                    ...currency,
                                    [key]: val
                                })
                            }

                        const isPrimary = index === 0;

                        return (
                            <div className={styles.currencyItem} key={currency.id}>
                                <div className={styles.currencyItemHeader}>
                                    <div className={styles.currencyBadge}>
                                        <Badge color="secondary" badgeContent={isPrimary ? 'Primary' : null}>
                                            <div></div>
                                        </Badge>
                                    </div>
                                    <div>
                                        <IconButton onClick={() => handleDeleteCurrency(currency.tag)}>
                                            <DeleteForeverIcon />
                                        </IconButton>
                                        <IconButton style={{ cursor: 'move' }} className="draggableHandle">
                                            <DragIndicatorIcon />
                                        </IconButton>
                                    </div>
                                </div>
                                <TextField label="Tag"
                                    value={currency.tag ?? ''}
                                    className={styles.textField + ' draggableCancel'}
                                    fullWidth
                                    variant="standard"
                                    onChange={handleTextFieldChange('tag')}
                                />
                                <TextField label="Title"
                                    value={currency.title ?? ''}
                                    className={styles.textField + ' draggableCancel'}
                                    fullWidth
                                    variant="standard"
                                    onChange={handleTextFieldChange('title')}
                                />
                                <TextField label="Ratio"
                                    value={currency.ratio ?? ''}
                                    className={styles.textField + ' draggableCancel'}
                                    fullWidth
                                    type="number"
                                    variant="standard"
                                    onChange={handleTextFieldChange('ratio', 'number')}
                                />
                                <TextField label="Symbol"
                                    value={currency.symbol ?? ''}
                                    className={styles.textField + ' draggableCancel'}
                                    fullWidth
                                    variant="standard"
                                    onChange={handleTextFieldChange('symbol')}
                                />
                            </div>
                        )
                    })}
                </ResponsiveGridLayout>
                <Tooltip title="Add currency">
                    <IconButton onClick={handleAddCurrency}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    )
}