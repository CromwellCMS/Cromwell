const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class init1628509503816 {
    name = 'init1628509503816'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "crw_PluginNewsletter_NewsletterForm" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_3dfc279176cacef8e0a1a3e9508" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "crw_PluginNewsletter_NewsletterForm"`);
    }
}
