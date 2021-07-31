const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class init1627753762661 {
    name = 'init1627753762661'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "crw_plugin_newsletter__newsletter_form" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL)`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "crw_plugin_newsletter__newsletter_form"`);
    }
}
