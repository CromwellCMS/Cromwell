const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class extendAddress1643375768211 {
  name = 'extendAddress1643375768211';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE \`crw_order\` MODIFY \`customerAddress\` varchar(6000) NULL`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE \`crw_order\` MODIFY \`customerAddress\` varchar(255) NULL`);
  }
};
