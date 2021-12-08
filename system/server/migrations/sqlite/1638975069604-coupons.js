const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class coupons1638975069604 {
    name = 'coupons1638975069604'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "crw_coupon_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_ce0ab3c7587baeea578774af63" ON "crw_coupon_meta" ("key") `);
        await queryRunner.query(`CREATE INDEX "IDX_0a9f48c68638eb11163c845f39" ON "crw_coupon_meta" ("shortValue") `);
        await queryRunner.query(`CREATE TABLE "crw_coupon" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "discountType" varchar(255) NOT NULL, "value" float, "code" varchar(255) NOT NULL, "description" varchar(3000), "allowFreeShipping" boolean, "minimumSpend" float, "maximumSpend" float, "categoryIds" text, "productIds" text, "expiryDate" datetime, "usageLimit" integer, "usedTimes" integer, CONSTRAINT "UQ_a42d0cda340107e201bb3145f94" UNIQUE ("slug"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1319981d75d460ab975b4fae1e" ON "crw_coupon" ("createDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_b6fc6f1f4278fe1a1514d4dd65" ON "crw_coupon" ("updateDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_ba32138329c7114a4ebe5e46c8" ON "crw_coupon" ("discountType") `);
        await queryRunner.query(`CREATE TABLE "crw_order_coupons_coupon" ("orderId" integer NOT NULL, "couponId" integer NOT NULL, PRIMARY KEY ("orderId", "couponId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_59198cce77c3b44f2e9ac47008" ON "crw_order_coupons_coupon" ("orderId") `);
        await queryRunner.query(`CREATE INDEX "IDX_22d6089b34dabf8e84ecdd3cd9" ON "crw_order_coupons_coupon" ("couponId") `);
        await queryRunner.query(`DROP INDEX "IDX_ce0ab3c7587baeea578774af63"`);
        await queryRunner.query(`DROP INDEX "IDX_0a9f48c68638eb11163c845f39"`);
        await queryRunner.query(`CREATE TABLE "temporary_crw_coupon_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL, CONSTRAINT "FK_ae33d7acbc699d8192c2eea22cf" FOREIGN KEY ("entityId") REFERENCES "crw_coupon" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_crw_coupon_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "crw_coupon_meta"`);
        await queryRunner.query(`DROP TABLE "crw_coupon_meta"`);
        await queryRunner.query(`ALTER TABLE "temporary_crw_coupon_meta" RENAME TO "crw_coupon_meta"`);
        await queryRunner.query(`CREATE INDEX "IDX_ce0ab3c7587baeea578774af63" ON "crw_coupon_meta" ("key") `);
        await queryRunner.query(`CREATE INDEX "IDX_0a9f48c68638eb11163c845f39" ON "crw_coupon_meta" ("shortValue") `);
        await queryRunner.query(`DROP INDEX "IDX_59198cce77c3b44f2e9ac47008"`);
        await queryRunner.query(`DROP INDEX "IDX_22d6089b34dabf8e84ecdd3cd9"`);
        await queryRunner.query(`CREATE TABLE "temporary_crw_order_coupons_coupon" ("orderId" integer NOT NULL, "couponId" integer NOT NULL, CONSTRAINT "FK_59198cce77c3b44f2e9ac470082" FOREIGN KEY ("orderId") REFERENCES "crw_order" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_22d6089b34dabf8e84ecdd3cd96" FOREIGN KEY ("couponId") REFERENCES "crw_coupon" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("orderId", "couponId"))`);
        await queryRunner.query(`INSERT INTO "temporary_crw_order_coupons_coupon"("orderId", "couponId") SELECT "orderId", "couponId" FROM "crw_order_coupons_coupon"`);
        await queryRunner.query(`DROP TABLE "crw_order_coupons_coupon"`);
        await queryRunner.query(`ALTER TABLE "temporary_crw_order_coupons_coupon" RENAME TO "crw_order_coupons_coupon"`);
        await queryRunner.query(`CREATE INDEX "IDX_59198cce77c3b44f2e9ac47008" ON "crw_order_coupons_coupon" ("orderId") `);
        await queryRunner.query(`CREATE INDEX "IDX_22d6089b34dabf8e84ecdd3cd9" ON "crw_order_coupons_coupon" ("couponId") `);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_22d6089b34dabf8e84ecdd3cd9"`);
        await queryRunner.query(`DROP INDEX "IDX_59198cce77c3b44f2e9ac47008"`);
        await queryRunner.query(`ALTER TABLE "crw_order_coupons_coupon" RENAME TO "temporary_crw_order_coupons_coupon"`);
        await queryRunner.query(`CREATE TABLE "crw_order_coupons_coupon" ("orderId" integer NOT NULL, "couponId" integer NOT NULL, PRIMARY KEY ("orderId", "couponId"))`);
        await queryRunner.query(`INSERT INTO "crw_order_coupons_coupon"("orderId", "couponId") SELECT "orderId", "couponId" FROM "temporary_crw_order_coupons_coupon"`);
        await queryRunner.query(`DROP TABLE "temporary_crw_order_coupons_coupon"`);
        await queryRunner.query(`CREATE INDEX "IDX_22d6089b34dabf8e84ecdd3cd9" ON "crw_order_coupons_coupon" ("couponId") `);
        await queryRunner.query(`CREATE INDEX "IDX_59198cce77c3b44f2e9ac47008" ON "crw_order_coupons_coupon" ("orderId") `);
        await queryRunner.query(`DROP INDEX "IDX_0a9f48c68638eb11163c845f39"`);
        await queryRunner.query(`DROP INDEX "IDX_ce0ab3c7587baeea578774af63"`);
        await queryRunner.query(`ALTER TABLE "crw_coupon_meta" RENAME TO "temporary_crw_coupon_meta"`);
        await queryRunner.query(`CREATE TABLE "crw_coupon_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "crw_coupon_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "temporary_crw_coupon_meta"`);
        await queryRunner.query(`DROP TABLE "temporary_crw_coupon_meta"`);
        await queryRunner.query(`CREATE INDEX "IDX_0a9f48c68638eb11163c845f39" ON "crw_coupon_meta" ("shortValue") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce0ab3c7587baeea578774af63" ON "crw_coupon_meta" ("key") `);
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
}
