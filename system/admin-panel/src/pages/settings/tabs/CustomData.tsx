import { EDBEntity, getRandStr, TAdminCustomEntity, TAdminCustomField, TCustomEntityColumn } from '@cromwell/core';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    FormatListBulleted as FormatListBulletedIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import { Button, Grid, IconButton, Popover, TextField, Tooltip } from '@mui/material';
import React, { useRef, useState } from 'react';

import { DraggableList } from '../../../components/draggableList/DraggableList';
import { ImagePicker } from '../../../components/imagePicker/ImagePicker';
import Modal from '../../../components/modal/Modal';
import { Select } from '../../../components/select/Select';
import { baseEntityColumns, unregisterCustomEntity } from '../../../helpers/customEntities';
import { unregisterCustomField } from '../../../helpers/customFields';
import { TAdminCmsSettings, TTabProps } from '../Settings';
import styles from '../Settings.module.scss';

type AdminEntityView = {
    entityType: EDBEntity | string;
    label: string;
    custom?: boolean;
}

export default function CustomData(props: TTabProps) {
    const { settings, changeSettings } = props;

    const [entityToEdit, setEntityToEdit] = useState<TAdminCustomEntity | null>(null)
    const [canShowInvalid, setCanShowInvalid] = useState(false);

    const defaultEntitiesWithCustomFields: AdminEntityView[] = [
        {
            entityType: EDBEntity.Product,
            label: 'Product',
        },
        {
            entityType: EDBEntity.ProductCategory,
            label: 'Category',
        },
        {
            entityType: EDBEntity.Post,
            label: 'Post',
        },
        {
            entityType: EDBEntity.Tag,
            label: 'Tag',
        },
        {
            entityType: EDBEntity.User,
            label: 'User',
        },
        {
            entityType: EDBEntity.CMS,
            label: 'CMS Settings',
        },
    ]

    const getFieldsEntities = (): AdminEntityView[] => [
        ...defaultEntitiesWithCustomFields,
        ...(settings.customEntities ?? []).map(custom => ({
            entityType: custom.entityType,
            label: custom.entityLabel ?? custom?.listLabel,
            custom: true,
        })),
    ];

    const addCustomField = (entity: AdminEntityView) => {
        const customFields = settings?.customFields ?? [];
        const orderMax = customFields.reduce((prev, curr) => curr.order > prev ? curr.order : prev, 0);
        customFields.push({
            entityType: entity.entityType,
            key: '',
            fieldType: 'Simple text',
            order: orderMax + 1,
            id: getRandStr(8),
            column: {
                meta: true,
                visible: entity.custom,
                order: orderMax + 1,
            } as TCustomEntityColumn,
        })
        changeSettings('customFields', customFields)
    }

    const handleAddEntity = () => {
        setEntityToEdit({
            entityType: '',
            listLabel: '',
            columns: [
                ...baseEntityColumns.map(col => ({ ...col, visible: true })),
            ],
        });
    }

    const handleCloseAddEntity = () => {
        setEntityToEdit(null);
        setCanShowInvalid(false);
    }

    const changeEntityToEdit = (key: keyof TAdminCustomEntity, value: any) => {
        setEntityToEdit(prev => {
            return {
                ...prev,
                [key]: value,
            }
        })
    }

    const checkProp = (prop) => prop && prop !== '';

    const saveCustomEntity = () => {
        setCanShowInvalid(true);
        if (!checkProp(entityToEdit?.entityType) || !checkProp(entityToEdit?.listLabel)) return;

        if (settings.customEntities?.find(ent => ent.entityType === entityToEdit.entityType)) {
            changeSettings('customEntities', [...settings.customEntities].map(ent => {
                if (ent.entityType === entityToEdit.entityType) {
                    return { ...entityToEdit };
                }
                return ent;
            }));
        } else {
            changeSettings('customEntities', [...(settings.customEntities ?? []), { ...entityToEdit }]);
        }
        setEntityToEdit(null);
        setCanShowInvalid(false);
    }

    const deleteCustomEntity = (entityType: string) => {
        if (settings.customEntities) {
            changeSettings('customEntities', [...settings.customEntities].filter(ent => {
                if (ent.entityType === entityType) {
                    return false
                }
                return true;
            }));
        }
        unregisterCustomEntity(entityType);
    }

    return (
        <Grid container spacing={3}>
            {getFieldsEntities().map(entity => {
                const fields = settings?.customFields?.
                    filter(field => field.entityType === entity.entityType)?.
                    sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                return (
                    <Grid item xs={12} key={entity.entityType} className={styles.customEntity}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <h3 >{entity.label}</h3>
                            {entity.custom && (
                                <div style={{ marginLeft: '10px' }}>
                                    <IconButton onClick={() => setEntityToEdit(
                                        settings.customEntities?.find(ent => ent.entityType === entity.entityType) ?? null
                                    )}>
                                        <SettingsIcon />
                                    </IconButton>
                                    <Tooltip title="Delete entity">
                                        <IconButton onClick={() => deleteCustomEntity(entity.entityType)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            )}
                        </div>
                        {!!fields?.length && (
                            <DraggableList<TCustomFieldSettingsData>
                                data={fields.map(field => ({
                                    field: field,
                                    id: field.id,
                                    settings,
                                    changeSettings,
                                }))}
                                onChange={changedFields => {
                                    changedFields.forEach((field, index) => field.field.order = index);
                                }}
                                component={CustomFieldSettings}
                            />
                        )}
                        <Tooltip title="Add custom field">
                            <IconButton onClick={() => addCustomField(entity)}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                )
            })}
            <Grid item xs={12}>
                <Button
                    onClick={handleAddEntity}
                    variant="outlined">Add entity</Button>
            </Grid>
            <Modal
                open={!!entityToEdit}
                onClose={handleCloseAddEntity}
                className={styles.entityToEdit}
            >
                <TextField
                    label="Key"
                    value={entityToEdit?.entityType ?? ''}
                    onChange={e => changeEntityToEdit('entityType', e.target.value)}
                    variant="standard"
                    fullWidth
                    className={styles.entityToEditField}
                    error={canShowInvalid && !checkProp(entityToEdit?.entityType)}
                />
                <TextField
                    label="List label"
                    value={entityToEdit?.listLabel ?? ''}
                    onChange={e => changeEntityToEdit('listLabel', e.target.value)}
                    variant="standard"
                    fullWidth
                    className={styles.entityToEditField}
                    error={canShowInvalid && !checkProp(entityToEdit?.listLabel)}
                />
                <TextField
                    label="Entity label"
                    value={entityToEdit?.entityLabel ?? ''}
                    onChange={e => changeEntityToEdit('entityLabel', e.target.value)}
                    variant="standard"
                    fullWidth
                    className={styles.entityToEditField}
                />
                <ImagePicker
                    label="Icon"
                    value={entityToEdit?.icon}
                    className={styles.entityToEditField}
                    onChange={value => changeEntityToEdit('icon', value)}
                    width={30}
                    height={30}
                    variant="standard"
                />
                <div style={{ display: 'flex' }}>
                    <Button variant="outlined"
                        style={{ marginRight: '15px' }}
                        onClick={() => { setEntityToEdit(null); setCanShowInvalid(false); }}
                    >Cancel</Button>
                    <Button variant="contained"
                        onClick={saveCustomEntity}
                    >Apply</Button>
                </div>
            </Modal>
        </Grid>
    )
}

type TCustomFieldSettingsData = {
    id: string;
    field: TAdminCustomField;
    settings: TAdminCmsSettings | null;
    changeSettings: (key: keyof TAdminCmsSettings, value: any) => void;
}

const CustomFieldSettings = (props: {
    data: TCustomFieldSettingsData;
}) => {
    const data = props.data;
    const { settings, changeSettings } = data;
    const fieldData = data.field;
    const [selectOptionsOpen, setSelectOptionsOpen] = useState(false);
    const selectOptionsButtonRef = useRef();

    const changeFieldValue = (key: keyof TAdminCustomField, value: any) => {
        const customFields = (settings?.customFields ?? []).map(field => {
            if (field.id === props.data.id) {
                (field as any)[key] = value;
            }
            return field;
        })
        changeSettings('customFields', customFields)
    }

    const deleteField = () => {
        changeSettings('customFields', (settings?.customFields ?? [])
            .filter(field => field.id !== fieldData.id));

        unregisterCustomField(fieldData.entityType, fieldData.key);
    }

    const toggleSelectOptions = () => {
        setSelectOptionsOpen(!selectOptionsOpen);
    }

    const addSelectOption = () => {
        changeSettings('customFields', (settings?.customFields ?? [])
            .map(field => {
                if (field.id === fieldData.id) {
                    return {
                        ...fieldData,
                        options: [...(fieldData.options ?? []), ''],
                    }
                }
                return field;
            }));
    }

    const deleteSelectOption = (option: string) => {
        changeSettings('customFields', (settings?.customFields ?? [])
            .map(field => {
                if (field.id === fieldData.id) {
                    return {
                        ...fieldData,
                        options: (fieldData.options ?? []).filter(opt => opt !== option),
                    }
                }
                return field;
            }));
    }

    const changeSelectOption = (index: number, value: string) => {
        changeSettings('customFields', (settings?.customFields ?? [])
            .map(field => {
                if (field.id === fieldData.id) {
                    return {
                        ...fieldData,
                        options: (fieldData.options ?? []).map((opt, idx) => idx === index ? value : opt),
                    }
                }
                return field;
            }));
    }

    return (
        <div className={styles.customFieldItem}>
            <TextField
                label="Key"
                value={fieldData.key}
                onChange={e => changeFieldValue('key', e.target.value.replace(/\W/g, '_'))}
                size="small"
                className={styles.customFieldItemField}
            />
            <TextField
                label="Label"
                value={fieldData.label}
                onChange={e => changeFieldValue('label', e.target.value)}
                size="small"
                className={styles.customFieldItemField}
            />
            <Select
                className={styles.customFieldItemField}
                value={fieldData.fieldType}
                onChange={e => changeFieldValue('fieldType', e.target.value)}
                size="small"
                variant="outlined"
                label="Type"
                options={['Simple text', 'Text editor', 'Select', 'Image', 'Gallery', 'Color'] as TAdminCustomField['fieldType'][]}
            />
            {fieldData?.fieldType === 'Select' && (
                <Tooltip title="Select options">
                    <IconButton ref={selectOptionsButtonRef} onClick={toggleSelectOptions}>
                        <FormatListBulletedIcon />
                    </IconButton>
                </Tooltip>
            )}
            <Tooltip title="Delete field">
                <IconButton onClick={deleteField}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            {fieldData?.fieldType === 'Select' && (
                <Popover
                    open={selectOptionsOpen}
                    anchorEl={selectOptionsButtonRef.current}
                    onClose={toggleSelectOptions}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <div className={styles.selectOptions}>
                        {fieldData?.options?.map((option, idx) => (
                            <div key={idx}
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                <TextField
                                    value={option}
                                    onChange={e => changeSelectOption(idx, e.target.value)}
                                    size="small"
                                    variant="standard"
                                />
                                <IconButton onClick={() => deleteSelectOption(option)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        ))}
                        <IconButton onClick={addSelectOption}>
                            <AddIcon />
                        </IconButton>
                    </div>
                </Popover>
            )}
        </div>
    );
}
