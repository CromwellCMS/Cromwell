const { MigrationInterface, QueryRunner } = require('typeorm');
const { migrationEnd, migrationStart } = require('../common/1651054396603-permissions');

module.exports = class permissions1651054391643 {
  name = 'permissions1651054391643';

  async up(queryRunner) {
    await migrationStart(queryRunner);

    await queryRunner.query(`DROP INDEX \`IDX_850a536df6641e90872f905e74\` ON \`crw_user\``);
    await queryRunner.query(`ALTER TABLE \`crw_user\` DROP COLUMN \`role\``);
    await queryRunner.query(
      `CREATE TABLE \`crw_role_meta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NULL, \`value\` text NULL, \`shortValue\` varchar(255) NULL, \`entityId\` int NOT NULL, INDEX \`IDX_8c0ffbe1960336ef92791b77b6\` (\`key\`), FULLTEXT INDEX \`IDX_11664fa069e1099e0f7617841f\` (\`shortValue\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`name\` varchar(255) NULL, \`title\` varchar(255) NULL, \`icon\` varchar(255) NULL, \`permissions\` text NULL, INDEX \`IDX_02849456a7d4070ecb57daf578\` (\`createDate\`), INDEX \`IDX_a92a25008c1fa01a71e3ff07ba\` (\`updateDate\`), UNIQUE INDEX \`IDX_87aa9675ec190f3eb2f29fe2ad\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_user_roles_role\` (\`userId\` int NOT NULL, \`roleId\` int NOT NULL, INDEX \`IDX_86e2ad2823a8f16cffae290465\` (\`userId\`), INDEX \`IDX_f5f27a36e32615ebf1e9a6ab82\` (\`roleId\`), PRIMARY KEY (\`userId\`, \`roleId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_role_meta\` ADD CONSTRAINT \`FK_ebe8676ea6dcf9a29c85579112a\` FOREIGN KEY (\`entityId\`) REFERENCES \`crw_role\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_user_roles_role\` ADD CONSTRAINT \`FK_86e2ad2823a8f16cffae290465b\` FOREIGN KEY (\`userId\`) REFERENCES \`crw_user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_user_roles_role\` ADD CONSTRAINT \`FK_f5f27a36e32615ebf1e9a6ab821\` FOREIGN KEY (\`roleId\`) REFERENCES \`crw_role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await migrationEnd(queryRunner);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE \`crw_user_roles_role\` DROP FOREIGN KEY \`FK_f5f27a36e32615ebf1e9a6ab821\``);
    await queryRunner.query(`ALTER TABLE \`crw_user_roles_role\` DROP FOREIGN KEY \`FK_86e2ad2823a8f16cffae290465b\``);
    await queryRunner.query(`ALTER TABLE \`crw_role_meta\` DROP FOREIGN KEY \`FK_ebe8676ea6dcf9a29c85579112a\``);
    await queryRunner.query(`ALTER TABLE \`crw_user\` ADD \`role\` varchar(50) NULL`);
    await queryRunner.query(`DROP INDEX \`IDX_f5f27a36e32615ebf1e9a6ab82\` ON \`crw_user_roles_role\``);
    await queryRunner.query(`DROP INDEX \`IDX_86e2ad2823a8f16cffae290465\` ON \`crw_user_roles_role\``);
    await queryRunner.query(`DROP TABLE \`crw_user_roles_role\``);
    await queryRunner.query(`DROP INDEX \`IDX_87aa9675ec190f3eb2f29fe2ad\` ON \`crw_role\``);
    await queryRunner.query(`DROP INDEX \`IDX_a92a25008c1fa01a71e3ff07ba\` ON \`crw_role\``);
    await queryRunner.query(`DROP INDEX \`IDX_02849456a7d4070ecb57daf578\` ON \`crw_role\``);
    await queryRunner.query(`DROP TABLE \`crw_role\``);
    await queryRunner.query(`DROP INDEX \`IDX_11664fa069e1099e0f7617841f\` ON \`crw_role_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_8c0ffbe1960336ef92791b77b6\` ON \`crw_role_meta\``);
    await queryRunner.query(`DROP TABLE \`crw_role_meta\``);
    await queryRunner.query(`CREATE INDEX \`IDX_850a536df6641e90872f905e74\` ON \`crw_user\` (\`role\`)`);
  }
};
