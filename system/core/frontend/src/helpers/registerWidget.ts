import React from 'react';
import { WidgetTypes, WidgetNames } from '../widget-types';

const widgets: Record<string, Record<string, React.ComponentType<any>>> = {};

export const registerWidget = <T extends WidgetNames>(options: {
  widgetName: T;
  component: React.ComponentType<WidgetTypes[T]>;
  pluginName: string;
}) => {
  const { pluginName, widgetName, component } = options ?? {};
  if (!pluginName || !widgetName || !component) {
    console.error('registerComponent: Invalid options: ' + options);
    return;
  }

  if (!widgets[widgetName]) widgets[widgetName] = {};
  widgets[widgetName][pluginName] = component;

  if (!widgetRegisterCallbacks[widgetName]) widgetRegisterCallbacks[widgetName] = [];
  widgetRegisterCallbacks[widgetName].forEach((cb) => cb(pluginName, component));
};

const widgetRegisterCallbacks: Record<string, ((pluginName: string, component: React.ComponentType<any>) => any)[]> =
  {};

export const onWidgetRegister = <T extends WidgetNames>(
  widgetName: T,
  callback: (pluginName: string, component: React.ComponentType<WidgetTypes[T]>) => any,
) => {
  if (!widgetRegisterCallbacks[widgetName]) widgetRegisterCallbacks[widgetName] = [];
  widgetRegisterCallbacks[widgetName].push(callback);
};

export const getWidgets = <T extends WidgetNames>(
  widgetName: T,
): Record<string, React.ComponentType<WidgetTypes[T]>> => {
  return widgets[widgetName];
};
