import { CheckboxInput } from '@components/inputs/CheckboxInput';
import { ColorInput, ColorInputProps } from '@components/inputs/ColorInput';
import { DateInput, DateInputProps, DateInputType } from '@components/inputs/DateInput/DateInput';
import { GalleryPicker, GalleryPickerProps } from '@components/inputs/GalleryInput/GalleryInput';
import { ImageInput, ImageInputProps } from '@components/inputs/Image/ImageInput';
import { SelectInput, SelectInputProps } from '@components/inputs/SelectInput';
import { TextEditor } from '@components/inputs/TextEditor';
import { TextInput, TextInputProps } from '@components/inputs/TextInput/TextInput';
import {
  EDBEntity,
  getRandStr,
  TAdminCustomField,
  TBasePageEntity,
  TCustomFieldSimpleTextType,
  TImageSettings,
} from '@cromwell/core';
import { getEditorData, getEditorHtml } from '@helpers/editor';
import { NumberFormatCustom } from '@helpers/NumberFormatCustom';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { CheckboxProps, IconButton, InputAdornment } from '@mui/material';
import React, { useState } from 'react';

import { registerCustomField } from './helpers';
import { useInitialValue } from './hooks';
import { fieldsCache } from './state';

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
    component: !Component
      ? undefined
      : (props) => {
          const [value, setValue] = useInitialValue(props.initialValue);
          fieldsCache[id].value = value;

          return (
            <Component
              {...props}
              value={value}
              onChange={(value) => {
                fieldsCache[id].value = value;
                setValue(value);
              }}
            />
          );
        },
    saveData: saveData ?? (() => (!fieldsCache[id].value ? null : fieldsCache[id].value)),
  };
  return fieldsCache[id];
};

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

      return (
        <TextInput
          value={value ?? ''}
          type={simpleTextType === 'password' && !showPassword ? 'password' : 'text'}
          onChange={(e) => {
            if (simpleTextType === 'integer' || simpleTextType === 'float') {
              const val = simpleTextType === 'integer' ? parseInt(e.target.value) : parseFloat(e.target.value);

              if (!isNaN(val)) {
                fieldsCache[id].value = val;
                setValue(val as any);
                props.onChange?.(val);
              }
              return;
            }
            fieldsCache[id].value = e.target.value;
            setValue(e.target.value);
            props.onChange?.(e.target.value);
          }}
          label={settings.label ?? settings.key}
          inputComponent={
            simpleTextType === 'textarea'
              ? 'textarea'
              : simpleTextType === 'currency'
              ? (NumberFormatCustom as any)
              : undefined
          }
          endAdornment={
            simpleTextType === 'password' ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ) : undefined
          }
          error={props.error && props.canValidate}
          {...(settings.props ?? {})}
        />
      );
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
};

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
};

export const getTextEditorField = (settings: { id: string; label?: string; props?: TextInputProps }) => {
  const { id } = settings;
  if (fieldsCache[id]) return fieldsCache[id];

  const state = {
    id,
    editorId: undefined,
  };

  fieldsCache[id] = {
    component: (props) => (
      <TextEditor {...props} {...settings} {...settings.props} getId={(id) => (state.editorId = id)} />
    ),
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
};

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
};

export const getSelectField = (settings: {
  id: string;
  label?: string;
  props?: SelectInputProps;
  options?: (
    | {
        value: string | number | undefined;
        label: string;
      }
    | string
    | number
    | undefined
  )[];
}) => {
  const { id } = settings;
  if (fieldsCache[id]) return fieldsCache[id];

  fieldsCache[id] = {
    component: (props) => {
      const [value, setValue] = useInitialValue(props.initialValue);
      fieldsCache[id].value = value;

      return (
        <SelectInput
          value={value}
          onChange={(value) => {
            fieldsCache[id].value = value;
            setValue(value);
            props.onChange?.(value);
          }}
          options={props.options ?? settings.options}
          label={settings.label}
          error={props.error && props.canValidate}
          {...(settings.props ?? {})}
        />
      );
    },
    saveData: () => (!fieldsCache[id].value ? null : fieldsCache[id].value),
  };
  return fieldsCache[id];
};

export const registerSelectCustomField = (settings: {
  entityType: EDBEntity | string;
  key: string;
  label?: string;
  options?: (
    | {
        value: string | number | undefined;
        label: string;
      }
    | string
    | number
    | undefined
  )[];
  props?: SelectInputProps;
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
};

export const getImageField = (settings: { id: string; label?: string; props?: ImageInputProps }) => {
  const { id } = settings;
  if (fieldsCache[id]) return fieldsCache[id];

  fieldsCache[id] = {
    component: (props) => {
      const [value, setValue] = useInitialValue(props.initialValue);
      fieldsCache[id].value = value;

      return (
        <ImageInput
          value={value}
          onChange={(value) => {
            fieldsCache[id].value = value;
            setValue(value);
            props.onChange?.(value);
          }}
          showRemove
          label={settings.label}
          variant="standard"
          {...(settings.props ?? {})}
        />
      );
    },
    saveData: () => (!fieldsCache[id].value ? null : fieldsCache[id].value),
  };
  return fieldsCache[id];
};

export const registerImageCustomField = (settings: {
  entityType: EDBEntity | string;
  key: string;
  label?: string;
  props?: ImageInputProps;
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
};

export const getGalleryField = (settings: { id: string; label?: string; props?: GalleryPickerProps }) => {
  const { id } = settings;
  if (fieldsCache[id]) return fieldsCache[id];

  fieldsCache[id] = {
    component: (props) => {
      const [value, setValue] = useInitialValue(props.initialValue);
      fieldsCache[id].value = value;

      return (
        <GalleryPicker
          images={value?.split(',').map((src) => ({ src })) ?? []}
          onChange={(value: TImageSettings[]) => {
            const valStr = value.map((val) => val.src).join(',');
            fieldsCache[id].value = valStr;
            setValue(valStr);
            props.onChange?.(valStr);
          }}
          label={settings.label}
          style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '10px' }}
          {...(settings.props ?? {})}
        />
      );
    },
    saveData: () => (!fieldsCache[id].value ? null : fieldsCache[id].value),
  };
  return fieldsCache[id];
};

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
};

export const getColorField = (settings: { id: string; label?: string; props?: ColorInputProps }) => {
  const { id, label } = settings;
  if (fieldsCache[id]) return fieldsCache[id];

  fieldsCache[id] = {
    component: (props) => {
      const [value, setValue] = useInitialValue(props.initialValue);
      fieldsCache[id].value = value;

      return (
        <ColorInput
          value={value}
          label={label}
          onChange={(value) => {
            fieldsCache[id].value = value;
            setValue(value);
            props.onChange?.(value);
          }}
          {...(settings.props ?? {})}
        />
      );
    },
    saveData: () => (!fieldsCache[id].value ? null : fieldsCache[id].value),
  };
  return fieldsCache[id];
};

export const registerColorCustomField = (settings: {
  entityType: EDBEntity | string;
  key: string;
  label?: string;
  props?: ColorInputProps;
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
};

export const getCheckboxField = (settings: { id: string; label?: string; props?: CheckboxProps }) => {
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
            fieldsCache[id].value = value;
            setValue(value as any);
            props.onChange?.(value);
          }}
          label={label}
          color="primary"
          {...(settings.props ?? {})}
        />
      );
    },
    saveData: () => (!fieldsCache[id].value ? null : fieldsCache[id].value),
  };
  return fieldsCache[id];
};

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
};

export const getDatepickerField = (settings: {
  id: string;
  label?: string;
  props?: DateInputProps;
  dateType?: DateInputType;
}) => {
  const { id, label, dateType } = settings;
  if (fieldsCache[id]) return fieldsCache[id];

  fieldsCache[id] = {
    component: (props) => {
      const [value, setValue] = useInitialValue(props.initialValue);
      fieldsCache[id].value = value;

      return (
        <div>
          <DateInput
            onChange={(date) => {
              fieldsCache[id].value = date;
              setValue(date);
              props.onChange?.(date);
            }}
            value={value}
            label={label}
            dateType={dateType}
            {...(settings.props ?? {})}
          />
        </div>
      );
    },
    saveData: () => (!fieldsCache[id].value ? null : fieldsCache[id].value),
  };
  return fieldsCache[id];
};

export const registerDatepickerCustomField = (settings: {
  entityType: EDBEntity | string;
  key: string;
  label?: string;
  props?: DateInputProps;
  dateType?: DateInputType;
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
};

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
};
