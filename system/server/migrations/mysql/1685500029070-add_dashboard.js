const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class addDashboard1685500029070 {
  name = 'addDashboard1685500029070';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE \`cromwell\`.\`crw_dashboard\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NULL DEFAULT 'template', \`for\` varchar(255) NULL DEFAULT 'system', \`userId\` int NULL, \`_layout\` text NULL, INDEX \`IDX_4513e00ff04a2f8494af941bf7\` (\`id\`), INDEX \`IDX_1082b89fd0d75b4603f3aa7505\` (\`userId\`), UNIQUE INDEX \`REL_1082b89fd0d75b4603f3aa7505\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cromwell\`.\`crw_product\` ADD CONSTRAINT \`FK_c07a670f3308a2db7824d76d6ac\` FOREIGN KEY (\`mainCategoryId\`) REFERENCES \`cromwell\`.\`crw_product_category\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cromwell\`.\`crw_dashboard\` ADD CONSTRAINT \`FK_1082b89fd0d75b4603f3aa75050\` FOREIGN KEY (\`userId\`) REFERENCES \`cromwell\`.\`crw_user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE \`cromwell\`.\`crw_dashboard\` DROP FOREIGN KEY \`FK_1082b89fd0d75b4603f3aa75050\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cromwell\`.\`crw_product\` DROP FOREIGN KEY \`FK_c07a670f3308a2db7824d76d6ac\``,
    );
    await queryRunner.query(`DROP INDEX \`REL_1082b89fd0d75b4603f3aa7505\` ON \`cromwell\`.\`crw_dashboard\``);
    await queryRunner.query(`DROP INDEX \`IDX_1082b89fd0d75b4603f3aa7505\` ON \`cromwell\`.\`crw_dashboard\``);
    await queryRunner.query(`DROP INDEX \`IDX_4513e00ff04a2f8494af941bf7\` ON \`cromwell\`.\`crw_dashboard\``);
    await queryRunner.query(`DROP TABLE \`cromwell\`.\`crw_dashboard\``);
  }
};
