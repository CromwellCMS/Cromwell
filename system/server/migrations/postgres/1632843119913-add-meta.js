const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class addMeta1632843119913 {
    name = 'addMeta1632843119913'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."crw_cms" DROP CONSTRAINT "UQ_45a249e9f534b6af909ffedf0d2"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_cms" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_cms" DROP COLUMN "pageTitle"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_cms" DROP COLUMN "pageDescription"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_cms" DROP COLUMN "isEnabled"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_order" DROP CONSTRAINT "UQ_7a2428bdc18f7abd37585706687"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_order" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_order" DROP COLUMN "pageTitle"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_order" DROP COLUMN "pageDescription"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_order" DROP COLUMN "isEnabled"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_base_page_entity" ADD "_meta" character varying(5000)`);
        await queryRunner.query(`ALTER TABLE "public"."crw_attribute" ADD "_meta" character varying(5000)`);
        await queryRunner.query(`ALTER TABLE "public"."crw_plugin" ADD "_meta" character varying(5000)`);
        await queryRunner.query(`ALTER TABLE "public"."crw_tag" ADD "_meta" character varying(5000)`);
        await queryRunner.query(`ALTER TABLE "public"."crw_post" ADD "_meta" character varying(5000)`);
        await queryRunner.query(`ALTER TABLE "public"."crw_post_comment" ADD "_meta" character varying(5000)`);
        await queryRunner.query(`ALTER TABLE "public"."crw_product_review" ADD "_meta" character varying(5000)`);
        await queryRunner.query(`ALTER TABLE "public"."crw_product" ADD "_meta" character varying(5000)`);
        await queryRunner.query(`ALTER TABLE "public"."crw_product_category" ADD "_meta" character varying(5000)`);
        await queryRunner.query(`ALTER TABLE "public"."crw_theme" ADD "_meta" character varying(5000)`);
        await queryRunner.query(`ALTER TABLE "public"."crw_user" ADD "_meta" character varying(5000)`);
        await queryRunner.query(`ALTER TABLE "public"."crw_user" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_user" ADD "bio" text`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."crw_user" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_user" ADD "bio" character varying(6000)`);
        await queryRunner.query(`ALTER TABLE "public"."crw_user" DROP COLUMN "_meta"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_theme" DROP COLUMN "_meta"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_product_category" DROP COLUMN "_meta"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_product" DROP COLUMN "_meta"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_product_review" DROP COLUMN "_meta"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_post_comment" DROP COLUMN "_meta"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_post" DROP COLUMN "_meta"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_tag" DROP COLUMN "_meta"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_plugin" DROP COLUMN "_meta"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_attribute" DROP COLUMN "_meta"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_base_page_entity" DROP COLUMN "_meta"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_order" ADD "isEnabled" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "public"."crw_order" ADD "pageDescription" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."crw_order" ADD "pageTitle" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."crw_order" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."crw_order" ADD CONSTRAINT "UQ_7a2428bdc18f7abd37585706687" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "public"."crw_cms" ADD "isEnabled" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "public"."crw_cms" ADD "pageDescription" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."crw_cms" ADD "pageTitle" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."crw_cms" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."crw_cms" ADD CONSTRAINT "UQ_45a249e9f534b6af909ffedf0d2" UNIQUE ("slug")`);
    }
}
