import { EDBEntity, getRandStr, TAdminCustomField, TBasePageEntity, TImageSettings } from '@cromwell/core';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    SelectProps,
    TextField,
    TextFieldProps,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'throttle-debounce';

import { GalleryPicker, GalleryPickerProps } from '../components/galleryPicker/GalleryPicker';
import { ImagePicker, ImagePickerProps } from '../components/imagePicker/ImagePicker';
import { useForceUpdate } from './forceUpdate';
import { initTextEditor, getEditorData, getEditorHtml } from './editor/editor';
import entityEditStyles from '../components/entity/entityEdit/EntityEdit.module.scss';

export type TCustomField = {
    entityType: EDBEntity | string;
    key: string;
    component: (props: { initialValue: string | undefined; entity: TBasePageEntity }) => JSX.Element;
    saveData: () => string | Promise<string>;
    label?: string;
    order?: number;
}

const customFields: Record<EDBEntity | string, Record<string, TCustomField>> = {};
const customFieldsForceUpdates: Partial<Record<EDBEntity, (() => void)>> = {};
const onFieldRegisterListeners: Record<string, ((field: TCustomField) => any)> = {};

export const registerCustomField = (field: TCustomField) => {
    if (!customFields[field.entityType]) customFields[field.entityType] = {};
    customFields[field.entityType][field.key] = field;
    customFieldsForceUpdates[field.entityType]?.();
    Object.values(onFieldRegisterListeners).forEach(listener => listener(field));
}

export const unregisterCustomField = (entityType: string, key: string) => {
    if (customFields[entityType]) {
        delete customFields[entityType][key];
        customFieldsForceUpdates[entityType]?.();
    }
}

export const addOnFieldRegisterEventListener = (id: string, listener: ((field: TCustomField) => any)) => {
    onFieldRegisterListeners[id] = listener;
}
export const removeOnFieldRegisterEventListener = (id: string) => {
    delete onFieldRegisterListeners[id];
}

export const RenderCustomFields = (props: {
    entityType: EDBEntity | string;
    entityData: TBasePageEntity;
    refetchMeta: () => Promise<Record<string, string> | undefined | null>;
}) => {
    const { entityType, entityData, refetchMeta } = props;
    const forceUpdate = useForceUpdate();
    customFieldsForceUpdates[entityType] = forceUpdate;
    const [updatedMeta, setUpdatedMeta] = useState<Record<string, string> | null>(null);

    useEffect(() => {
        // If some field registered after this page has fetched entity data, we need to
        // re-request data for this field to get its custom meta
        const onFieldRegistered = debounce(300, async () => {
            const newMeta = await refetchMeta();
            if (newMeta) setUpdatedMeta(newMeta);
        });

        addOnFieldRegisterEventListener(entityType, onFieldRegistered);

        return () => {
            removeOnFieldRegisterEventListener(entityType);
            delete customFieldsForceUpdates[entityType];
        }
    }, []);

    // Just update the values that are undefined, but leave the rest
    // for user input to be untouched
    const customMeta = Object.assign({}, updatedMeta, entityData?.customMeta);

    return <>{Object.values(customFields[entityType] ?? {})
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(field => {
            const Comp = field.component;
            return <Comp
                key={field.key}
                initialValue={customMeta?.[field.key]}
                entity={entityData}
            />
        })}</>
}

export const getCustomMetaFor = async (entityType: EDBEntity | string): Promise<Record<string, string>> => {
    return Object.assign({}, ...(await Promise.all(Object.values(customFields[entityType] ?? {})
        .map(async field => {
            return {
                [field.key]: await field.saveData(),
            }
        }))));
}

export const getCustomMetaKeysFor = (entityType: EDBEntity | string): string[] => {
    return Object.values(customFields[entityType] ?? {}).map(field => field.key);
}

const useInitialValue = (initialValue: string): [string, React.Dispatch<React.SetStateAction<string>>] => {
    const [value, setValue] = useState(initialValue);
    const initialValueRef = useRef(initialValue);
    if (initialValue !== initialValueRef.current) {
        initialValueRef.current = initialValue;
        setValue(initialValue);
    }
    return [value, setValue];
}


export const registerSimpleTextCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: TextFieldProps;
}) => {
    let textCustomFieldValue;

    registerCustomField({
        ...settings,
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            return <TextField
                value={value ?? ''}
                onChange={e => {
                    setValue(e.target.value);
                    textCustomFieldValue = e.target.value;
                }}
                label={settings.label ?? settings.key}
                fullWidth
                variant="standard"
                style={{ marginBottom: '15px' }}
                {...(settings.props ?? {})}
            />
        },
        saveData: () => textCustomFieldValue,
    });
}

export const registerTextEditorCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: TextFieldProps;
}) => {
    const editorId = 'editor_' + getRandStr(12);
    let initialValue: null | string = null;

    registerCustomField({
        ...settings,
        component: (props) => {

            const initEditor = async () => {
                let data: {
                    html: string;
                    json: string;
                } | undefined = undefined;

                if (initialValue) {
                    try {
                        data = JSON.parse(initialValue);
                    } catch (error) {
                        console.error(error);
                    }
                }

                await initTextEditor({
                    htmlId: editorId,
                    data: data?.json,
                    placeholder: settings.label,
                });
            }

            useEffect(() => {
                if (props.initialValue !== initialValue) {
                    initialValue = props.initialValue;
                    initEditor();
                }
            }, []);

            return (
                <div className={entityEditStyles.descriptionEditor}>
                    <div style={{ height: '350px' }} id={editorId}></div>
                </div>
            )
        },
        saveData: async () => {
            const json = await getEditorData(editorId);
            const html = await getEditorHtml(editorId);
            initialValue = JSON.stringify({
                html,
                json,
            });
            return initialValue;
        },
    });
}


export const registerSelectCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    options?: string[];
    props?: SelectProps<string>;
}) => {
    let selectCustomFieldValue;

    registerCustomField({
        ...settings,
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            return (
                <FormControl fullWidth>
                    <InputLabel>{settings.label}</InputLabel>
                    <Select
                        value={value}
                        onChange={(event: SelectChangeEvent<string>) => {
                            setValue(event.target.value);
                            selectCustomFieldValue = event.target.value;
                        }}
                        variant="standard"
                        fullWidth
                        style={{ margin: '15px 0' }}
                        {...(settings.props ?? {})}
                    >
                        {settings.options?.map(option => (
                            <MenuItem value={option} key={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )
        },
        saveData: () => selectCustomFieldValue,
    });
}


export const registerImageCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: ImagePickerProps;
}) => {
    let imageCustomFieldValue;

    registerCustomField({
        ...settings,
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            return (
                <ImagePicker
                    value={value}
                    onChange={(value) => {
                        setValue(value);
                        imageCustomFieldValue = value;
                    }}
                    showRemove
                    style={{ margin: '15px 0' }}
                    {...(settings.props ?? {})}
                />
            )
        },
        saveData: () => imageCustomFieldValue,
    });
}


export const registerGalleryCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: GalleryPickerProps;
}) => {
    let galleryCustomFieldValue: string;

    registerCustomField({
        ...settings,
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            return (
                <GalleryPicker
                    images={value?.split(',').map(src => ({ src })) ?? []}
                    onChange={(value: TImageSettings[]) => {
                        const valStr = value.map(val => val.src).join(',');
                        setValue(valStr);
                        galleryCustomFieldValue = valStr;
                    }}
                    label={settings.label}
                    style={{ margin: '15px 0', border: '1px solid #ccc', borderRadius: '6px', padding: '10px' }}
                    {...(settings.props ?? {})}
                />
            )
        },
        saveData: () => galleryCustomFieldValue,
    });
}

export const registerCustomFieldOfType = (field: TAdminCustomField) => {
    if (field.fieldType === 'Simple text') {
        registerSimpleTextCustomField(field);
    }
    if (field.fieldType === 'Text editor') {
        registerTextEditorCustomField(field);
    }
    if (field.fieldType === 'Select') {
        registerSelectCustomField(field);
    }
    if (field.fieldType === 'Image') {
        registerImageCustomField(field);

    }
    if (field.fieldType === 'Gallery') {
        registerGalleryCustomField(field);

    }
    if (field.fieldType === 'Color') {

    }
}