import {
    EDBEntity,
    getRandStr,
    TAdminCustomField,
    TBasePageEntity,
    TCustomFieldSimpleTextType,
    TImageSettings,
} from '@cromwell/core';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { CheckboxProps, IconButton, InputAdornment, SelectChangeEvent, SelectProps } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'throttle-debounce';

import { ColorPicker, ColorPickerProps } from '../components/colorPicker/ColorPicker';
import { Datepicker, DatepickerProps } from '../components/forms/inputs/Datepicker';
import entityEditStyles from '../components/entity/entityEdit/EntityEdit.module.scss';
import { CheckboxInput } from '../components/forms/inputs/checkboxInput';
import { TextInputField, TextInputProps } from '../components/forms/inputs/textInput';
import { GalleryPicker, GalleryPickerProps } from '../components/galleryPicker/GalleryPicker';
import { ImagePicker, ImagePickerProps } from '../components/imagePicker/ImagePicker';
import { Select } from '../components/select/Select';
import { destroyEditor, getEditorData, getEditorHtml, initTextEditor } from './editor/editor';
import { useForceUpdate } from './forceUpdate';
import { NumberFormatCustom } from './NumberFormatCustom';

export type TRegisteredCustomField = TAdminCustomField & {
    component: React.ComponentType<{
        initialValue: string | undefined;
        entity: TBasePageEntity;
        onChange?: (value: any) => void;
    }>;
    saveData: () => string | Promise<string>;
}

export type TFieldDefaultComponent = React.ComponentType<{
    initialValue: string | undefined;
    entity: TBasePageEntity;
    canValidate?: boolean;
    error?: boolean;
    options?: ({
        value: string | number | undefined;
        label: string;
    } | string | number | undefined)[];
    onChange?: (value: any) => void;
}>

const customFields: Record<EDBEntity | string, Record<string, TRegisteredCustomField>> = {};
const customFieldsForceUpdates: Partial<Record<EDBEntity, (() => void)>> = {};
const onFieldRegisterListeners: Record<string, ((field: TRegisteredCustomField) => any)> = {};

const fieldsCache: Record<string, {
    component: TFieldDefaultComponent;
    saveData: () => string | Promise<string>;
    value?: any;
}> = {};

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

const useInitialValue = (initialValue: any): [any, React.Dispatch<React.SetStateAction<any>>] => {
    const [value, setValue] = useState(initialValue);
    const initialValueRef = useRef(initialValue);
    if (initialValue !== initialValueRef.current) {
        initialValueRef.current = initialValue;
        setValue(initialValue);
    }
    return [value, setValue];
}


export const getCustomField = (settings: {
    id: string;
    key?: string;
    label?: string;
    component?: React.ComponentType<{
        value: any;
        onChange: (value: any) => void;
        entity: TBasePageEntity;
        canValidate?: boolean;
        error?: boolean;
    }>;
    saveData?: () => any | Promise<any>;
}) => {
    const { id, component: Component, saveData } = settings;
    if (!Component) return;
    if (fieldsCache[id]) return fieldsCache[id];

    fieldsCache[id] = {
        component: !Component ? undefined : (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            fieldsCache[id].value = value;

            return <Component
                {...props}
                value={value}
                onChange={value => setValue(value)}
            />
        },
        saveData: saveData ?? (() => (!fieldsCache[id].value) ? null : fieldsCache[id].value),
    };
    return fieldsCache[id];
}

export const getSimpleTextField = (settings: {
    id: string;
    key?: string;
    label?: string;
    props?: TextInputProps;
    simpleTextType?: TCustomFieldSimpleTextType;
}) => {
    const { id, simpleTextType } = settings;
    if (fieldsCache[id]) return fieldsCache[id];

    fieldsCache[id] = {
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            const [showPassword, setShowPassword] = useState(false);
            fieldsCache[id].value = value;

            return <TextInputField
                value={value ?? ''}
                type={(simpleTextType === 'password' && !showPassword) ? 'password' : 'text'}
                onChange={e => {
                    if (simpleTextType === 'integer' || simpleTextType === 'float') {
                        const val = simpleTextType === 'integer' ? parseInt(e.target.value) :
                            parseFloat(e.target.value);
                        if (!isNaN(val)) {
                            setValue(val as any);
                            props.onChange?.(val);
                        }
                        return;
                    }
                    setValue(e.target.value);
                    props.onChange?.(e.target.value);
                }}
                label={settings.label ?? settings.key}
                inputComponent={simpleTextType === 'textarea' ? 'textarea' :
                    simpleTextType === 'currency' ? NumberFormatCustom as any : undefined}
                endAdornment={simpleTextType === 'password' ? (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                        >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                    </InputAdornment>
                ) : undefined}
                error={props.error && props.canValidate}
                {...(settings.props ?? {})}
            />
        },
        saveData: () => {
            const value = fieldsCache[id].value;
            if (simpleTextType === 'currency' || simpleTextType === 'float') {
                const valueNum = parseFloat(value);
                return isNaN(valueNum) ? null : valueNum;
            }
            if (simpleTextType === 'integer') {
                const valueNum = parseInt(value);
                return isNaN(valueNum) ? null : valueNum;
            }
            return !value ? null : value;
        },
    };
    return fieldsCache[id];
}


export const registerSimpleTextCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: TextInputProps;
    simpleTextType?: TCustomFieldSimpleTextType;
}) => {
    const id = getRandStr(12);
    const field = getSimpleTextField({ id, ...settings });

    registerCustomField({
        id: getRandStr(10),
        fieldType: 'Simple text',
        ...settings,
        component: field.component,
        saveData: field.saveData,
    });
}


export const getTextEditorField = (settings: {
    id: string;
    label?: string;
    props?: TextInputProps;
}) => {
    const { id } = settings;
    if (fieldsCache[id]) return fieldsCache[id];

    const state = {
        id,
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
                    this.props.onChange?.(null);
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


    fieldsCache[id] = {
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
    };
    return fieldsCache[id];
}

export const registerTextEditorCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: TextInputProps;
}) => {
    const id = getRandStr(12);
    const field = getTextEditorField({ id, ...settings });

    registerCustomField({
        id: getRandStr(10),
        fieldType: 'Text editor',
        ...settings,
        component: field.component,
        saveData: field.saveData,
    });
}


export const getSelectField = (settings: {
    id: string;
    label?: string;
    props?: SelectProps<string>;
    options?: ({
        value: string | number | undefined;
        label: string;
    } | string | number | undefined)[];
}) => {
    const { id } = settings;
    if (fieldsCache[id]) return fieldsCache[id];

    fieldsCache[id] = {
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            fieldsCache[id].value = value;

            return (
                <Select
                    value={value}
                    onChange={(event: SelectChangeEvent<string>) => {
                        setValue(event.target.value);
                        props.onChange?.(event.target.value);
                    }}
                    size="small"
                    variant="standard"
                    fullWidth
                    options={props.options ?? settings.options}
                    error={props.error && props.canValidate}
                    {...(settings.props ?? {})}
                />
            )
        },
        saveData: () => (!fieldsCache[id].value) ? null : fieldsCache[id].value,
    };
    return fieldsCache[id];
}

export const registerSelectCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    options?: ({
        value: string | number | undefined;
        label: string;
    } | string | number | undefined)[];
    props?: SelectProps<string>;
}) => {
    const id = getRandStr(12);
    const field = getSelectField({ id, ...settings });

    registerCustomField({
        id: getRandStr(10),
        fieldType: 'Select',
        ...settings,
        component: field.component,
        saveData: field.saveData,
    });
}


export const getImageField = (settings: {
    id: string;
    label?: string;
    props?: ImagePickerProps;
}) => {
    const { id } = settings;
    if (fieldsCache[id]) return fieldsCache[id];

    fieldsCache[id] = {
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            fieldsCache[id].value = value;

            return (
                <ImagePicker
                    value={value}
                    onChange={(value) => {
                        setValue(value);
                        props.onChange?.(value);
                    }}
                    showRemove
                    label={settings.label}
                    variant="standard"
                    {...(settings.props ?? {})}
                />
            )
        },
        saveData: () => (!fieldsCache[id].value) ? null : fieldsCache[id].value,
    };
    return fieldsCache[id];
}

export const registerImageCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: ImagePickerProps;
}) => {
    const id = getRandStr(12);
    const field = getImageField({ id, ...settings });

    registerCustomField({
        id: getRandStr(10),
        fieldType: 'Image',
        ...settings,
        component: field.component,
        saveData: field.saveData,
    });
}


export const getGalleryField = (settings: {
    id: string;
    label?: string;
    props?: GalleryPickerProps;
}) => {
    const { id } = settings;
    if (fieldsCache[id]) return fieldsCache[id];

    fieldsCache[id] = {
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            fieldsCache[id].value = value;

            return (
                <GalleryPicker
                    images={value?.split(',').map(src => ({ src })) ?? []}
                    onChange={(value: TImageSettings[]) => {
                        const valStr = value.map(val => val.src).join(',');
                        setValue(valStr);
                        props.onChange?.(valStr);
                    }}
                    label={settings.label}
                    style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '10px' }}
                    {...(settings.props ?? {})}
                />
            )
        },
        saveData: () => (!fieldsCache[id].value) ? null : fieldsCache[id].value,
    };
    return fieldsCache[id];
}

export const registerGalleryCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: GalleryPickerProps;
}) => {
    const id = getRandStr(12);
    const field = getGalleryField({ id, ...settings });

    registerCustomField({
        id: getRandStr(10),
        fieldType: 'Gallery',
        ...settings,
        component: field.component,
        saveData: field.saveData,
    });
}

export const getColorField = (settings: {
    id: string;
    label?: string;
    props?: ColorPickerProps;
}) => {
    const { id, label } = settings;
    if (fieldsCache[id]) return fieldsCache[id];

    fieldsCache[id] = {
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            fieldsCache[id].value = value;

            return (
                <ColorPicker
                    value={value}
                    label={label}
                    onChange={(value) => {
                        setValue(value);
                        props.onChange?.(value);
                    }}
                    {...(settings.props ?? {})}
                />
            )
        },
        saveData: () => (!fieldsCache[id].value) ? null : fieldsCache[id].value,
    };
    return fieldsCache[id];
}

export const registerColorCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: ColorPickerProps;
}) => {
    const id = getRandStr(12);
    const field = getColorField({ id, ...settings });

    registerCustomField({
        id,
        fieldType: 'Color',
        ...settings,
        component: field.component,
        saveData: field.saveData,
    });
}


export const getCheckboxField = (settings: {
    id: string;
    label?: string;
    props?: CheckboxProps;
}) => {
    const { id, label } = settings;
    if (fieldsCache[id]) return fieldsCache[id];

    fieldsCache[id] = {
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            fieldsCache[id].value = value;

            return (
                <CheckboxInput
                    checked={!!value}
                    onChange={(event, value) => {
                        setValue(value as any);
                        props.onChange?.(value);
                    }}
                    label={label}
                    color="primary"
                    {...(settings.props ?? {})}
                />
            )
        },
        saveData: () => (!fieldsCache[id].value) ? null : fieldsCache[id].value,
    };
    return fieldsCache[id];
}

export const registerCheckboxCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: CheckboxProps;
}) => {
    const id = getRandStr(12);
    const field = getCheckboxField({ id, ...settings });

    registerCustomField({
        id,
        fieldType: 'Color',
        ...settings,
        component: field.component,
        saveData: field.saveData,
    });
}


export const getDatepickerField = (settings: {
    id: string;
    label?: string;
    props?: DatepickerProps;
    dateType?: 'date' | 'datetime' | 'time';
}) => {
    const { id, label, dateType } = settings;
    if (fieldsCache[id]) return fieldsCache[id];

    fieldsCache[id] = {
        component: (props) => {
            const [value, setValue] = useInitialValue(props.initialValue);
            fieldsCache[id].value = value;

            return (
                <div>
                    <Datepicker
                        onChange={(date) => {
                            setValue(date);
                            props.onChange?.(date);
                        }}
                        value={value}
                        label={label}
                        dateType={dateType}
                        {...(settings.props ?? {})}
                    />
                </div>
            )
        },
        saveData: () => (!fieldsCache[id].value) ? null : fieldsCache[id].value,
    };
    return fieldsCache[id];
}

export const registerDatepickerCustomField = (settings: {
    entityType: EDBEntity | string;
    key: string;
    label?: string;
    props?: DatepickerProps;
    dateType?: 'date' | 'datetime' | 'time';
}) => {
    const id = getRandStr(12);
    const field = getDatepickerField({ id, ...settings });

    registerCustomField({
        id,
        fieldType: 'Color',
        ...settings,
        component: field.component,
        saveData: field.saveData,
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
    if (field.fieldType === 'Checkbox') {
        registerCheckboxCustomField(field);
    }
    if (field.fieldType === 'Currency') {
        registerSimpleTextCustomField({
            simpleTextType: 'currency',
            ...field,
        });
    }
}