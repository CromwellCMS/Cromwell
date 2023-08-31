import { TCromwellBlock } from '@cromwell/core';
import { Switch } from '@headlessui/react';
import React, { CSSProperties, useCallback, useState } from 'react';
import { StyleNumberField } from './StyleNumberField';

export const PaddingEditor = ({
  styles,
  handleStyleChange,
}: {
  styles?: CSSProperties;
  handleStyleChange: (name: keyof React.CSSProperties, value: any) => void;
  block?: TCromwellBlock;
}) => {
  const [individual, setIndividual] = useState(false);

  const toggleIndividual = useCallback(
    (next) => {
      if (next) {
        handleStyleChange('padding', '');
      } else {
        handleStyleChange('paddingLeft', '');
        handleStyleChange('paddingRight', '');
        handleStyleChange('paddingTop', '');
        handleStyleChange('paddingBottom', '');
      }
      setIndividual(next);
    },
    [handleStyleChange],
  );

  return (
    <>
      <p className="font-bold my-2 mt-4 text-xs uppercase">Padding</p>
      <div className="mb-2">
        <Switch
          checked={individual}
          onChange={toggleIndividual}
          className={`${
            individual ? 'bg-indigo-600' : 'bg-gray-200'
          } relative inline-flex items-center h-4 rounded-full w-8`}
        >
          <span
            className={`${
              individual ? 'translate-x-5' : 'translate-x-1'
            } inline-block w-2 h-2 transform bg-white rounded-full`}
          />
        </Switch>
        <span className="ml-2 text-gray-600">individual</span>
      </div>
      {individual && (
        <div className={`grid gap-1 grid-cols-2`}>
          <StyleNumberField
            value={styles?.paddingLeft}
            keyName="paddingLeft"
            label="L"
            min={0}
            handleStyleChange={handleStyleChange}
            dataType="px"
          />

          <StyleNumberField
            value={styles?.paddingRight}
            keyName="paddingRight"
            label="R"
            min={0}
            handleStyleChange={handleStyleChange}
            dataType="px"
          />

          <StyleNumberField
            value={styles?.paddingTop}
            keyName="paddingTop"
            label="T"
            min={0}
            handleStyleChange={handleStyleChange}
            dataType="px"
          />

          <StyleNumberField
            value={styles?.paddingBottom}
            keyName="paddingBottom"
            label="B"
            min={0}
            handleStyleChange={handleStyleChange}
            dataType="px"
          />
        </div>
      )}
      {!individual && (
        <div className="grid gap-1 grid-cols-2">
          <StyleNumberField
            value={styles?.padding}
            keyName="padding"
            label="P"
            min={0}
            handleStyleChange={handleStyleChange}
            dataType="px"
          />
        </div>
      )}
    </>
  );
};
