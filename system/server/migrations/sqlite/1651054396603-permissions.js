const { MigrationInterface, QueryRunner } = require("typeorm");
const { migrationEnd, migrationStart } = require('../common/1651054396603-permissions');

module.exports = class permissions1651054396603 {
    name = 'permissions1651054396603'

    async up(queryRunner) {
        await migrationStart(queryRunner);

        await queryRunner.query(`CREATE TABLE "crw_role_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_8c0ffbe1960336ef92791b77b6" ON "crw_role_meta" ("key") `);
        await queryRunner.query(`CREATE INDEX "IDX_11664fa069e1099e0f7617841f" ON "crw_role_meta" ("shortValue") `);
        await queryRunner.query(`CREATE TABLE "crw_role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "name" varchar(255), "title" varchar(255), "icon" varchar(255), "permissions" text, CONSTRAINT "UQ_87aa9675ec190f3eb2f29fe2ad9" UNIQUE ("slug"))`);
        await queryRunner.query(`CREATE INDEX "IDX_02849456a7d4070ecb57daf578" ON "crw_role" ("createDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_a92a25008c1fa01a71e3ff07ba" ON "crw_role" ("updateDate") `);
        await queryRunner.query(`CREATE TABLE "crw_user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_86e2ad2823a8f16cffae290465" ON "crw_user_roles_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f5f27a36e32615ebf1e9a6ab82" ON "crw_user_roles_role" ("roleId") `);

        await migrationEnd(queryRunner);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_8c0ffbe1960336ef92791b77b6"`);
        await queryRunner.query(`DROP INDEX "IDX_11664fa069e1099e0f7617841f"`);
        await queryRunner.query(`DROP INDEX "IDX_02849456a7d4070ecb57daf578"`);
        await queryRunner.query(`DROP INDEX "IDX_a92a25008c1fa01a71e3ff07ba"`);
        await queryRunner.query(`DROP INDEX "IDX_86e2ad2823a8f16cffae290465"`);
        await queryRunner.query(`DROP INDEX "IDX_f5f27a36e32615ebf1e9a6ab82"`);
        await queryRunner.query(`DROP TABLE "crw_role_meta"`);
        await queryRunner.query(`DROP TABLE "crw_role"`);
        await queryRunner.query(`DROP TABLE "crw_user_roles_role"`);
    }
}
