const { UserRepository, RoleRepository } = require('@cromwell/core-backend');
const { getCustomRepository } = require('typeorm');

let rawUsers;

const migrationStart = async (queryRunner) => {
  rawUsers = await queryRunner.query(`SELECT * FROM crw_user`);
};

const migrationEnd = async (queryRunner) => {
  await mockRoles();

  const roles = await getCustomRepository(RoleRepository).getAll();
  const users = await getCustomRepository(UserRepository).getAll();

  for (const user of users) {
    const raw = rawUsers.find((u) => user.id === u.id);
    const userRole = roles.find((r) => r.name === raw.role);
    if (userRole) {
      user.roles = [userRole];
      await user.save();
    }
  }
};

const mockRoles = async () => {
  const authorPermissions = [
    'read_my_user',
    'read_posts',
    'read_post_drafts',
    'create_post',
    'update_post',
    'delete_post',
    'read_tags',
    'create_tag',
    'update_tag',
    'delete_tag',
    'read_users',
    'read_roles',
    'read_post_comments',
    'create_post_comment',
    'update_post_comment',
    'delete_post_comment',
    'read_public_directories',
    'create_public_directory',
    'remove_public_directory',
    'upload_file',
    'download_file',
    'delete_file',
  ];

  const guestPermissions = [
    'read_my_user',
    'read_plugins',
    'read_themes',
    'read_posts',
    'read_post_drafts',
    'read_tags',
    'read_post_comments',
    'read_products',
    'read_product_categories',
    'read_attributes',
    'read_orders',
    'read_product_reviews',
    'read_users',
    'read_roles',
    'read_custom_entities',
    'read_coupons',
    'read_cms_settings',
    'read_my_orders',
    'read_public_directories',
    'download_file',
    'read_system_info',
    'read_cms_statistics',
    'read_cms_status',
  ];
  guestPermissions.push('newsletter_stats');
  guestPermissions.push('newsletter_export');

  const mockRoles = [
    {
      name: 'administrator',
      title: 'Administrator',
      permissions: ['all'],
    },
    {
      name: 'author',
      title: 'Author',
      permissions: authorPermissions,
    },
    {
      name: 'customer',
      title: 'Customer',
      permissions: ['update_my_user', 'read_my_orders'],
    },
    {
      name: 'guest',
      title: 'Guest',
      permissions: guestPermissions,
    },
  ];

  for (const role of mockRoles) {
    try {
      const dbRole = await getCustomRepository(RoleRepository)
        .getRoleByName(role.name)
        .catch(() => null);
      if (!dbRole) await getCustomRepository(RoleRepository).createRole(role);
    } catch (error) {
      console.error(error);
    }
  }
};

module.exports.migrationStart = migrationStart;
module.exports.migrationEnd = migrationEnd;
module.exports.mockRoles = mockRoles;
