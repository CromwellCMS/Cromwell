import { TCustomPermission, TPermission, TPermissionName, TRole } from '@cromwell/core';
import { SetMetadata } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';

import { RoleRepository } from '../repositories/role.repository';

let roles: TRole[] = [];
export const onRolesChange = async () => {
    roles = await getCustomRepository(RoleRepository).getAll();
}

export const getCurrentRoles = () => roles;

export const getUserRole = (role: string) => roles.find(r => r.name === role);

export const checkRoles = async () => {
    if (!roles?.length) {
        await onRolesChange();
    }
}

/** Nest.js guard */
export const DefaultPermissions = (...permissions: TPermissionName[]) => SetMetadata('permissions', permissions);

export const CustomPermissions = <TCustomPermissions = string>
    (...permissions: TCustomPermissions[]) => SetMetadata('permissions', permissions);


const permissions: Record<string, TCustomPermission> = {};

export const registerPermission = (permission: TPermission | TCustomPermission) => {
    permissions[permission.name] = permission;
}

export const getPermissions = (): TCustomPermission[] => Object.values(permissions);

const cmsPermissions: Record<TPermissionName, TPermission> = {
    'all': {
        name: 'all',
        title: 'Administrator',
        description: 'Unrestricted access to manage CMS',
    },
    'read_plugins': {
        name: 'read_plugins',
        title: 'See all available plugins',
        description: '',
    },
    'install_plugin': {
        name: 'install_plugin',
        title: 'Install plugins from the market',
        description: '',
    },
    'update_plugin': {
        name: 'update_plugin',
        title: 'Update plugins to a newer version',
        description: '',
    },
    'uninstall_plugin': {
        name: 'uninstall_plugin',
        title: 'Uninstall plugins',
        description: '',
    },
    'activate_plugin': {
        name: 'activate_plugin',
        title: 'Activate disabled plugin',
        description: '',
    },
    'read_plugin_settings': {
        name: 'read_plugin_settings',
        title: 'See settings of any plugin',
        description: '',
    },
    'update_plugin_settings': {
        name: 'update_plugin_settings',
        title: 'Modify settings of any plugin',
        description: '',
    },
    'read_themes': {
        name: 'read_themes',
        title: 'See all available themes',
        description: '',
    },
    'install_theme': {
        name: 'install_theme',
        title: 'Install themes from the market',
        description: '',
    },
    'update_theme': {
        name: 'update_theme',
        title: 'Update themes to a newer version',
        description: '',
    },
    'uninstall_theme': {
        name: 'uninstall_theme',
        title: 'Uninstall themes',
        description: '',
    },
    'change_theme': {
        name: 'change_theme',
        title: 'Change active theme',
        description: '',
    },
    'activate_theme': {
        name: 'activate_theme',
        title: 'Activate disabled theme',
        description: '',
    },
    'read_theme_settings': {
        name: 'read_theme_settings',
        title: 'See theme in Theme editor',
        description: '',
    },
    'update_theme_settings': {
        name: 'update_theme_settings',
        title: 'Change theme in Theme editor',
        description: '',
    },
    'read_posts': {
        name: 'read_posts',
        title: 'See public posts',
        description: '',
    },
    'read_post_drafts': {
        name: 'read_post_drafts',
        title: 'See unpublished posts (drafts)',
        description: '',
    },
    'create_post': {
        name: 'create_post',
        title: 'Create or publish new post',
        description: '',
    },
    'update_post': {
        name: 'update_post',
        title: 'Edit any post',
        description: '',
    },
    'delete_post': {
        name: 'delete_post',
        title: 'Delete any post',
        description: '',
    },
    'read_tags': {
        name: 'read_tags',
        title: 'See all available tags',
        description: '',
    },
    'create_tag': {
        name: 'create_tag',
        title: 'Create new tag',
        description: '',
    },
    'update_tag': {
        name: 'update_tag',
        title: 'Edit any tag',
        description: '',
    },
    'delete_tag': {
        name: 'delete_tag',
        title: 'Delete any tag',
        description: '',
    },
    'read_post_comments': {
        name: 'read_post_comments',
        title: 'See all available comments',
        description: '',
    },
    'create_post_comment': {
        name: 'create_post_comment',
        title: 'Create new comment',
        description: '',
    },
    'update_post_comment': {
        name: 'update_post_comment',
        title: 'Edit any comment',
        description: '',
    },
    'delete_post_comment': {
        name: 'delete_post_comment',
        title: 'Delete any comment',
        description: '',
    },
    'read_products': {
        name: 'read_products',
        title: 'See all available products',
        description: '',
    },
    'create_product': {
        name: 'create_product',
        title: 'Create new product',
        description: '',
    },
    'update_product': {
        name: 'update_product',
        title: 'Edit any product',
        description: '',
    },
    'delete_product': {
        name: 'delete_product',
        title: 'Delete any product',
        description: '',
    },
    'read_product_categories': {
        name: 'read_product_categories',
        title: 'See all available product categories',
        description: '',
    },
    'create_product_category': {
        name: 'create_product_category',
        title: 'Create new product category',
        description: '',
    },
    'update_product_category': {
        name: 'update_product_category',
        title: 'Edit any product category',
        description: '',
    },
    'delete_product_category': {
        name: 'delete_product_category',
        title: 'Delete any product category',
        description: '',
    },
    'read_attributes': {
        name: 'read_attributes',
        title: 'See all available attributes',
        description: '',
    },
    'create_attribute': {
        name: 'create_attribute',
        title: 'Create new attribute',
        description: '',
    },
    'update_attribute': {
        name: 'update_attribute',
        title: 'Edit any attribute',
        description: '',
    },
    'delete_attribute': {
        name: 'delete_attribute',
        title: 'Delete any attribute',
        description: '',
    },
    'read_orders': {
        name: 'read_orders',
        title: 'See all available orders',
        description: '',
    },
    'read_my_orders': {
        name: 'read_my_orders',
        title: 'See only orders of this user',
        description: '',
    },
    'create_order': {
        name: 'create_order',
        title: 'Create new order',
        description: '',
    },
    'update_order': {
        name: 'update_order',
        title: 'Edit any order',
        description: '',
    },
    'delete_order': {
        name: 'delete_order',
        title: 'Delete any order',
        description: '',
    },
    'read_product_reviews': {
        name: 'read_product_reviews',
        title: 'See all available product reviews',
        description: '',
    },
    'create_product_review': {
        name: 'create_product_review',
        title: 'Create new product review',
        description: '',
    },
    'update_product_review': {
        name: 'update_product_review',
        title: 'Edit any product review',
        description: '',
    },
    'delete_product_review': {
        name: 'delete_product_review',
        title: 'Delete any product review',
        description: '',
    },
    'read_users': {
        name: 'read_users',
        title: 'See all available users',
        description: '',
    },
    'read_my_user': {
        name: 'read_my_user',
        title: 'See only info of this user',
        description: '',
    },
    'create_user': {
        name: 'create_user',
        title: 'Create new user',
        description: '',
    },
    'update_user': {
        name: 'update_user',
        title: 'Edit any user',
        description: '',
    },
    'update_my_user': {
        name: 'update_my_user',
        title: 'Edit user info only of this user',
        description: '',
    },
    'delete_user': {
        name: 'delete_user',
        title: 'Delete any user',
        description: '',
    },
    'read_roles': {
        name: 'read_roles',
        title: 'See all available roles',
        description: '',
    },
    'create_role': {
        name: 'create_role',
        title: 'Create new role',
        description: '',
    },
    'update_role': {
        name: 'update_role',
        title: 'Edit any role',
        description: '',
    },
    'delete_role': {
        name: 'delete_role',
        title: 'Delete any role',
        description: '',
    },
    'read_permissions': {
        name: 'read_permissions',
        title: 'See all available permissions',
        description: '',
    },
    'read_custom_entities': {
        name: 'read_custom_entities',
        title: 'See all available custom entities',
        description: '',
    },
    'create_custom_entity': {
        name: 'create_custom_entity',
        title: 'Create new custom entity',
        description: '',
    },
    'update_custom_entity': {
        name: 'update_custom_entity',
        title: 'Edit any custom entity',
        description: '',
    },
    'delete_custom_entity': {
        name: 'delete_custom_entity',
        title: 'Delete any custom entity',
        description: '',
    },
    'read_coupons': {
        name: 'read_coupons',
        title: 'See all available coupons',
        description: '',
    },
    'create_coupon': {
        name: 'create_coupon',
        title: 'Create new coupon',
        description: '',
    },
    'update_coupon': {
        name: 'update_coupon',
        title: 'Edit any coupon',
        description: '',
    },
    'delete_coupon': {
        name: 'delete_coupon',
        title: 'Delete any coupon',
        description: '',
    },
    'read_cms_settings': {
        name: 'read_cms_settings',
        title: 'See CMS admin settings',
        description: '',
    },
    'update_cms_settings': {
        name: 'update_cms_settings',
        title: 'Edit CMS settings',
        description: '',
    },
    'update_cms': {
        name: 'update_cms',
        title: 'Launch CMS update to a newer version',
        description: '',
    },
    'export_db': {
        name: 'export_db',
        title: 'Export data into backup file',
        description: '',
    },
    'import_db': {
        name: 'import_db',
        title: 'Import data from backup file',
        description: '',
    },
    'read_public_directories': {
        name: 'read_public_directories',
        title: 'See files/folders in the file manager (media)',
        description: '',
    },
    'create_public_directory': {
        name: 'create_public_directory',
        title: 'Create new folder in the file manager (media)',
        description: '',
    },
    'remove_public_directory': {
        name: 'remove_public_directory',
        title: 'Delete any folder in the file manager (media)',
        description: '',
    },
    'upload_file': {
        name: 'upload_file',
        title: 'Upload new file in the file manager (media)',
        description: '',
    },
    'download_file': {
        name: 'download_file',
        title: 'Download any file/folder(zip) in the file manager (media)',
        description: '',
    },
    'delete_file': {
        name: 'delete_file',
        title: 'Delete any file in the file manager (media)',
        description: '',
    },
    'read_cms_statistics': {
        name: 'read_cms_statistics',
        title: 'See CMS statistics (dashboard page)',
        description: '',
    },
    'read_cms_status': {
        name: 'read_cms_status',
        title: 'Get CMS updates and notifications',
        description: '',
    },
    'read_system_info': {
        name: 'read_system_info',
        title: 'See system info of web server',
        description: '',
    },
}

Object.values(cmsPermissions).forEach(registerPermission);
