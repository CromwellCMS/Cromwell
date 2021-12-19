const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class productVariants1639935800117 {
    name = 'productVariants1639935800117'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."crw_product" ADD "manageStock" boolean`);
        await queryRunner.query(`ALTER TABLE "public"."crw_product" ADD "variantsJson" text`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."crw_product" DROP COLUMN "variantsJson"`);
        await queryRunner.query(`ALTER TABLE "public"."crw_product" DROP COLUMN "manageStock"`);
    }
}
