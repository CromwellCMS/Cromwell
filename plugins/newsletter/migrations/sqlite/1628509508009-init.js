const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class init1628509508009 {
  name = 'init1628509508009';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "crw_PluginNewsletter_NewsletterForm" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL)`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "crw_PluginNewsletter_NewsletterForm"`);
  }
};
