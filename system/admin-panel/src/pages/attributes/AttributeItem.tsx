import { TAttribute, TAttributeInput } from '@cromwell/core';
import { getGraphQLClient, getRestApiClient } from '@cromwell/core-frontend';
import { createStyles, IconButton, makeStyles, Radio, TextField, Tooltip } from '@material-ui/core';
import {
    AddCircleOutline as AddCircleOutlineIcon,
    Delete as DeleteIcon,
    Image as ImageIcon,
    Save as SaveIcon,
} from '@material-ui/icons';
import React, { useRef, useState } from 'react';

import { getFileManager } from '../../components/fileManager/helpers';
import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import ConfirmationModal from '../../components/modal/Confirmation';
import { toast } from '../../components/toast/toast';
import { CheckList } from '../../components/transferList/CheckList';
import { useForceUpdate } from '../../helpers/forceUpdate';

const useStyles = makeStyles(() =>
    createStyles({
        textFieldRoot: {
            '& input': {
                fontSize: '20px',
                fontWeight: 500,
            },
        }
    }),
);

const AttributeItem = (props: { data: TAttribute; handleRemove: (data: TAttribute) => void }) => {
    const attribute = useRef(props.data);
    const [checkedValues, setCheckedValues] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const forceUpdate = useForceUpdate();
    const graphClient = getGraphQLClient();
    const styles = useStyles();

    const getAttribute = async () => {
        if (attribute.current?.id) {
            try {
                const attr = await graphClient.getAttributeById(attribute.current.id)
                attribute.current = attr;
            } catch (e) {
                console.error(e);
            }
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
                slug: attribute.current.slug,
                required: attribute.current.required,
            }
            if (attribute.current.id) {
                // update
                getRestApiClient().purgeRendererEntireCache();
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
            toast.success('Attribute saved');
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

    const handleToggleRequired = () => {
        attribute.current.required = !attribute.current.required;
        forceUpdate();
    }

    const deleteAttributeConfirmed = async () => {
        setIsDeleteModalOpen(false);
        let success = false;
        try {
            if (attribute.current?.id) await graphClient.deleteAttribute(attribute.current?.id);
            props.handleRemove(props.data);
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
                    size="small"
                    placeholder="Attribute title"
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
                actions={<div style={{ marginLeft: 'auto', display: 'flex' }}>
                    <Tooltip title={attribute.current.required ? 'required' : 'optional'}>
                        <Radio
                            checked={attribute.current.required ?? false}
                            onClick={handleToggleRequired}
                        />
                    </Tooltip>
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

                    const handleChangeIcon = async () => {
                        const newIconSrc = await getFileManager()?.getPhoto();
                        if (newIconSrc) {
                            attribute.current.values.forEach((val, index) => {
                                if (val === value) attribute.current.values[index].icon = newIconSrc;
                            })
                            forceUpdate();
                        }
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
                                            background: `url("${value.icon}") center center no-repeat`,
                                            backgroundSize: 'contain'
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
                title={'Delete attribute? (no undo)'}
                onConfirm={deleteAttributeConfirmed}
                onClose={() => setIsDeleteModalOpen(false)}
            />
            <LoadingStatus isActive={isLoading} />
        </>
    )
}


export default AttributeItem;