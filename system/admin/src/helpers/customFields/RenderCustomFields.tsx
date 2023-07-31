import { EDBEntity, TBasePageEntity } from '@cromwell/core';
import React, { useEffect, useState } from 'react';
import { debounce } from 'throttle-debounce';

import { useForceUpdate } from '../forceUpdate';
import { addOnFieldRegisterEventListener, removeOnFieldRegisterEventListener } from './helpers';
import { customFields, customFieldsForceUpdates } from './state';
import { TRegisteredCustomField } from './types';

export const RenderCustomFields = (props: {
  entityType: EDBEntity | string;
  entityData: TBasePageEntity;
  refetchMeta: () => Promise<Record<string, string | null | undefined> | undefined | null>;
  onChange?: (field: TRegisteredCustomField, value: any) => void;
  onDidMount?: () => void;
  FieldWrapper?: React.ComponentType<{ children: React.ReactNode }>;
}) => {
  const { entityType, entityData, refetchMeta, onChange, onDidMount, FieldWrapper } = props;
  const forceUpdate = useForceUpdate();
  customFieldsForceUpdates[entityType] = forceUpdate;
  const [updatedMeta, setUpdatedMeta] = useState<Record<string, string | null | undefined> | null>(null);

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
    };
  }, []);

  // Just update the values that are undefined, but leave the rest
  // for user input to be untouched
  const customMeta = Object.assign({}, updatedMeta, entityData?.customMeta);

  return (
    <>
      {Object.values(customFields[entityType] ?? {})
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((field) => {
          const Comp = field.component;
          const content = (
            <Comp
              key={field.key}
              initialValue={customMeta?.[field.key]}
              entity={entityData}
              onChange={(value) => onChange?.(field, value)}
            />
          );
          if (FieldWrapper) {
            return <FieldWrapper key={field.key}>{content}</FieldWrapper>;
          }
          return content;
        })}
    </>
  );
};
