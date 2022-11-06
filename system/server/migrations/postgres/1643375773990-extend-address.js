const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class extendAddress1643375773990 {
  name = 'extendAddress1643375773990';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "crw_order" alter column "customerAddress" type character varying(6000)`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "crw_order" alter column "customerAddress" type character varying(255)`);
  }
};
