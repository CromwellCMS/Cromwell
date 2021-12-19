const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class productVariants1639935794027 {
    name = 'productVariants1639935794027'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_product\` ADD \`manageStock\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_product\` ADD \`variantsJson\` text NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_product\` DROP COLUMN \`variantsJson\``);
        await queryRunner.query(`ALTER TABLE \`cromwell\`.\`crw_product\` DROP COLUMN \`manageStock\``);
    }
}
