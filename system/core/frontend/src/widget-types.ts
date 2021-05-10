import { TCmsStats, TOrder, TPost, TProduct, TProductCategory, TTag } from '@cromwell/core';

// { [WidgetName] : ComponentPropsType }
export type WidgetTypes = {
    PluginSettings: PluginSettingsProps;
    Dashboard: Widget_DashboardProps;
    PostActions: Widget_PostActions;
    TagActions: Widget_EntityActions<TTag>;
    ProductActions: Widget_EntityActions<TProduct>;
    CategoryActions: Widget_EntityActions<TProductCategory>;
    OrderActions: Widget_EntityActions<TOrder>;
};

export type WidgetNames = keyof WidgetTypes;

// PluginSettings
export type PluginSettingsProps<TSettings = any> = {
    globalSettings?: TSettings;
    pluginName: string;
}

export type Widget_DashboardProps = {
    stats: TCmsStats | undefined;
    setSize: (pluginName: string, layouts: {
        lg: { h?: number; w?: number; x?: number; y?: number; }
        md: { h?: number; w?: number; x?: number; y?: number; }
        sm: { h?: number; w?: number; x?: number; y?: number; }
        xs: { h?: number; w?: number; x?: number; y?: number; }
        xxs: { h?: number; w?: number; x?: number; y?: number; }
    }) => any;
}

export type Widget_EntityActions<T> = {
    data: T;
    setData: (data: T) => any;
}

export type Widget_PostActions = Widget_EntityActions<TPost> & {
    quillInstance: any;
}

