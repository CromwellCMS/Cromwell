const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class addMeta1632843124385 {
    name = 'addMeta1632843124385'

    async up(queryRunner) {

        await queryRunner.query(`ALTER TABLE "crw_base_page_entity" ADD COLUMN  "_meta" varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_attribute" ADD COLUMN  "_meta" varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_plugin" ADD COLUMN  "_meta" varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_tag" ADD COLUMN  "_meta" varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_post" ADD COLUMN  "_meta" varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_post_comment" ADD COLUMN  "_meta" varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_product_review" ADD COLUMN  "_meta" varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_product" ADD COLUMN  "_meta" varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_product_category" ADD COLUMN  "_meta" varchar(5000) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_theme" ADD COLUMN  "_meta" varchar(5000) NULL`);

        await queryRunner.query(`CREATE TABLE "temporary_crw_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar, "pageTitle" varchar, "pageDescription" varchar, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "fullName" varchar, "email" varchar, "avatar" varchar, "bio" text, "role" varchar, "address" varchar(1000), "phone" varchar, "password" varchar NOT NULL, "refreshTokens" varchar(5000), "resetPasswordCode" varchar, "resetPasswordDate" datetime, "_meta" varchar(5000), CONSTRAINT "UQ_4544ef20d7756aad6b7a49d8133" UNIQUE ("email"), CONSTRAINT "UQ_86fcd952549ae797ab020043b23" UNIQUE ("slug"))`);
        await queryRunner.query(`INSERT INTO "temporary_crw_user"("id", "slug", "pageTitle", "pageDescription", "createDate", "updateDate", "isEnabled", "fullName", "email", "avatar", "bio", "role", "address", "phone", "password", "refreshTokens", "resetPasswordCode", "resetPasswordDate") SELECT "id", "slug", "pageTitle", "pageDescription", "createDate", "updateDate", "isEnabled", "fullName", "email", "avatar", "bio", "role", "address", "phone", "password", "refreshTokens", "resetPasswordCode", "resetPasswordDate" FROM crw_user`);
        await queryRunner.query(`DROP TABLE "crw_user"`);
        await queryRunner.query(`ALTER TABLE "temporary_crw_user" RENAME TO "crw_user"`);
        await queryRunner.query(`CREATE INDEX "IDX_644eed41dbcadfe2e3e634ba84" ON "crw_user" ("phone") `);
        await queryRunner.query(`CREATE INDEX "IDX_850a536df6641e90872f905e74" ON "crw_user" ("role") `);
        await queryRunner.query(`CREATE INDEX "IDX_0537e4a35e2b1842afc531deab" ON "crw_user" ("fullName") `);
        await queryRunner.query(`CREATE INDEX "IDX_82038b3a02bf4b55377a056d4e" ON "crw_user" ("updateDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_aae8c723ca641247505d92aedc" ON "crw_user" ("createDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_d1e2d7b6f6f40bef308ba789a9" ON "crw_user" ("id") `);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "crw_cms" ADD COLUMN "slug" varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_cms" ADD COLUMN "pageTitle" varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_cms" ADD COLUMN "pageDescription" varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_cms" ADD COLUMN "isEnabled" varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_order" ADD COLUMN "slug" varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_order" ADD COLUMN "pageTitle" varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_order" ADD COLUMN "pageDescription" varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE "crw_order" ADD COLUMN "isEnabled" varchar(255) NULL`);

        await queryRunner.query(`ALTER TABLE "crw_base_page_entity" DROP COLUMN  "_meta"`);
        await queryRunner.query(`ALTER TABLE "crw_attribute" DROP COLUMN  "_meta"`);
        await queryRunner.query(`ALTER TABLE "crw_plugin" DROP COLUMN  "_meta"`);
        await queryRunner.query(`ALTER TABLE "crw_tag" DROP COLUMN  "_meta"`);
        await queryRunner.query(`ALTER TABLE "crw_post" DROP COLUMN  "_meta"`);
        await queryRunner.query(`ALTER TABLE "crw_post_comment" DROP COLUMN  "_meta"`);
        await queryRunner.query(`ALTER TABLE "crw_product_review" DROP COLUMN  "_meta"`);
        await queryRunner.query(`ALTER TABLE "crw_product" DROP COLUMN  "_meta"`);
        await queryRunner.query(`ALTER TABLE "crw_product_category" DROP COLUMN  "_meta"`);
        await queryRunner.query(`ALTER TABLE "crw_theme" DROP COLUMN  "_meta"`);
        await queryRunner.query(`ALTER TABLE "crw_user" DROP COLUMN  "_meta"`);
    }
}
