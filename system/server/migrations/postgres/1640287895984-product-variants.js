const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class productVariants1640287895984 {
  name = 'productVariants1640287895984';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "crw_product_variant_meta" ("id" SERIAL NOT NULL, "key" character varying(255), "value" text, "shortValue" character varying(255), "entityId" integer NOT NULL, CONSTRAINT "PK_f406ff1aac1e9765e057afd4294" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_043b6fccace5ccd18abcd0472d" ON "crw_product_variant_meta" ("key") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_5d353c6757ba25557fcaa97b16" ON "crw_product_variant_meta" ("shortValue") `,
    );
    await queryRunner.query(
      `CREATE TABLE "crw_product_variant" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "productId" integer NOT NULL, "name" character varying(255), "price" double precision, "oldPrice" double precision, "sku" character varying(255), "mainImage" character varying(400), "images" text, "stockAmount" integer, "stockStatus" character varying(255), "manageStock" boolean, "description" text, "descriptionDelta" text, "attributesJson" text, CONSTRAINT "UQ_c7c9273af9577aa30bb613bfe53" UNIQUE ("slug"), CONSTRAINT "PK_7da658e5811fce75c2379130bae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_4f0d03313fc011fd0cdf8db5a8" ON "crw_product_variant" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_57a78fa5ef24fa0ea0fa33a74e" ON "crw_product_variant" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_d56c009fabddf3cf7a7b54210b" ON "crw_product_variant" ("name") `);
    await queryRunner.query(`CREATE INDEX "IDX_36939bbe847d64f4b78f3b5234" ON "crw_product_variant" ("price") `);
    await queryRunner.query(`CREATE INDEX "IDX_4676dd0b234c31f55656eb82b5" ON "crw_product_variant" ("oldPrice") `);
    await queryRunner.query(`CREATE INDEX "IDX_9ae265ee4eb7735d7f0f2eb84d" ON "crw_product_variant" ("sku") `);
    await queryRunner.query(`CREATE INDEX "IDX_421fcfb5bf7bf531646dcd52ab" ON "crw_product_variant" ("stockAmount") `);
    await queryRunner.query(`CREATE INDEX "IDX_e34d9eb5816f615f44218fe5c2" ON "crw_product_variant" ("stockStatus") `);
    try {
      await queryRunner.query(`ALTER TABLE "crw_product" ADD "manageStock" boolean`);
    } catch (error) {
      console.error(error);
    }
    await queryRunner.query(
      `ALTER TABLE "crw_product_variant_meta" ADD CONSTRAINT "FK_f2833cc1e1bb9516471b126327e" FOREIGN KEY ("entityId") REFERENCES "crw_product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_product_variant" ADD CONSTRAINT "FK_a787a73dfa5575dafeaab729bb5" FOREIGN KEY ("productId") REFERENCES "crw_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "crw_product_variant" DROP CONSTRAINT "FK_a787a73dfa5575dafeaab729bb5"`);
    await queryRunner.query(`ALTER TABLE "crw_product_variant_meta" DROP CONSTRAINT "FK_f2833cc1e1bb9516471b126327e"`);
    await queryRunner.query(`ALTER TABLE "crw_product" DROP COLUMN "manageStock"`);
    await queryRunner.query(`DROP INDEX "IDX_e34d9eb5816f615f44218fe5c2"`);
    await queryRunner.query(`DROP INDEX "IDX_421fcfb5bf7bf531646dcd52ab"`);
    await queryRunner.query(`DROP INDEX "IDX_9ae265ee4eb7735d7f0f2eb84d"`);
    await queryRunner.query(`DROP INDEX "IDX_4676dd0b234c31f55656eb82b5"`);
    await queryRunner.query(`DROP INDEX "IDX_36939bbe847d64f4b78f3b5234"`);
    await queryRunner.query(`DROP INDEX "IDX_d56c009fabddf3cf7a7b54210b"`);
    await queryRunner.query(`DROP INDEX "IDX_57a78fa5ef24fa0ea0fa33a74e"`);
    await queryRunner.query(`DROP INDEX "IDX_4f0d03313fc011fd0cdf8db5a8"`);
    await queryRunner.query(`DROP TABLE "crw_product_variant"`);
    await queryRunner.query(`DROP INDEX "IDX_5d353c6757ba25557fcaa97b16"`);
    await queryRunner.query(`DROP INDEX "IDX_043b6fccace5ccd18abcd0472d"`);
    await queryRunner.query(`DROP TABLE "crw_product_variant_meta"`);
  }
};
