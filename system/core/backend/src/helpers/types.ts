import {
    TAttribute,
    TCmsSettings,
    TOrder,
    TPaymentSession,
    TPost,
    TPostComment,
    TProduct,
    TProductCategory,
    TProductReview,
    TTag,
    TUser,
} from '@cromwell/core';

export type TBackendModule = {
    controllers?: unknown[];
    entities?: unknown[];
    resolvers?: unknown[];
    providers?: unknown[];
    migrations?: unknown[];
}

export type Action<PayloadType, OutputType = any> = {
    payload: PayloadType;
    output: OutputType;
}

export type ActionTypes = {
    install_plugin: Action<{ pluginName: string; }>;
    update_plugin: Action<{ pluginName: string; }>;
    uninstall_plugin: Action<{ pluginName: string; }>;

    install_theme: Action<{ themeName: string; }>;
    update_theme: Action<{ themeName: string; }>;
    uninstall_theme: Action<{ themeName: string; }>;

    create_post: Action<TPost>;
    update_post: Action<TPost>;
    delete_post: Action<{ id: string }>;

    create_tag: Action<TTag>;
    update_tag: Action<TTag>;
    delete_tag: Action<{ id: string }>;

    create_post_comment: Action<TPostComment>;
    update_post_comment: Action<TPostComment>;
    delete_post_comment: Action<{ id: string }>;

    create_product: Action<TProduct>;
    update_product: Action<TProduct>;
    delete_product: Action<{ id: string }>;

    create_product_category: Action<TProductCategory>;
    update_product_category: Action<TProductCategory>;
    delete_product_category: Action<{ id: string }>;

    create_attribute: Action<TAttribute>;
    update_attribute: Action<TAttribute>;
    delete_attribute: Action<{ id: string }>;

    create_order: Action<TOrder>;
    update_order: Action<TOrder>;
    delete_order: Action<{ id: string }>;

    create_product_review: Action<TProductReview>;
    update_product_review: Action<TProductReview>;
    delete_product_review: Action<{ id: string }>;

    create_user: Action<TUser>;
    update_user: Action<TUser>;
    delete_user: Action<{ id: string }>;

    update_settings: Action<TCmsSettings>;

    create_payment: Action<TPaymentSession, {
        link: string;
        name: string;
    }>;
};

export type ActionNames = keyof ActionTypes;
