import { EDBEntity, getRandStr, TAdminCustomField, TBasePageEntity, TImageSettings } from '@cromwell/core';
import { SelectChangeEvent, SelectProps, TextField, TextFieldProps } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'throttle-debounce';

import { ColorPicker } from '../components/colorPicker/ColorPicker';
import entityEditStyles from '../components/entity/entityEdit/EntityEdit.module.scss';
import { GalleryPicker, GalleryPickerProps } from '../components/galleryPicker/GalleryPicker';
import { ImagePicker, ImagePickerProps } from '../components/imagePicker/ImagePicker';
import { Select } from '../components/select/Select';
import { destroyEditor, getEditorData, getEditorHtml, initTextEditor } from './editor/editor';
import { useForceUpdate } from './forceUpdate';

export type TRegisteredCustomField = TAdminCustomField & {
    component: React.ComponentType<{ initialValue: string | undefined; entity: TBasePageEntity; onChange?: (value: any) => void }>;
    saveData: () => string | Promise<string>;
}

const customFields: Record<EDBEntity | string, Record<string, TRegisteredCustomField>> = {};
const customFieldsForceUpdates: Partial<Record<EDBEntity, (() => void)>> = {};
const onFieldRegisterListeners: Record<string, ((field: TRegisteredCustomField) => any)> = {};

export const registerCustomField = (field: TRegisteredCustomField) => {
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

export const addOnFieldRegisterEventListener = (id: string, listener: ((field: TRegisteredCustomField) => any)) => {
    onFieldRegisterListeners[id] = listener;
}
export const removeOnFieldRegisterEventListener = (id: string) => {
    delete onFieldRegisterListeners[id];
}

export const RenderCustomFields = (props: {
    entityType: EDBEntity | string;
    entityData: TBasePageEntity;
    refetchMeta: () => Promise<Record<string, string> | undefined | null>;
    onChange?: (field: TRegisteredCustomField, value: any) => void;
    onDidMount?: () => void;
}) => {
    const { entityType, entityData, refetchMeta, onChange, onDidMount } = props;
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
        onDidMount?.();

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
                onChange={(value) => onChange?.(field, value)}
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

export const getCustomFieldsFor = (entityType: EDBEntity | string): TRegisteredCustomField[] => {
    return Object.values(customFields[entityType] ?? {});
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
    let customFieldValue;

    registerCustomField({
        id: getRandStr(10),
        fieldType: 'Simple text',
        ...settings,
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            customFieldValue = value;

            return <TextField
                value={value ?? ''}
                onChange={e => {
                    setValue(e.target.value);
                    props.onChange(e.target.value);
                }}
                label={settings.label ?? settings.key}
                fullWidth
                variant="standard"
                style={{ marginBottom: '15px' }}
                {...(settings.props ?? {})}
            />
        },
        saveData: () => (!customFieldValue) ? null : customFieldValue,
    });
}

export const registerTextEditorCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: TextFieldProps;
}) => {
    const state = {
        id: getRandStr(10),
        editorId: undefined,
    }

    class TextEditorCustomField extends React.Component<{ initialValue: string | undefined; entity: TBasePageEntity; onChange?: (value: any) => void }> {

        public editorId: string;
        public initialValue: string;
        public initPromise: null | Promise<void>;

        constructor(props: any) {
            super(props);

            this.editorId = 'editor_' + getRandStr(12);
            this.initialValue = this.editorId;
            state.editorId = this.editorId;
        }

        componentDidMount() {
            this.checkUpdate();
        }

        componentDidUpdate() {
            this.checkUpdate();
        }

        componentWillUnmount() {
            destroyEditor(this.editorId);
        }

        private checkUpdate = () => {
            if (this.props.initialValue !== this.initialValue) {
                this.initialValue = this.props.initialValue;
                this.initEditor();
            }
        }

        private initEditor = async () => {
            let data: {
                html: string;
                json: string;
            } | undefined = undefined;
            if (this.initPromise) await this.initPromise;
            let initDone;
            this.initPromise = new Promise(done => initDone = done);

            const target = document.getElementById(this.editorId);
            if (!target) return;
            await destroyEditor(this.editorId);
            target.innerHTML = '';


            if (this.initialValue) {
                try {
                    data = JSON.parse(this.initialValue);
                } catch (error) {
                    console.error(error);
                }
            }

            await initTextEditor({
                htmlId: this.editorId,
                data: data?.json,
                placeholder: settings.label,
                onChange: () => {
                    this.props.onChange(null);
                },
            });

            initDone();
        }

        render() {
            return (
                <div style={{ margin: '15px 0' }}
                    className={entityEditStyles.descriptionEditor}>
                    <div style={{ height: '350px' }} id={this.editorId}></div>
                </div>
            )
        }
    }

    registerCustomField({
        id: state.id,
        fieldType: 'Text editor',
        ...settings,
        component: TextEditorCustomField,
        saveData: async () => {
            const json = await getEditorData(state.editorId);
            if (!json?.blocks?.length) return null;
            const html = await getEditorHtml(state.editorId);
            return JSON.stringify({
                html,
                json,
            });
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
    let customFieldValue;

    registerCustomField({
        id: getRandStr(10),
        fieldType: 'Select',
        ...settings,
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            customFieldValue = value;

            return (
                <Select
                    style={{ margin: '15px 0' }}
                    label={settings.label}
                    value={value}
                    onChange={(event: SelectChangeEvent<string>) => {
                        setValue(event.target.value);
                        props.onChange(event.target.value);
                    }}
                    size="small"
                    variant="standard"
                    fullWidth
                    options={settings.options?.map(opt => ({ label: opt, value: opt }))}
                    {...(settings.props ?? {})}
                />
            )
        },
        saveData: () => (!customFieldValue) ? null : customFieldValue,
    });
}


export const registerImageCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: ImagePickerProps;
}) => {
    let customFieldValue;

    registerCustomField({
        id: getRandStr(10),
        fieldType: 'Image',
        ...settings,
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            customFieldValue = value;

            return (
                <ImagePicker
                    value={value}
                    onChange={(value) => {
                        setValue(value);
                        props.onChange(value);
                    }}
                    showRemove
                    label={settings.label}
                    style={{ margin: '15px 0' }}
                    variant="standard"
                    {...(settings.props ?? {})}
                />
            )
        },
        saveData: () => (!customFieldValue) ? null : customFieldValue,
    });
}


export const registerGalleryCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: GalleryPickerProps;
}) => {
    let customFieldValue: string;

    registerCustomField({
        id: getRandStr(10),
        fieldType: 'Gallery',
        ...settings,
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            customFieldValue = value;

            return (
                <GalleryPicker
                    images={value?.split(',').map(src => ({ src })) ?? []}
                    onChange={(value: TImageSettings[]) => {
                        const valStr = value.map(val => val.src).join(',');
                        setValue(valStr);
                        props.onChange(valStr);
                    }}
                    label={settings.label}
                    style={{ margin: '15px 0', border: '1px solid #ccc', borderRadius: '6px', padding: '10px' }}
                    {...(settings.props ?? {})}
                />
            )
        },
        saveData: () => (!customFieldValue) ? null : customFieldValue,
    });
}


export const registerColorCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: ImagePickerProps;
}) => {
    let customFieldValue;

    registerCustomField({
        id: getRandStr(10),
        fieldType: 'Color',
        ...settings,
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            customFieldValue = value;

            return (
                <ColorPicker
                    value={value}
                    label={settings.label}
                    onChange={(value) => {
                        setValue(value);
                        props.onChange(value);
                    }}
                    style={{ margin: '15px 0' }}
                    {...(settings.props ?? {})}
                />
            )
        },
        saveData: () => (!customFieldValue) ? null : customFieldValue,
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
        registerColorCustomField(field);
    }
}