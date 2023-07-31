const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class coupons1638975061796 {
  name = 'coupons1638975061796';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "crw_coupon_meta" ("id" SERIAL NOT NULL, "key" character varying(255), "value" text, "shortValue" character varying(255), "entityId" integer NOT NULL, CONSTRAINT "PK_85cc2fdfd2d37b867fcebece6e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_ce0ab3c7587baeea578774af63" ON "crw_coupon_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_0a9f48c68638eb11163c845f39" ON "crw_coupon_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_coupon" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "discountType" character varying(255) NOT NULL, "value" double precision, "code" character varying(255) NOT NULL, "description" character varying(3000), "allowFreeShipping" boolean, "minimumSpend" double precision, "maximumSpend" double precision, "categoryIds" text, "productIds" text, "expiryDate" TIMESTAMP, "usageLimit" integer, "usedTimes" integer, CONSTRAINT "UQ_a42d0cda340107e201bb3145f94" UNIQUE ("slug"), CONSTRAINT "PK_1353a0953afeb2f334ebf61b560" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_1319981d75d460ab975b4fae1e" ON "crw_coupon" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_b6fc6f1f4278fe1a1514d4dd65" ON "crw_coupon" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_ba32138329c7114a4ebe5e46c8" ON "crw_coupon" ("discountType") `);
    await queryRunner.query(
      `CREATE TABLE "crw_order_coupons_coupon" ("orderId" integer NOT NULL, "couponId" integer NOT NULL, CONSTRAINT "PK_6dacd4268a5b0d38b0451ba3a4d" PRIMARY KEY ("orderId", "couponId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_59198cce77c3b44f2e9ac47008" ON "crw_order_coupons_coupon" ("orderId") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_22d6089b34dabf8e84ecdd3cd9" ON "crw_order_coupons_coupon" ("couponId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_coupon_meta" ADD CONSTRAINT "FK_ae33d7acbc699d8192c2eea22cf" FOREIGN KEY ("entityId") REFERENCES "crw_coupon"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_order_coupons_coupon" ADD CONSTRAINT "FK_59198cce77c3b44f2e9ac470082" FOREIGN KEY ("orderId") REFERENCES "crw_order"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_order_coupons_coupon" ADD CONSTRAINT "FK_22d6089b34dabf8e84ecdd3cd96" FOREIGN KEY ("couponId") REFERENCES "crw_coupon"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "crw_order_coupons_coupon" DROP CONSTRAINT "FK_22d6089b34dabf8e84ecdd3cd96"`);
    await queryRunner.query(`ALTER TABLE "crw_order_coupons_coupon" DROP CONSTRAINT "FK_59198cce77c3b44f2e9ac470082"`);
    await queryRunner.query(`ALTER TABLE "crw_coupon_meta" DROP CONSTRAINT "FK_ae33d7acbc699d8192c2eea22cf"`);
    await queryRunner.query(`DROP INDEX "IDX_22d6089b34dabf8e84ecdd3cd9"`);
    await queryRunner.query(`DROP INDEX "IDX_59198cce77c3b44f2e9ac47008"`);
    await queryRunner.query(`DROP TABLE "crw_order_coupons_coupon"`);
    await queryRunner.query(`DROP INDEX "IDX_ba32138329c7114a4ebe5e46c8"`);
    await queryRunner.query(`DROP INDEX "IDX_b6fc6f1f4278fe1a1514d4dd65"`);
    await queryRunner.query(`DROP INDEX "IDX_1319981d75d460ab975b4fae1e"`);
    await queryRunner.query(`DROP TABLE "crw_coupon"`);
    await queryRunner.query(`DROP INDEX "IDX_0a9f48c68638eb11163c845f39"`);
    await queryRunner.query(`DROP INDEX "IDX_ce0ab3c7587baeea578774af63"`);
    await queryRunner.query(`DROP TABLE "crw_coupon_meta"`);
  }
};
