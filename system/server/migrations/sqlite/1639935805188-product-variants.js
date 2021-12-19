const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class productVariants1639935805188 {
    name = 'productVariants1639935805188'

    async up(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_77dc2abc46299b49ead89048d4"`);
        await queryRunner.query(`DROP INDEX "IDX_5adfdd26419d9b737b683a8c65"`);
        await queryRunner.query(`DROP INDEX "IDX_c717d9265ea3490790ee35edcd"`);
        await queryRunner.query(`DROP INDEX "IDX_fbee175d8049460160e35a36ba"`);
        await queryRunner.query(`DROP INDEX "IDX_a4383ddcc0498cfacd641f9cf8"`);
        await queryRunner.query(`DROP INDEX "IDX_c07a670f3308a2db7824d76d6a"`);
        await queryRunner.query(`DROP INDEX "IDX_e734039ba75ee043d3c61466de"`);
        await queryRunner.query(`DROP INDEX "IDX_519eaf50959bea415509872bb9"`);
        await queryRunner.query(`DROP INDEX "IDX_a51cbca1c3ed52d289104a4029"`);
        await queryRunner.query(`CREATE TABLE "temporary_crw_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "name" varchar(255), "mainCategoryId" integer, "price" float, "oldPrice" float, "sku" varchar(255), "mainImage" varchar(400), "images" text, "stockAmount" integer, "stockStatus" varchar(255), "description" text, "descriptionDelta" text, "averageRating" decimal, "reviewsCount" integer, "manageStock" boolean, "variantsJson" text, CONSTRAINT "UQ_404785f00e4d88df4fa5783830b" UNIQUE ("slug"))`);
        await queryRunner.query(`INSERT INTO "temporary_crw_product"("id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "name", "mainCategoryId", "price", "oldPrice", "sku", "mainImage", "images", "stockAmount", "stockStatus", "description", "descriptionDelta", "averageRating", "reviewsCount") SELECT "id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "name", "mainCategoryId", "price", "oldPrice", "sku", "mainImage", "images", "stockAmount", "stockStatus", "description", "descriptionDelta", "averageRating", "reviewsCount" FROM "crw_product"`);
        await queryRunner.query(`DROP TABLE "crw_product"`);
        await queryRunner.query(`ALTER TABLE "temporary_crw_product" RENAME TO "crw_product"`);
        await queryRunner.query(`CREATE INDEX "IDX_77dc2abc46299b49ead89048d4" ON "crw_product" ("stockStatus") `);
        await queryRunner.query(`CREATE INDEX "IDX_5adfdd26419d9b737b683a8c65" ON "crw_product" ("stockAmount") `);
        await queryRunner.query(`CREATE INDEX "IDX_c717d9265ea3490790ee35edcd" ON "crw_product" ("sku") `);
        await queryRunner.query(`CREATE INDEX "IDX_fbee175d8049460160e35a36ba" ON "crw_product" ("oldPrice") `);
        await queryRunner.query(`CREATE INDEX "IDX_a4383ddcc0498cfacd641f9cf8" ON "crw_product" ("price") `);
        await queryRunner.query(`CREATE INDEX "IDX_c07a670f3308a2db7824d76d6a" ON "crw_product" ("mainCategoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e734039ba75ee043d3c61466de" ON "crw_product" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_519eaf50959bea415509872bb9" ON "crw_product" ("updateDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_a51cbca1c3ed52d289104a4029" ON "crw_product" ("createDate") `);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_a51cbca1c3ed52d289104a4029"`);
        await queryRunner.query(`DROP INDEX "IDX_519eaf50959bea415509872bb9"`);
        await queryRunner.query(`DROP INDEX "IDX_e734039ba75ee043d3c61466de"`);
        await queryRunner.query(`DROP INDEX "IDX_c07a670f3308a2db7824d76d6a"`);
        await queryRunner.query(`DROP INDEX "IDX_a4383ddcc0498cfacd641f9cf8"`);
        await queryRunner.query(`DROP INDEX "IDX_fbee175d8049460160e35a36ba"`);
        await queryRunner.query(`DROP INDEX "IDX_c717d9265ea3490790ee35edcd"`);
        await queryRunner.query(`DROP INDEX "IDX_5adfdd26419d9b737b683a8c65"`);
        await queryRunner.query(`DROP INDEX "IDX_77dc2abc46299b49ead89048d4"`);
        await queryRunner.query(`ALTER TABLE "crw_product" RENAME TO "temporary_crw_product"`);
        await queryRunner.query(`CREATE TABLE "crw_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "name" varchar(255), "mainCategoryId" integer, "price" float, "oldPrice" float, "sku" varchar(255), "mainImage" varchar(400), "images" text, "stockAmount" integer, "stockStatus" varchar(255), "description" text, "descriptionDelta" text, "averageRating" decimal, "reviewsCount" integer, CONSTRAINT "UQ_404785f00e4d88df4fa5783830b" UNIQUE ("slug"))`);
        await queryRunner.query(`INSERT INTO "crw_product"("id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "name", "mainCategoryId", "price", "oldPrice", "sku", "mainImage", "images", "stockAmount", "stockStatus", "description", "descriptionDelta", "averageRating", "reviewsCount") SELECT "id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "name", "mainCategoryId", "price", "oldPrice", "sku", "mainImage", "images", "stockAmount", "stockStatus", "description", "descriptionDelta", "averageRating", "reviewsCount" FROM "temporary_crw_product"`);
        await queryRunner.query(`DROP TABLE "temporary_crw_product"`);
        await queryRunner.query(`CREATE INDEX "IDX_a51cbca1c3ed52d289104a4029" ON "crw_product" ("createDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_519eaf50959bea415509872bb9" ON "crw_product" ("updateDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_e734039ba75ee043d3c61466de" ON "crw_product" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_c07a670f3308a2db7824d76d6a" ON "crw_product" ("mainCategoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a4383ddcc0498cfacd641f9cf8" ON "crw_product" ("price") `);
        await queryRunner.query(`CREATE INDEX "IDX_fbee175d8049460160e35a36ba" ON "crw_product" ("oldPrice") `);
        await queryRunner.query(`CREATE INDEX "IDX_c717d9265ea3490790ee35edcd" ON "crw_product" ("sku") `);
        await queryRunner.query(`CREATE INDEX "IDX_5adfdd26419d9b737b683a8c65" ON "crw_product" ("stockAmount") `);
        await queryRunner.query(`CREATE INDEX "IDX_77dc2abc46299b49ead89048d4" ON "crw_product" ("stockStatus") `);
    }
}
