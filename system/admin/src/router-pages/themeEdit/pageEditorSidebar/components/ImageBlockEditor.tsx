import { TCromwellBlock, TCromwellBlockData } from '@cromwell/core';
import { useForceUpdate } from '@cromwell/core-frontend';
import React from 'react';

import { ImageInput } from '../../../../components/inputs/Image/ImageInput';
import { usePageBuilder } from '../../hooks/usePageBuilder';
import { useThemeEditor } from '../../hooks/useThemeEditor';
import { SelectableField } from './SelectableField';
import { StyleNumberField } from './StyleNumberField';
import { TextInput } from './TextInput';

const fitOptions = [
  { value: 'contain', title: 'contain' },
  { value: 'cover', title: 'cover' },
  { value: 'fill', title: 'fill' },
  { value: 'none', title: 'none' },
  { value: 'scale-down', title: 'scale down' },
];

export const ImageBlockEditor = ({ block }: { block?: TCromwellBlock }) => {
  const data = block?.getData();
  const rerender = useForceUpdate();
  const { createBlockProps } = usePageBuilder();
  const { forceUpdate } = useThemeEditor();
  const blockProps = createBlockProps(block);

  const imageData = Object.assign({}, block?.getContentInstance()?.props, data?.image);

  const handleChange = (key: keyof Required<TCromwellBlockData>['image'], value: any) => {
    const data = block?.getData();
    if (!data?.id) return;

    if (!data.image) data.image = {};
    (data.image[key] as any) = value;
    blockProps?.modifyData?.(data);
    forceUpdate();
    rerender();
  };

  const handleTextInput = (name: keyof Required<TCromwellBlockData>['image']) => (value: any) => {
    let val = value;
    if (val === '' || !val) val = undefined;
    handleChange(name, val);
  };

  const objectFit = fitOptions.find((p) => p.value === imageData?.objectFit) ?? fitOptions[3];

  return (
    <div className="text-xs p-2">
      <p className="font-bold text-xs uppercase">Image Block</p>
      <label className="font-bold mt-3 text-xs block">
        image
        <ImageInput
          value={imageData?.src}
          placeholder={'Pick an image'}
          onChange={(val) => handleChange('src', val)}
          className="w-full"
        />
      </label>
      <TextInput
        prefixElement="🔗"
        label="Link to"
        value={imageData?.link}
        onChange={(e) => handleTextInput('link')(e.target.value)}
      />
      <TextInput
        prefixElement="📝"
        label="Description (alt)"
        value={imageData?.alt}
        onChange={(e) => handleTextInput('alt')(e.target.value)}
      />
      <label className="font-bold mt-3 text-xs block">
        width
        <StyleNumberField
          dataType="px"
          value={imageData?.width}
          label="W"
          min={0}
          name=""
          keyName="width"
          handleStyleChange={(keyname, val, unit) => {
            if ((!val || val === '') && (!unit || unit === 'px')) {
              handleTextInput('width')('');
            } else {
              handleTextInput('width')(`${val}${unit}`);
            }
          }}
        />
      </label>
      <label className="font-bold mt-3 text-xs block">
        height
        <StyleNumberField
          dataType="px"
          value={imageData?.height}
          label="H"
          min={0}
          name=""
          keyName="height"
          handleStyleChange={(keyname, val, unit) => {
            if ((!val || val === '') && (!unit || unit === 'px')) {
              handleTextInput('height')('');
            } else {
              handleTextInput('height')(`${val}${unit}`);
            }
          }}
        />
      </label>

      <label className="font-bold mt-3 text-xs block">
        image fit
        <SelectableField
          top
          value={objectFit}
          options={fitOptions}
          onChange={(next) => {
            handleTextInput('objectFit')(next.value);
          }}
        />
      </label>
      <TextInput
        prefixElement=""
        label="object position"
        value={imageData?.objectPosition}
        onChange={(e) => handleTextInput('objectPosition')(e.target.value)}
      />
    </div>
  );
};
