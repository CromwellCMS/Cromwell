import { EDBEntity, TAdminCustomField, TBasePageEntity, TImageSettings } from '@cromwell/core';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, SelectProps, TextField, TextFieldProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ImagePicker, ImagePickerProps } from '../components/imagePicker/ImagePicker';
import { GalleryPicker, GalleryPickerProps } from '../components/galleryPicker/GalleryPicker';

import { useForceUpdate } from './forceUpdate';

export type TCustomField = {
    entityType: EDBEntity | string;
    key: string;
    component: (props: { initialValue: string | undefined; entity: TBasePageEntity }) => JSX.Element;
    saveData: () => string;
    label?: string;
    order?: number;
}

const customFields: Record<EDBEntity | string, Record<string, TCustomField>> = {};
const metaForceUpdates: Partial<Record<EDBEntity, (() => void)>> = {};
const onFieldRegisterListeners: Record<string, ((field: TCustomField) => any)> = {};

export const registerCustomField = (field: TCustomField) => {
    if (!customFields[field.entityType]) customFields[field.entityType] = {};
    customFields[field.entityType][field.key] = field;
    metaForceUpdates[field.entityType]?.();
    Object.values(onFieldRegisterListeners).forEach(listener => listener(field));
}

export const addOnFiledRegisterEventListener = (id: string, listener: ((field: TCustomField) => any)) => {
    onFieldRegisterListeners[id] = listener;
}

export const unregisterAllCustomFields = () => {
    Object.keys(customFields).forEach(entityType => {
        delete customFields[entityType];
    });
}

export const renderCustomFieldsFor = (entityType: EDBEntity | string, entityData: TBasePageEntity) => {
    const WrapperComp = () => {
        const forceUpdate = useForceUpdate();
        metaForceUpdates[entityType] = forceUpdate;

        useEffect(() => {
            return () => {
                delete metaForceUpdates[entityType];
            }
        }, []);

        return <>{Object.values(customFields[entityType] ?? {})
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map(field => {
                const Comp = field.component;
                return <Comp
                    key={field.key}
                    initialValue={entityData?.customMeta?.[field.key]}
                    entity={entityData}
                />
            })}</>
    }
    return <WrapperComp />;
}

export const getCustomMetaFor = (entityType: EDBEntity | string): Record<string, string> => {
    return Object.assign({}, ...Object.values(customFields[entityType] ?? {})
        .map(field => {
            return {
                [field.key]: field.saveData(),
            }
        }));
}

export const getCustomMetaKeysFor = (entityType: EDBEntity | string): string[] => {
    return Object.values(customFields[entityType] ?? {}).map(field => field.key);
}


export const registerTextMetaField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: TextFieldProps;
}) => {
    let textMetaFieldValue;

    registerCustomField({
        ...settings,
        component: (props) => {
            const [value, setValue] = useState(props.initialValue);
            return <TextField
                value={value ?? ''}
                onChange={e => {
                    setValue(e.target.value);
                    textMetaFieldValue = e.target.value;
                }}
                label={settings.label}
                fullWidth
                variant="standard"
                style={{ marginBottom: '15px' }}
                {...(settings.props ?? {})}
            />
        },
        saveData: () => textMetaFieldValue,
    });
}


export const registerSelectMetaField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    options: string[];
    props?: SelectProps<string>;
}) => {
    let selectMetaFieldValue;

    registerCustomField({
        ...settings,
        component: (props) => {
            const [value, setValue] = useState(props.initialValue);
            return (
                <FormControl fullWidth>
                    <InputLabel>{settings.label}</InputLabel>
                    <Select
                        value={value}
                        onChange={(event: SelectChangeEvent<string>) => {
                            setValue(event.target.value);
                            selectMetaFieldValue = event.target.value;
                        }}
                        variant="standard"
                        fullWidth
                        style={{ margin: '15px 0' }}
                        {...(settings.props ?? {})}
                    >
                        {settings.options.map(option => (
                            <MenuItem value={option} key={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )
        },
        saveData: () => selectMetaFieldValue,
    });
}


export const registerImageMetaField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: ImagePickerProps;
}) => {
    let imageMetaFieldValue;

    registerCustomField({
        ...settings,
        component: (props) => {
            const [value, setValue] = useState(props.initialValue);
            return (
                <ImagePicker
                    value={value}
                    onChange={(value) => {
                        setValue(value);
                        imageMetaFieldValue = value;
                    }}
                    showRemove
                    style={{ margin: '15px 0' }}
                    {...(settings.props ?? {})}
                />
            )
        },
        saveData: () => imageMetaFieldValue,
    });
}


export const registerGalleryMetaField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: GalleryPickerProps;
}) => {
    let galleryMetaFieldValue: string;

    registerCustomField({
        ...settings,
        component: (props) => {
            const [value, setValue] = useState(props.initialValue);
            return (
                <GalleryPicker
                    images={value?.split(',').map(src => ({ src })) ?? []}
                    onChange={(value: TImageSettings[]) => {
                        const valStr = value.map(val => val.src).join(',');
                        setValue(valStr);
                        galleryMetaFieldValue = valStr;
                    }}
                    label={settings.label}
                    style={{ margin: '15px 0', border: '1px solid #ccc', borderRadius: '6px', padding: '10px' }}
                    {...(settings.props ?? {})}
                />
            )
        },
        saveData: () => galleryMetaFieldValue,
    });
}

export const registerCustomFieldOfType = (field: TAdminCustomField) => {
    if (field.fieldType === 'Simple text') {
        registerTextMetaField(field);
    }
    if (field.fieldType === 'Select') {

    }
    if (field.fieldType === 'Image') {
        registerImageMetaField(field);

    }
    if (field.fieldType === 'Gallery') {
        registerGalleryMetaField(field);

    }
    if (field.fieldType === 'Color') {

    }
}
