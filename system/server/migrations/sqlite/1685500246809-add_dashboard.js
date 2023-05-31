const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class addDashboard1685500246809 {
  name = 'addDashboard1685500246809';

  async up(queryRunner) {
    await queryRunner.query(`DROP INDEX "IDX_41e918d93c14cecfc1f809891a"`);
    await queryRunner.query(`DROP INDEX "IDX_d35934d4a842f8dd8798969774"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_order_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_order_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "crw_order_meta"`,
    );
    await queryRunner.query(`DROP TABLE "crw_order_meta"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_order_meta" RENAME TO "crw_order_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_41e918d93c14cecfc1f809891a" ON "crw_order_meta" ("shortValue") `);
    await queryRunner.query(`CREATE INDEX "IDX_d35934d4a842f8dd8798969774" ON "crw_order_meta" ("key") `);
    await queryRunner.query(`DROP INDEX "IDX_22d6089b34dabf8e84ecdd3cd9"`);
    await queryRunner.query(`DROP INDEX "IDX_59198cce77c3b44f2e9ac47008"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_order_coupons_coupon" ("orderId" integer NOT NULL, "couponId" integer NOT NULL, CONSTRAINT "FK_22d6089b34dabf8e84ecdd3cd96" FOREIGN KEY ("couponId") REFERENCES "crw_coupon" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("orderId", "couponId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_order_coupons_coupon"("orderId", "couponId") SELECT "orderId", "couponId" FROM "crw_order_coupons_coupon"`,
    );
    await queryRunner.query(`DROP TABLE "crw_order_coupons_coupon"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_order_coupons_coupon" RENAME TO "crw_order_coupons_coupon"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_22d6089b34dabf8e84ecdd3cd9" ON "crw_order_coupons_coupon" ("couponId") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_59198cce77c3b44f2e9ac47008" ON "crw_order_coupons_coupon" ("orderId") `);
    await queryRunner.query(
      `CREATE TABLE "crw_dashboard" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar(255) DEFAULT ('template'), "for" varchar(255) DEFAULT ('system'), "userId" integer, "_layout" text, CONSTRAINT "REL_1082b89fd0d75b4603f3aa7505" UNIQUE ("userId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_4513e00ff04a2f8494af941bf7" ON "crw_dashboard" ("id") `);
    await queryRunner.query(`CREATE INDEX "IDX_1082b89fd0d75b4603f3aa7505" ON "crw_dashboard" ("userId") `);
    await queryRunner.query(`DROP INDEX "IDX_a51cbca1c3ed52d289104a4029"`);
    await queryRunner.query(`DROP INDEX "IDX_519eaf50959bea415509872bb9"`);
    await queryRunner.query(`DROP INDEX "IDX_e734039ba75ee043d3c61466de"`);
    await queryRunner.query(`DROP INDEX "IDX_c07a670f3308a2db7824d76d6a"`);
    await queryRunner.query(`DROP INDEX "IDX_a4383ddcc0498cfacd641f9cf8"`);
    await queryRunner.query(`DROP INDEX "IDX_fbee175d8049460160e35a36ba"`);
    await queryRunner.query(`DROP INDEX "IDX_c717d9265ea3490790ee35edcd"`);
    await queryRunner.query(`DROP INDEX "IDX_5adfdd26419d9b737b683a8c65"`);
    await queryRunner.query(`DROP INDEX "IDX_77dc2abc46299b49ead89048d4"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "name" varchar(255), "mainCategoryId" integer, "price" float, "oldPrice" float, "sku" varchar(255), "mainImage" varchar(400), "images" text, "stockAmount" integer, "stockStatus" varchar(255), "description" text, "descriptionDelta" text, "averageRating" decimal, "reviewsCount" integer, "manageStock" boolean, CONSTRAINT "UQ_404785f00e4d88df4fa5783830b" UNIQUE ("slug"), CONSTRAINT "FK_c07a670f3308a2db7824d76d6ac" FOREIGN KEY ("mainCategoryId") REFERENCES "crw_product_category" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_product"("id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "name", "mainCategoryId", "price", "oldPrice", "sku", "mainImage", "images", "stockAmount", "stockStatus", "description", "descriptionDelta", "averageRating", "reviewsCount", "manageStock") SELECT "id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "name", "mainCategoryId", "price", "oldPrice", "sku", "mainImage", "images", "stockAmount", "stockStatus", "description", "descriptionDelta", "averageRating", "reviewsCount", "manageStock" FROM "crw_product"`,
    );
    await queryRunner.query(`DROP TABLE "crw_product"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_product" RENAME TO "crw_product"`);
    await queryRunner.query(`CREATE INDEX "IDX_a51cbca1c3ed52d289104a4029" ON "crw_product" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_519eaf50959bea415509872bb9" ON "crw_product" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_e734039ba75ee043d3c61466de" ON "crw_product" ("name") `);
    await queryRunner.query(`CREATE INDEX "IDX_c07a670f3308a2db7824d76d6a" ON "crw_product" ("mainCategoryId") `);
    await queryRunner.query(`CREATE INDEX "IDX_a4383ddcc0498cfacd641f9cf8" ON "crw_product" ("price") `);
    await queryRunner.query(`CREATE INDEX "IDX_fbee175d8049460160e35a36ba" ON "crw_product" ("oldPrice") `);
    await queryRunner.query(`CREATE INDEX "IDX_c717d9265ea3490790ee35edcd" ON "crw_product" ("sku") `);
    await queryRunner.query(`CREATE INDEX "IDX_5adfdd26419d9b737b683a8c65" ON "crw_product" ("stockAmount") `);
    await queryRunner.query(`CREATE INDEX "IDX_77dc2abc46299b49ead89048d4" ON "crw_product" ("stockStatus") `);
    await queryRunner.query(`DROP INDEX "IDX_11664fa069e1099e0f7617841f"`);
    await queryRunner.query(`DROP INDEX "IDX_8c0ffbe1960336ef92791b77b6"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_role_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL, CONSTRAINT "FK_ebe8676ea6dcf9a29c85579112a" FOREIGN KEY ("entityId") REFERENCES "crw_role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_role_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "crw_role_meta"`,
    );
    await queryRunner.query(`DROP TABLE "crw_role_meta"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_role_meta" RENAME TO "crw_role_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_11664fa069e1099e0f7617841f" ON "crw_role_meta" ("shortValue") `);
    await queryRunner.query(`CREATE INDEX "IDX_8c0ffbe1960336ef92791b77b6" ON "crw_role_meta" ("key") `);
    await queryRunner.query(`DROP INDEX "IDX_4513e00ff04a2f8494af941bf7"`);
    await queryRunner.query(`DROP INDEX "IDX_1082b89fd0d75b4603f3aa7505"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_dashboard" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar(255) DEFAULT ('template'), "for" varchar(255) DEFAULT ('system'), "userId" integer, "_layout" text, CONSTRAINT "REL_1082b89fd0d75b4603f3aa7505" UNIQUE ("userId"), CONSTRAINT "FK_1082b89fd0d75b4603f3aa75050" FOREIGN KEY ("userId") REFERENCES "crw_user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_dashboard"("id", "type", "for", "userId", "_layout") SELECT "id", "type", "for", "userId", "_layout" FROM "crw_dashboard"`,
    );
    await queryRunner.query(`DROP TABLE "crw_dashboard"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_dashboard" RENAME TO "crw_dashboard"`);
    await queryRunner.query(`CREATE INDEX "IDX_4513e00ff04a2f8494af941bf7" ON "crw_dashboard" ("id") `);
    await queryRunner.query(`CREATE INDEX "IDX_1082b89fd0d75b4603f3aa7505" ON "crw_dashboard" ("userId") `);
    await queryRunner.query(`DROP INDEX "IDX_41e918d93c14cecfc1f809891a"`);
    await queryRunner.query(`DROP INDEX "IDX_d35934d4a842f8dd8798969774"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_order_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL, CONSTRAINT "FK_5f0402c8bc745a0142da357102e" FOREIGN KEY ("entityId") REFERENCES "crw_order" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_order_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "crw_order_meta"`,
    );
    await queryRunner.query(`DROP TABLE "crw_order_meta"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_order_meta" RENAME TO "crw_order_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_41e918d93c14cecfc1f809891a" ON "crw_order_meta" ("shortValue") `);
    await queryRunner.query(`CREATE INDEX "IDX_d35934d4a842f8dd8798969774" ON "crw_order_meta" ("key") `);
    await queryRunner.query(`DROP INDEX "IDX_f5f27a36e32615ebf1e9a6ab82"`);
    await queryRunner.query(`DROP INDEX "IDX_86e2ad2823a8f16cffae290465"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "FK_86e2ad2823a8f16cffae290465b" FOREIGN KEY ("userId") REFERENCES "crw_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_f5f27a36e32615ebf1e9a6ab821" FOREIGN KEY ("roleId") REFERENCES "crw_role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "roleId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_user_roles_role"("userId", "roleId") SELECT "userId", "roleId" FROM "crw_user_roles_role"`,
    );
    await queryRunner.query(`DROP TABLE "crw_user_roles_role"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_user_roles_role" RENAME TO "crw_user_roles_role"`);
    await queryRunner.query(`CREATE INDEX "IDX_f5f27a36e32615ebf1e9a6ab82" ON "crw_user_roles_role" ("roleId") `);
    await queryRunner.query(`CREATE INDEX "IDX_86e2ad2823a8f16cffae290465" ON "crw_user_roles_role" ("userId") `);
    await queryRunner.query(`DROP INDEX "IDX_22d6089b34dabf8e84ecdd3cd9"`);
    await queryRunner.query(`DROP INDEX "IDX_59198cce77c3b44f2e9ac47008"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_order_coupons_coupon" ("orderId" integer NOT NULL, "couponId" integer NOT NULL, CONSTRAINT "FK_22d6089b34dabf8e84ecdd3cd96" FOREIGN KEY ("couponId") REFERENCES "crw_coupon" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_59198cce77c3b44f2e9ac470082" FOREIGN KEY ("orderId") REFERENCES "crw_order" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("orderId", "couponId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_order_coupons_coupon"("orderId", "couponId") SELECT "orderId", "couponId" FROM "crw_order_coupons_coupon"`,
    );
    await queryRunner.query(`DROP TABLE "crw_order_coupons_coupon"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_order_coupons_coupon" RENAME TO "crw_order_coupons_coupon"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_22d6089b34dabf8e84ecdd3cd9" ON "crw_order_coupons_coupon" ("couponId") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_59198cce77c3b44f2e9ac47008" ON "crw_order_coupons_coupon" ("orderId") `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX "IDX_59198cce77c3b44f2e9ac47008"`);
    await queryRunner.query(`DROP INDEX "IDX_22d6089b34dabf8e84ecdd3cd9"`);
    await queryRunner.query(`ALTER TABLE "crw_order_coupons_coupon" RENAME TO "temporary_crw_order_coupons_coupon"`);
    await queryRunner.query(
      `CREATE TABLE "crw_order_coupons_coupon" ("orderId" integer NOT NULL, "couponId" integer NOT NULL, CONSTRAINT "FK_22d6089b34dabf8e84ecdd3cd96" FOREIGN KEY ("couponId") REFERENCES "crw_coupon" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("orderId", "couponId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_order_coupons_coupon"("orderId", "couponId") SELECT "orderId", "couponId" FROM "temporary_crw_order_coupons_coupon"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_order_coupons_coupon"`);
    await queryRunner.query(`CREATE INDEX "IDX_59198cce77c3b44f2e9ac47008" ON "crw_order_coupons_coupon" ("orderId") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_22d6089b34dabf8e84ecdd3cd9" ON "crw_order_coupons_coupon" ("couponId") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_86e2ad2823a8f16cffae290465"`);
    await queryRunner.query(`DROP INDEX "IDX_f5f27a36e32615ebf1e9a6ab82"`);
    await queryRunner.query(`ALTER TABLE "crw_user_roles_role" RENAME TO "temporary_crw_user_roles_role"`);
    await queryRunner.query(
      `CREATE TABLE "crw_user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, PRIMARY KEY ("userId", "roleId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_user_roles_role"("userId", "roleId") SELECT "userId", "roleId" FROM "temporary_crw_user_roles_role"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_user_roles_role"`);
    await queryRunner.query(`CREATE INDEX "IDX_86e2ad2823a8f16cffae290465" ON "crw_user_roles_role" ("userId") `);
    await queryRunner.query(`CREATE INDEX "IDX_f5f27a36e32615ebf1e9a6ab82" ON "crw_user_roles_role" ("roleId") `);
    await queryRunner.query(`DROP INDEX "IDX_d35934d4a842f8dd8798969774"`);
    await queryRunner.query(`DROP INDEX "IDX_41e918d93c14cecfc1f809891a"`);
    await queryRunner.query(`ALTER TABLE "crw_order_meta" RENAME TO "temporary_crw_order_meta"`);
    await queryRunner.query(
      `CREATE TABLE "crw_order_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_order_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "temporary_crw_order_meta"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_order_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_d35934d4a842f8dd8798969774" ON "crw_order_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_41e918d93c14cecfc1f809891a" ON "crw_order_meta" ("shortValue") `);
    await queryRunner.query(`DROP INDEX "IDX_1082b89fd0d75b4603f3aa7505"`);
    await queryRunner.query(`DROP INDEX "IDX_4513e00ff04a2f8494af941bf7"`);
    await queryRunner.query(`ALTER TABLE "crw_dashboard" RENAME TO "temporary_crw_dashboard"`);
    await queryRunner.query(
      `CREATE TABLE "crw_dashboard" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar(255) DEFAULT ('template'), "for" varchar(255) DEFAULT ('system'), "userId" integer, "_layout" text, CONSTRAINT "REL_1082b89fd0d75b4603f3aa7505" UNIQUE ("userId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_dashboard"("id", "type", "for", "userId", "_layout") SELECT "id", "type", "for", "userId", "_layout" FROM "temporary_crw_dashboard"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_dashboard"`);
    await queryRunner.query(`CREATE INDEX "IDX_1082b89fd0d75b4603f3aa7505" ON "crw_dashboard" ("userId") `);
    await queryRunner.query(`CREATE INDEX "IDX_4513e00ff04a2f8494af941bf7" ON "crw_dashboard" ("id") `);
    await queryRunner.query(`DROP INDEX "IDX_8c0ffbe1960336ef92791b77b6"`);
    await queryRunner.query(`DROP INDEX "IDX_11664fa069e1099e0f7617841f"`);
    await queryRunner.query(`ALTER TABLE "crw_role_meta" RENAME TO "temporary_crw_role_meta"`);
    await queryRunner.query(
      `CREATE TABLE "crw_role_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_role_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "temporary_crw_role_meta"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_role_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_8c0ffbe1960336ef92791b77b6" ON "crw_role_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_11664fa069e1099e0f7617841f" ON "crw_role_meta" ("shortValue") `);
    await queryRunner.query(`DROP INDEX "IDX_77dc2abc46299b49ead89048d4"`);
    await queryRunner.query(`DROP INDEX "IDX_5adfdd26419d9b737b683a8c65"`);
    await queryRunner.query(`DROP INDEX "IDX_c717d9265ea3490790ee35edcd"`);
    await queryRunner.query(`DROP INDEX "IDX_fbee175d8049460160e35a36ba"`);
    await queryRunner.query(`DROP INDEX "IDX_a4383ddcc0498cfacd641f9cf8"`);
    await queryRunner.query(`DROP INDEX "IDX_c07a670f3308a2db7824d76d6a"`);
    await queryRunner.query(`DROP INDEX "IDX_e734039ba75ee043d3c61466de"`);
    await queryRunner.query(`DROP INDEX "IDX_519eaf50959bea415509872bb9"`);
    await queryRunner.query(`DROP INDEX "IDX_a51cbca1c3ed52d289104a4029"`);
    await queryRunner.query(`ALTER TABLE "crw_product" RENAME TO "temporary_crw_product"`);
    await queryRunner.query(
      `CREATE TABLE "crw_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "name" varchar(255), "mainCategoryId" integer, "price" float, "oldPrice" float, "sku" varchar(255), "mainImage" varchar(400), "images" text, "stockAmount" integer, "stockStatus" varchar(255), "description" text, "descriptionDelta" text, "averageRating" decimal, "reviewsCount" integer, "manageStock" boolean, CONSTRAINT "UQ_404785f00e4d88df4fa5783830b" UNIQUE ("slug"))`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_product"("id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "name", "mainCategoryId", "price", "oldPrice", "sku", "mainImage", "images", "stockAmount", "stockStatus", "description", "descriptionDelta", "averageRating", "reviewsCount", "manageStock") SELECT "id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "name", "mainCategoryId", "price", "oldPrice", "sku", "mainImage", "images", "stockAmount", "stockStatus", "description", "descriptionDelta", "averageRating", "reviewsCount", "manageStock" FROM "temporary_crw_product"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_product"`);
    await queryRunner.query(`CREATE INDEX "IDX_77dc2abc46299b49ead89048d4" ON "crw_product" ("stockStatus") `);
    await queryRunner.query(`CREATE INDEX "IDX_5adfdd26419d9b737b683a8c65" ON "crw_product" ("stockAmount") `);
    await queryRunner.query(`CREATE INDEX "IDX_c717d9265ea3490790ee35edcd" ON "crw_product" ("sku") `);
    await queryRunner.query(`CREATE INDEX "IDX_fbee175d8049460160e35a36ba" ON "crw_product" ("oldPrice") `);
    await queryRunner.query(`CREATE INDEX "IDX_a4383ddcc0498cfacd641f9cf8" ON "crw_product" ("price") `);
    await queryRunner.query(`CREATE INDEX "IDX_c07a670f3308a2db7824d76d6a" ON "crw_product" ("mainCategoryId") `);
    await queryRunner.query(`CREATE INDEX "IDX_e734039ba75ee043d3c61466de" ON "crw_product" ("name") `);
    await queryRunner.query(`CREATE INDEX "IDX_519eaf50959bea415509872bb9" ON "crw_product" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_a51cbca1c3ed52d289104a4029" ON "crw_product" ("createDate") `);
    await queryRunner.query(`DROP INDEX "IDX_1082b89fd0d75b4603f3aa7505"`);
    await queryRunner.query(`DROP INDEX "IDX_4513e00ff04a2f8494af941bf7"`);
    await queryRunner.query(`DROP TABLE "crw_dashboard"`);
    await queryRunner.query(`DROP INDEX "IDX_59198cce77c3b44f2e9ac47008"`);
    await queryRunner.query(`DROP INDEX "IDX_22d6089b34dabf8e84ecdd3cd9"`);
    await queryRunner.query(`ALTER TABLE "crw_order_coupons_coupon" RENAME TO "temporary_crw_order_coupons_coupon"`);
    await queryRunner.query(
      `CREATE TABLE "crw_order_coupons_coupon" ("orderId" integer NOT NULL, "couponId" integer NOT NULL, CONSTRAINT "FK_22d6089b34dabf8e84ecdd3cd96" FOREIGN KEY ("couponId") REFERENCES "crw_coupon" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_59198cce77c3b44f2e9ac470082" FOREIGN KEY ("orderId") REFERENCES "temporary_crw_order" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("orderId", "couponId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_order_coupons_coupon"("orderId", "couponId") SELECT "orderId", "couponId" FROM "temporary_crw_order_coupons_coupon"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_order_coupons_coupon"`);
    await queryRunner.query(`CREATE INDEX "IDX_59198cce77c3b44f2e9ac47008" ON "crw_order_coupons_coupon" ("orderId") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_22d6089b34dabf8e84ecdd3cd9" ON "crw_order_coupons_coupon" ("couponId") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_d35934d4a842f8dd8798969774"`);
    await queryRunner.query(`DROP INDEX "IDX_41e918d93c14cecfc1f809891a"`);
    await queryRunner.query(`ALTER TABLE "crw_order_meta" RENAME TO "temporary_crw_order_meta"`);
    await queryRunner.query(
      `CREATE TABLE "crw_order_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL, CONSTRAINT "FK_5f0402c8bc745a0142da357102e" FOREIGN KEY ("entityId") REFERENCES "temporary_crw_order" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_order_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "temporary_crw_order_meta"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_order_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_d35934d4a842f8dd8798969774" ON "crw_order_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_41e918d93c14cecfc1f809891a" ON "crw_order_meta" ("shortValue") `);
  }
};
