import {
    TCmsStats,
    TCromwellBlock,
    TCromwellBlockData,
    TCromwellBlockType,
    TOrder,
    TPluginSettingsProps,
    TPost,
    TProduct,
    TProductCategory,
    TTag,
} from '@cromwell/core';

// { [WidgetName] : ComponentPropsType }
export type WidgetTypes = {
    PluginSettings: TPluginSettingsProps;
    Dashboard: Widget_DashboardProps;
    PostActions: Widget_PostActions;
    ThemeEditor: {
        block?: TCromwellBlock;
        instanceSettings?: any;
        changeInstanceSettings?: (data: any) => void;
        modifyData?: (data: TCromwellBlockData) => void;
        deleteBlock?: () => void;
        addNewBlockAfter?: (bType: TCromwellBlockType) => void;
        updateFramesPosition?: () => any;
        forceUpdate?: () => void;
    };
    TagActions: Widget_EntityActions<TTag>;
    ProductActions: Widget_EntityActions<TProduct>;
    CategoryActions: Widget_EntityActions<TProductCategory>;
    OrderActions: Widget_EntityActions<TOrder>;
};

export type WidgetNames = keyof WidgetTypes;

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
    data?: T;
    setData?: (data: T) => any;
}

export type Widget_PostActions = Widget_EntityActions<TPost> & {
    editorInstance: any;
}

