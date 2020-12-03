import React, { useEffect, useState, useRef } from 'react';
import { getRestAPIClient, getGraphQLClient } from '@cromwell/core-frontend';
import { TAttribute, TAttributeInput } from '@cromwell/core';
import { CheckList } from '../../components/transferList/TransferList';
import { Button, IconButton, MenuItem, Tab, Tabs, Tooltip, TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Delete as DeleteIcon,
    AddCircleOutline as AddCircleOutlineIcon,
    Image as ImageIcon
} from '@material-ui/icons';
import { toast } from 'react-toastify';
import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import { ConfirmationModal } from '../../components/modal/Confirmation';

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

export default function AttributesPage() {
    const attributes = useRef<TAttribute[] | null>(null);
    const graphClient = getGraphQLClient();
    const forceUpdate = useForceUpdate();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getAttributes = async () => {
        const attrs = await graphClient?.getAttributes();
        if (attrs && Array.isArray(attrs)) attributes.current = attrs;
        setIsLoading(false);
    }

    useEffect(() => {
        getAttributes();
    }, []);

    const handleAddAttribute = () => {
        attributes.current.push({
            key: '',
            values: [],
            type: 'radio'
        } as any);
        forceUpdate();
    }

    return (
        <div style={{ width: '100%' }}>
            {attributes.current && attributes.current.map(attribute => (
                <div style={{ marginBottom: '20px' }}>
                    <Attribute data={attribute} />
                </div>
            ))}
            {!isLoading && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '15px' }}>
                    <Button
                        onClick={handleAddAttribute}
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<AddCircleOutlineIcon />}
                    >Add attribute</Button>
                </div>
            )}
            <LoadingStatus isActive={isLoading} />
        </div>
    )
}

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textFieldRoot: {
            '& input': {
                fontSize: '20px',
                fontWeight: 500,
            },
        }
    }),
);

const Attribute = (props: { data: TAttribute }) => {
    const attribute = useRef(props.data);
    const [checkedValues, setCheckedValues] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const forceUpdate = useForceUpdate();
    const graphClient = getGraphQLClient();
    const styles = useStyles();

    const getAttribute = async () => {
        if (attribute.current?.id) {
            const attr = await graphClient.getAttributeById(attribute.current.id)
            attribute.current = attr;
        }
    }

    const handleSave = async () => {
        setIsLoading(true);
        let success = false;
        try {
            const update: TAttributeInput = {
                key: attribute.current.key,
                values: attribute.current.values.map(val => ({
                    value: val.value,
                    icon: val.icon
                })),
                type: attribute.current.type,
                icon: attribute.current.icon,
            }
            if (attribute.current.id) {
                // update
                await graphClient.updateAttribute(attribute.current.id, update);
            } else {
                // create new
                await graphClient.createAttribute(update);
            }
            await getAttribute();
            success = true;
        } catch (e) {
            console.error(e);
        }
        if (success) {
            toast.success('Saved attribute');
        } else {
            toast.error('Failed to save attribute');
        }
        setIsLoading(false);
    }

    const handleAddValue = () => {
        attribute.current.values.push({ value: '' });
        forceUpdate();
    }

    const handleAttributeNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newName = event.target.value;
        attribute.current.key = newName;
        forceUpdate();
    }

    const handleCheckedValuesChange = (newChecked: string[]) => {
        setCheckedValues(newChecked);
    }

    const handleDeleteAttribute = async () => {
        if (checkedValues.length > 0) {
            // remove checked values
            attribute.current.values = attribute.current.values.filter(val => !checkedValues.includes(val.value));
            setCheckedValues([]);
        } else {
            // remove entire attribute
            setIsDeleteModalOpen(true);
        }
    }

    const deleteAttributeConfirmed = async () => {
        setIsDeleteModalOpen(false);
        let success = false;
        try {
            if (attribute.current?.id) await graphClient.deleteAttribute(attribute.current?.id);
            attribute.current = undefined;
            forceUpdate();
            success = true;
        } catch (e) {
            console.error(e);
        }
        if (success) {
            toast.success('Deleted attribute');
        } else {
            toast.error('Failed to delete attribute');
        }
    }

    return (
        <>
            {attribute.current && <CheckList
                title={<TextField
                    variant="outlined"
                    size="small"
                    style={{ marginRight: '15px' }}
                    defaultValue={attribute.current.key}
                    onChange={handleAttributeNameChange}
                    classes={{
                        root: styles.textFieldRoot
                    }}
                />}
                items={attribute.current.values.map(val => val.value)}
                checked={checkedValues}
                setChecked={handleCheckedValuesChange}
                fullWidthToggle={false}
                actions={<div style={{ marginLeft: 'auto' }}>
                    <Tooltip title="Add new value">
                        <IconButton onClick={handleAddValue}><AddCircleOutlineIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title={checkedValues.length > 0 ? "Remove checked values" : "Remove attribute"}>
                        <IconButton onClick={handleDeleteAttribute}><DeleteIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Save attribute">
                        <IconButton onClick={handleSave}><SaveIcon /></IconButton>
                    </Tooltip>
                </div>}

                itemComp={(props) => {
                    const value = attribute.current.values.find(item => item.value === props.value);

                    const handleChangeIcon = () => {

                    };
                    const handleDeleteValue = () => {
                        attribute.current.values = attribute.current.values.filter(val => val.value !== value.value);
                        forceUpdate();
                    }
                    const handleValueNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        const newName = event.target.value;
                        attribute.current.values.forEach((val, index) => {
                            if (val === value) attribute.current.values[index].value = newName;
                        })
                    }

                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                style={{ marginRight: '15px' }}
                                defaultValue={props.value}
                                onChange={handleValueNameChange}
                            />
                            <Tooltip title="Change value icon">
                                <IconButton onClick={handleChangeIcon}>
                                    {value.icon ? (
                                        <div style={{
                                            width: '30px',
                                            height: '30px',
                                            background: `url(${value.icon}) center center no-repeat / cover`
                                        }}></div>
                                    ) : (
                                            <ImageIcon />
                                        )}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete value">
                                <IconButton onClick={handleDeleteValue}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    )
                }}
            />}
            <ConfirmationModal open={isDeleteModalOpen}
                text={'Delete attribute? (no undo)'}
                onConfirm={deleteAttributeConfirmed}
                onClose={() => setIsDeleteModalOpen(false)}
            />
            <LoadingStatus isActive={isLoading} />
        </>
    )
}
