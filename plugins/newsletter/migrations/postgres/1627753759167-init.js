const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class init1627753759167 {
    name = 'init1627753759167'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "crw_plugin_newsletter__newsletter_form" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_3637b82e44969c076a081d88ed7" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "crw_plugin_newsletter__newsletter_form"`);
    }
}
