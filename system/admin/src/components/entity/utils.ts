import { TCustomGraphQlProperty } from '@cromwell/core';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

export const customGraphQlPropertyToFragment = (properties?: TCustomGraphQlProperty[]): string => {
  if (!properties?.length) return '';
  const customProperties = {};
  for (const property of properties) {
    const addProperty = (prop: TCustomGraphQlProperty, mapping: any) => {
      if (typeof prop === 'object') {
        Object.entries(prop).forEach(([key, value]) => {
          if (typeof value === 'object') {
            const nextMapping = typeof mapping[key] === 'object' ? mapping[key] : {};
            if (!mapping[key]) mapping[key] = nextMapping;
            addProperty(value, nextMapping);
          } else {
            if (!mapping[key]) mapping[key] = value;
          }
        });
      } else {
        if (!mapping[prop]) mapping[prop] = true;
      }
    };

    addProperty(property, customProperties);
  }

  if (!Object.keys(customProperties).length) return '';

  return jsonToGraphQLQuery(customProperties);
};
