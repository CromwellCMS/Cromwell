const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class addMeta1632843115244 {
    name = 'addMeta1632843115244'

    async up(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_45a249e9f534b6af909ffedf0d\` ON \`cromwell\`.\`crw_cms\``);
        await queryRunner.query(`DROP INDEX \`IDX_7a2428bdc18f7abd3758570668\` ON \`cromwell\`.\`crw_order\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_cms\` DROP COLUMN \`slug\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_cms\` DROP COLUMN \`pageTitle\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_cms\` DROP COLUMN \`pageDescription\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_cms\` DROP COLUMN \`isEnabled\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_order\` DROP COLUMN \`slug\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_order\` DROP COLUMN \`pageTitle\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_order\` DROP COLUMN \`pageDescription\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_order\` DROP COLUMN \`isEnabled\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_user\` DROP COLUMN \`bio\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_user\` ADD \`bio\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_user\` ADD \`_meta\` varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_base_page_entity\` ADD \`_meta\` varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_attribute\` ADD \`_meta\` varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_plugin\` ADD \`_meta\` varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_tag\` ADD \`_meta\` varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_post\` ADD \`_meta\` varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_post_comment\` ADD \`_meta\` varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_product_review\` ADD \`_meta\` varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_product\` ADD \`_meta\` varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_product_category\` ADD \`_meta\` varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_theme\` ADD \`_meta\` varchar(5000) NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_user\` DROP COLUMN \`bio\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_user\` ADD \`bio\` varchar(6000) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_user\` DROP COLUMN \`_meta\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_theme\` DROP COLUMN \`_meta\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_product_category\` DROP COLUMN \`_meta\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_product\` DROP COLUMN \`_meta\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_product_review\` DROP COLUMN \`_meta\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_post_comment\` DROP COLUMN \`_meta\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_post\` DROP COLUMN \`_meta\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_tag\` DROP COLUMN \`_meta\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_plugin\` DROP COLUMN \`_meta\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_attribute\` DROP COLUMN \`_meta\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_base_page_entity\` DROP COLUMN \`_meta\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_order\` ADD \`isEnabled\` tinyint NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_order\` ADD \`pageDescription\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_order\` ADD \`pageTitle\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_order\` ADD \`slug\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_cms\` ADD \`isEnabled\` tinyint NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_cms\` ADD \`pageDescription\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_cms\` ADD \`pageTitle\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_cms\` ADD \`slug\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_7a2428bdc18f7abd3758570668\` ON \`cromwell\`.\`crw_order\` (\`slug\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_45a249e9f534b6af909ffedf0d\` ON \`cromwell\`.\`crw_cms\` (\`slug\`)`);
    }
}
