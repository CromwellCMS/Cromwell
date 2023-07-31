import React, { useEffect } from 'react';
import { WidgetTypes, WidgetNames } from '../../widget-types';
import { getWidgets, onWidgetRegister } from '../../helpers/registerWidget';
import { WidgetErrorBoundary } from './WidgetErrorBoundary';
import { useForceUpdate } from '../../helpers/forceUpdate';

export const AdminPanelWidgetPlace = <T extends WidgetNames>(props: {
  widgetName: T;
  widgetProps?: WidgetTypes[T];
  pluginName?: string;
}) => {
  const { widgetName, widgetProps, pluginName } = props;
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    onWidgetRegister(widgetName, () => {
      forceUpdate();
    });
  }, []);

  if (pluginName) {
    // Display specific plugin fot this place (widgetName)
    return getNamedWidgetForPlace(widgetName, pluginName, widgetProps);
  }

  // Display all plugins for this place (widgetName)
  return <>{getWidgetsForPlace(widgetName, widgetProps)}</>;
};

export const getNamedWidgetForPlace = <T extends WidgetNames>(
  widgetName: T,
  pluginName: string,
  widgetProps?: WidgetTypes[T],
) => {
  const widgets = getWidgets(widgetName) ?? {};
  const Comp = widgets[pluginName];
  if (!Comp) return null;
  return (
    <WidgetErrorBoundary widgetName={pluginName} key={pluginName}>
      <Comp {...(typeof widgetProps !== 'object' ? ({} as any) : widgetProps)} />
    </WidgetErrorBoundary>
  );
};

export const getWidgetsForPlace = <T extends WidgetNames>(widgetName: T, widgetProps?: WidgetTypes[T]) => {
  const widgets = getWidgets(widgetName) ?? {};
  return Object.keys(widgets)
    .map((pluginName) => {
      const Comp = widgets[pluginName];
      if (!Comp) return null;
      return (
        <WidgetErrorBoundary widgetName={pluginName} key={pluginName}>
          <Comp {...(typeof widgetProps !== 'object' ? ({} as any) : widgetProps)} />
        </WidgetErrorBoundary>
      );
    })
    .filter(Boolean);
};
