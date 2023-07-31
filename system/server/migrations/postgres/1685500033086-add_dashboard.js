const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class addDashboard1685500033086 {
  name = 'addDashboard1685500033086';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "crw_dashboard" ("id" SERIAL NOT NULL, "type" character varying(255) DEFAULT 'template', "for" character varying(255) DEFAULT 'system', "userId" integer, "_layout" text, CONSTRAINT "REL_1082b89fd0d75b4603f3aa7505" UNIQUE ("userId"), CONSTRAINT "PK_4513e00ff04a2f8494af941bf79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_4513e00ff04a2f8494af941bf7" ON "crw_dashboard" ("id") `);
    await queryRunner.query(`CREATE INDEX "IDX_1082b89fd0d75b4603f3aa7505" ON "crw_dashboard" ("userId") `);
    await queryRunner.query(
      `ALTER TABLE "public"."crw_product" ADD CONSTRAINT "FK_c07a670f3308a2db7824d76d6ac" FOREIGN KEY ("mainCategoryId") REFERENCES "crw_product_category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_dashboard" ADD CONSTRAINT "FK_1082b89fd0d75b4603f3aa75050" FOREIGN KEY ("userId") REFERENCES "crw_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "crw_dashboard" DROP CONSTRAINT "FK_1082b89fd0d75b4603f3aa75050"`);
    await queryRunner.query(`ALTER TABLE "public"."crw_product" DROP CONSTRAINT "FK_c07a670f3308a2db7824d76d6ac"`);
    await queryRunner.query(`DROP INDEX "IDX_1082b89fd0d75b4603f3aa7505"`);
    await queryRunner.query(`DROP INDEX "IDX_4513e00ff04a2f8494af941bf7"`);
    await queryRunner.query(`DROP TABLE "crw_dashboard"`);
  }
};
