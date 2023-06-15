import { TCustomPermission, TPermission, TPermissionCategory, TPermissionName, TRole } from '@cromwell/core';
import { getCustomRepository } from 'typeorm';

import { RoleRepository } from '../repositories/role.repository';

let roles: TRole[] = [];
export const onRolesChange = async () => {
  roles = await getCustomRepository(RoleRepository).getAll();
};

export const checkRoles = async () => {
  if (!roles?.length) {
    await onRolesChange();
  }
};

export const getCurrentRoles = () => {
  checkRoles();
  return roles;
};

export const getUserRole = (role: string) => {
  checkRoles();
  return roles.find((r) => r.name === role);
};

const permissions: Record<string, TCustomPermission> = {};

export const registerPermission = (permission: TPermission | TCustomPermission) => {
  permissions[permission.name] = Object.assign({ source: 'plugin' }, permission);
};

const permissionCategories: Record<string, TPermissionCategory> = {};

export const registerPermissionCategory = (category: TPermissionCategory) => {
  permissionCategories[category.name] = category;
};

const registerDefaultPermission = (permission: TPermission | TCustomPermission) => {
  permissions[permission.name] = Object.assign({ source: 'cms' }, permission);
};

export const getPermissions = (): TPermission[] =>
  Object.values(permissions).map((permission: TPermission) => {
    if (permission.categoryName) {
      const category = permissionCategories[permission.categoryName];
      if (category) {
        permission.categoryName = category.name;
        permission.categoryDescription = category.description;
        permission.categoryTitle = category.title;
        permission.moduleName = category.moduleName;
        permission.moduleTitle = category.moduleTitle;
      }
    }
    return permission;
  });

const cmsPermissionCategories: Record<string, TPermissionCategory> = {
  plugin_category: {
    name: 'plugin_category',
    title: 'Plugins',
    description: 'Manage plugins',
  },
  theme_category: {
    name: 'theme_category',
    title: 'Themes',
    description: 'Manage themes',
  },
  post_category: {
    name: 'post_category',
    title: 'Blog - Posts',
    description: 'Manage posts',
  },
  tag_category: {
    name: 'tag_category',
    title: 'Blog - Tags',
    description: 'Manage tags',
  },
  comment_category: {
    name: 'comment_category',
    title: 'Blog - Comments',
    description: 'Manage comments',
  },
  product_category: {
    name: 'product_category',
    title: 'Shop - Products',
    description: 'Manage products',
  },
  product_category_category: {
    name: 'product_category_category',
    title: 'Shop - Products categories',
    description: 'Manage products categories',
  },
  attribute_category: {
    name: 'attribute_category',
    title: 'Shop - Attributes',
    description: 'Manage attributes',
  },
  order_category: {
    name: 'order_category',
    title: 'Shop - Orders',
    description: 'Manage orders',
  },
  product_reviews_category: {
    name: 'product_reviews_category',
    title: 'Shop - Reviews',
    description: 'Manage product reviews',
  },
  coupons_category: {
    name: 'coupons_category',
    title: 'Shop - Coupons',
    description: 'Manage Coupons',
  },
  users_category: {
    name: 'users_category',
    title: 'Users',
    description: 'Manage users',
  },
  roles_category: {
    name: 'roles_category',
    title: 'Roles',
    description: 'Manage roles',
  },
  custom_entity_category: {
    name: 'custom_entity_category',
    title: 'Custom entities',
    description: 'Manage all custom entities',
  },
  system_category: {
    name: 'system_category',
    title: 'System',
    description: 'General system permissions',
  },
};

Object.values(cmsPermissionCategories).forEach(registerPermissionCategory);

const cmsPermissions: Record<TPermissionName, TPermission> = {
  all: {
    name: 'all',
    title: 'Administrator',
    description: 'Unrestricted access to manage CMS',
  },
  // Plugin
  read_plugins: {
    name: 'read_plugins',
    title: 'See all available plugins',
    description: '',
    categoryName: 'plugin_category',
  },
  install_plugin: {
    name: 'install_plugin',
    title: 'Install plugins from the market',
    description: '',
    categoryName: 'plugin_category',
  },
  update_plugin: {
    name: 'update_plugin',
    title: 'Update plugins to a newer version',
    description: '',
    categoryName: 'plugin_category',
  },
  uninstall_plugin: {
    name: 'uninstall_plugin',
    title: 'Uninstall plugins',
    description: '',
    categoryName: 'plugin_category',
  },
  activate_plugin: {
    name: 'activate_plugin',
    title: 'Enable / disable plugins',
    description: '',
    categoryName: 'plugin_category',
  },
  read_plugin_settings: {
    name: 'read_plugin_settings',
    title: 'See settings of any plugin',
    description: '',
    categoryName: 'plugin_category',
  },
  update_plugin_settings: {
    name: 'update_plugin_settings',
    title: 'Modify settings of any plugin',
    description: '',
    categoryName: 'plugin_category',
  },

  // Theme
  read_themes: {
    name: 'read_themes',
    title: 'See all available themes',
    description: '',
    categoryName: 'theme_category',
  },
  install_theme: {
    name: 'install_theme',
    title: 'Install themes from the market',
    description: '',
    categoryName: 'theme_category',
  },
  update_theme: {
    name: 'update_theme',
    title: 'Update themes to a newer version',
    categoryName: 'theme_category',
    description: '',
  },
  uninstall_theme: {
    name: 'uninstall_theme',
    title: 'Uninstall themes',
    description: '',
    categoryName: 'theme_category',
  },
  change_theme: {
    name: 'change_theme',
    title: 'Change active theme',
    description: '',
    categoryName: 'theme_category',
  },
  activate_theme: {
    name: 'activate_theme',
    title: 'Enable / disable theme',
    description: '',
    categoryName: 'theme_category',
  },
  read_theme_settings: {
    name: 'read_theme_settings',
    title: 'See theme in Theme editor',
    description: '',
    categoryName: 'theme_category',
  },
  update_theme_settings: {
    name: 'update_theme_settings',
    title: 'Change theme in Theme editor',
    description: '',
    categoryName: 'theme_category',
  },

  // Post
  read_posts: {
    name: 'read_posts',
    title: 'See public posts',
    description: '',
    categoryName: 'post_category',
  },
  read_post_drafts: {
    name: 'read_post_drafts',
    title: 'See unpublished posts (drafts)',
    description: '',
    categoryName: 'post_category',
  },
  create_post: {
    name: 'create_post',
    title: 'Create or publish new post',
    description: '',
    categoryName: 'post_category',
  },
  update_post: {
    name: 'update_post',
    title: 'Edit any post',
    description: '',
    categoryName: 'post_category',
  },
  delete_post: {
    name: 'delete_post',
    title: 'Delete any post',
    description: '',
    categoryName: 'post_category',
  },

  // Tag
  read_tags: {
    name: 'read_tags',
    title: 'See all available tags',
    description: '',
    categoryName: 'tag_category',
  },
  create_tag: {
    name: 'create_tag',
    title: 'Create new tag',
    description: '',
    categoryName: 'tag_category',
  },
  update_tag: {
    name: 'update_tag',
    title: 'Edit any tag',
    description: '',
    categoryName: 'tag_category',
  },
  delete_tag: {
    name: 'delete_tag',
    title: 'Delete any tag',
    description: '',
    categoryName: 'tag_category',
  },

  // Comments
  read_post_comments: {
    name: 'read_post_comments',
    title: 'See all available comments',
    description: '',
    categoryName: 'comment_category',
  },
  create_post_comment: {
    name: 'create_post_comment',
    title: 'Create new comment',
    description: '',
    categoryName: 'comment_category',
  },
  update_post_comment: {
    name: 'update_post_comment',
    title: 'Edit any comment',
    description: '',
    categoryName: 'comment_category',
  },
  delete_post_comment: {
    name: 'delete_post_comment',
    title: 'Delete any comment',
    description: '',
    categoryName: 'comment_category',
  },

  // Products
  read_products: {
    name: 'read_products',
    title: 'See all available products',
    description: '',
    categoryName: 'product_category',
  },
  create_product: {
    name: 'create_product',
    title: 'Create new product',
    description: '',
    categoryName: 'product_category',
  },
  update_product: {
    name: 'update_product',
    title: 'Edit any product',
    description: '',
    categoryName: 'product_category',
  },
  delete_product: {
    name: 'delete_product',
    title: 'Delete any product',
    description: '',
    categoryName: 'product_category',
  },

  // Products category
  read_product_categories: {
    name: 'read_product_categories',
    title: 'See all available product categories',
    description: '',
    categoryName: 'product_category_category',
  },
  create_product_category: {
    name: 'create_product_category',
    title: 'Create new product category',
    description: '',
    categoryName: 'product_category_category',
  },
  update_product_category: {
    name: 'update_product_category',
    title: 'Edit any product category',
    description: '',
    categoryName: 'product_category_category',
  },
  delete_product_category: {
    name: 'delete_product_category',
    title: 'Delete any product category',
    description: '',
    categoryName: 'product_category_category',
  },

  // Attribute
  read_attributes: {
    name: 'read_attributes',
    title: 'See all available attributes',
    description: '',
    categoryName: 'attribute_category',
  },
  create_attribute: {
    name: 'create_attribute',
    title: 'Create new attribute',
    description: '',
    categoryName: 'attribute_category',
  },
  update_attribute: {
    name: 'update_attribute',
    title: 'Edit any attribute',
    description: '',
    categoryName: 'attribute_category',
  },
  delete_attribute: {
    name: 'delete_attribute',
    title: 'Delete any attribute',
    description: '',
    categoryName: 'attribute_category',
  },

  // Orders
  read_orders: {
    name: 'read_orders',
    title: 'See all available orders',
    description: '',
    categoryName: 'order_category',
  },
  read_my_orders: {
    name: 'read_my_orders',
    title: 'See only orders of this user',
    description: '',
    categoryName: 'order_category',
  },
  create_order: {
    name: 'create_order',
    title: 'Create new order',
    description: '',
    categoryName: 'order_category',
  },
  update_order: {
    name: 'update_order',
    title: 'Edit any order',
    description: '',
    categoryName: 'order_category',
  },
  delete_order: {
    name: 'delete_order',
    title: 'Delete any order',
    description: '',
    categoryName: 'order_category',
  },

  // Product reviews
  read_product_reviews: {
    name: 'read_product_reviews',
    title: 'See all available product reviews',
    description: '',
    categoryName: 'product_reviews_category',
  },
  create_product_review: {
    name: 'create_product_review',
    title: 'Create new product review',
    description: '',
    categoryName: 'product_reviews_category',
  },
  update_product_review: {
    name: 'update_product_review',
    title: 'Edit any product review',
    description: '',
    categoryName: 'product_reviews_category',
  },
  delete_product_review: {
    name: 'delete_product_review',
    title: 'Delete any product review',
    description: '',
    categoryName: 'product_reviews_category',
  },

  // Coupons
  read_coupons: {
    name: 'read_coupons',
    title: 'See all available coupons',
    description: '',
    categoryName: 'coupons_category',
  },
  create_coupon: {
    name: 'create_coupon',
    title: 'Create new coupon',
    description: '',
    categoryName: 'coupons_category',
  },
  update_coupon: {
    name: 'update_coupon',
    title: 'Edit any coupon',
    description: '',
    categoryName: 'coupons_category',
  },
  delete_coupon: {
    name: 'delete_coupon',
    title: 'Delete any coupon',
    description: '',
    categoryName: 'coupons_category',
  },

  // Users
  read_users: {
    name: 'read_users',
    title: 'See all available users',
    description: '',
    categoryName: 'users_category',
  },
  read_my_user: {
    name: 'read_my_user',
    title: 'See only info of this user',
    description: '',
    categoryName: 'users_category',
  },
  create_user: {
    name: 'create_user',
    title: 'Create new user',
    description: '',
    categoryName: 'users_category',
  },
  update_user: {
    name: 'update_user',
    title: 'Edit any user',
    description: '',
    categoryName: 'users_category',
  },
  update_my_user: {
    name: 'update_my_user',
    title: 'Edit user info only of this user',
    description: '',
    categoryName: 'users_category',
  },
  delete_user: {
    name: 'delete_user',
    title: 'Delete any user',
    description: '',
    categoryName: 'users_category',
  },

  // Roles
  read_roles: {
    name: 'read_roles',
    title: 'See all available roles',
    description: '',
    categoryName: 'roles_category',
  },
  create_role: {
    name: 'create_role',
    title: 'Create new role',
    description: '',
    categoryName: 'roles_category',
  },
  update_role: {
    name: 'update_role',
    title: 'Edit any role',
    description: '',
    categoryName: 'roles_category',
  },
  delete_role: {
    name: 'delete_role',
    title: 'Delete any role',
    description: '',
    categoryName: 'roles_category',
  },
  read_permissions: {
    name: 'read_permissions',
    title: 'See all available permissions',
    description: '',
    categoryName: 'roles_category',
  },

  // Custom entities
  read_custom_entities: {
    name: 'read_custom_entities',
    title: 'See all available custom entities',
    description: '',
    categoryName: 'custom_entity_category',
  },
  create_custom_entity: {
    name: 'create_custom_entity',
    title: 'Create new custom entity',
    description: '',
    categoryName: 'custom_entity_category',
  },
  update_custom_entity: {
    name: 'update_custom_entity',
    title: 'Edit any custom entity',
    description: '',
    categoryName: 'custom_entity_category',
  },
  delete_custom_entity: {
    name: 'delete_custom_entity',
    title: 'Delete any custom entity',
    description: '',
    categoryName: 'custom_entity_category',
  },

  // System
  read_cms_settings: {
    name: 'read_cms_settings',
    title: 'See CMS admin settings',
    description: '',
    categoryName: 'system_category',
  },
  update_cms_settings: {
    name: 'update_cms_settings',
    title: 'Edit CMS settings',
    description: '',
    categoryName: 'system_category',
  },
  update_cms: {
    name: 'update_cms',
    title: 'Launch CMS update to a newer version',
    description: '',
    categoryName: 'system_category',
  },
  export_db: {
    name: 'export_db',
    title: 'Export data into backup file',
    description: '',
    categoryName: 'system_category',
  },
  import_db: {
    name: 'import_db',
    title: 'Import data from backup file',
    description: '',
    categoryName: 'system_category',
  },
  read_public_directories: {
    name: 'read_public_directories',
    title: 'See files/folders in the file manager (media)',
    description: '',
    categoryName: 'system_category',
  },
  create_public_directory: {
    name: 'create_public_directory',
    title: 'Create new folder in the file manager (media)',
    description: '',
    categoryName: 'system_category',
  },
  remove_public_directory: {
    name: 'remove_public_directory',
    title: 'Delete any folder in the file manager (media)',
    description: '',
    categoryName: 'system_category',
  },
  upload_file: {
    name: 'upload_file',
    title: 'Upload new file in the file manager (media)',
    description: '',
    categoryName: 'system_category',
  },
  download_file: {
    name: 'download_file',
    title: 'Download any file/folder(zip) in the file manager (media)',
    description: '',
    categoryName: 'system_category',
  },
  delete_file: {
    name: 'delete_file',
    title: 'Delete any file in the file manager (media)',
    description: '',
    categoryName: 'system_category',
  },
  read_cms_statistics: {
    name: 'read_cms_statistics',
    title: 'See CMS statistics (dashboard page)',
    description: '',
    categoryName: 'system_category',
  },
  read_cms_status: {
    name: 'read_cms_status',
    title: 'Get CMS updates and notifications',
    description: '',
    categoryName: 'system_category',
  },
  read_system_info: {
    name: 'read_system_info',
    title: 'See system info of web server',
    description: '',
    categoryName: 'system_category',
  },
  generate_thumbnail: {
    name: 'generate_thumbnail',
    title: 'Generate thumbnail for any image',
    description: '',
    categoryName: 'system_category',
  },
};

Object.values(cmsPermissions).forEach(registerDefaultPermission);
