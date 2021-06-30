import {
    TAttribute,
    TCmsSettings,
    TOrder,
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

// { [ActionName] : PayloadType }
export type ActionTypes = {
    install_plugin: { pluginName: string; };
    update_plugin: { pluginName: string; };
    uninstall_plugin: { pluginName: string; };

    install_theme: { themeName: string; };
    update_theme: { themeName: string; };
    uninstall_theme: { themeName: string; };

    create_post: TPost;
    update_post?: TPost;
    delete_post: { id: string };

    create_tag: TTag;
    update_tag?: TTag;
    delete_tag: { id: string };

    create_post_comment: TPostComment;
    update_post_comment?: TPostComment;
    delete_post_comment: { id: string };

    create_product: TProduct;
    update_product?: TProduct;
    delete_product: { id: string };

    create_product_category: TProductCategory;
    update_product_category?: TProductCategory;
    delete_product_category: { id: string };

    create_attribute: TAttribute;
    update_attribute?: TAttribute;
    delete_attribute: { id: string };

    create_order: TOrder;
    update_order?: TOrder;
    delete_order: { id: string };

    create_product_review: TProductReview;
    update_product_review?: TProductReview;
    delete_product_review: { id: string };

    create_user: TUser;
    update_user?: TUser;
    delete_user: { id: string };

    update_settings: TCmsSettings;
};

export type ActionNames = keyof ActionTypes;
