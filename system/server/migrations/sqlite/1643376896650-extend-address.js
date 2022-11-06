const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class extendAddress1643376896650 {
  name = 'extendAddress1643376896650';

  async up(queryRunner) {
    await queryRunner.query(`DROP INDEX "IDX_d4300abf3566bc4a63ca0b12c5"`);
    await queryRunner.query(`DROP INDEX "IDX_0d853efe1210ed00263c0551fb"`);
    await queryRunner.query(`DROP INDEX "IDX_0d115ee42c627f4c5f5ea6d12a"`);
    await queryRunner.query(`DROP INDEX "IDX_8bb01ee9a429f70390bbedbaf6"`);
    await queryRunner.query(`DROP INDEX "IDX_a71afe78a44fdebe245d06c0fb"`);
    await queryRunner.query(`DROP INDEX "IDX_86c22318de90222b57a2f0ac90"`);
    await queryRunner.query(`DROP INDEX "IDX_56caac5bbc2683720ddd655a23"`);
    await queryRunner.query(`DROP INDEX "IDX_f9516631047341dd5a92da55ed"`);
    await queryRunner.query(`ALTER TABLE "crw_order" RENAME TO "temporary_crw_order"`);

    await queryRunner.query(
      `CREATE TABLE "crw_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "status" varchar(255), "cart" text, "orderTotalPrice" float, "cartTotalPrice" float, "cartOldTotalPrice" float, "shippingPrice" float, "totalQnt" float, "userId" integer, "customerName" varchar(255), "customerPhone" varchar(255), "customerEmail" varchar(255), "customerAddress" varchar(6000), "shippingMethod" varchar(255), "paymentMethod" varchar(255), "customerComment" varchar(3000), "currency" varchar(255), "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_f9516631047341dd5a92da55ed" ON "crw_order" ("id") `);
    await queryRunner.query(`CREATE INDEX "IDX_56caac5bbc2683720ddd655a23" ON "crw_order" ("status") `);
    await queryRunner.query(`CREATE INDEX "IDX_86c22318de90222b57a2f0ac90" ON "crw_order" ("userId") `);
    await queryRunner.query(`CREATE INDEX "IDX_a71afe78a44fdebe245d06c0fb" ON "crw_order" ("customerName") `);
    await queryRunner.query(`CREATE INDEX "IDX_8bb01ee9a429f70390bbedbaf6" ON "crw_order" ("customerPhone") `);
    await queryRunner.query(`CREATE INDEX "IDX_0d115ee42c627f4c5f5ea6d12a" ON "crw_order" ("customerEmail") `);
    await queryRunner.query(`CREATE INDEX "IDX_0d853efe1210ed00263c0551fb" ON "crw_order" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_d4300abf3566bc4a63ca0b12c5" ON "crw_order" ("updateDate") `);

    await queryRunner.query(
      `INSERT INTO "crw_order"("id", "status", "cart", "orderTotalPrice", "cartTotalPrice", "cartOldTotalPrice", "shippingPrice", "totalQnt", "userId", "customerName", "customerPhone", "customerEmail", "customerAddress", "shippingMethod", "paymentMethod", "customerComment", "currency", "createDate", "updateDate") SELECT "id", "status", "cart", "orderTotalPrice", "cartTotalPrice", "cartOldTotalPrice", "shippingPrice", "totalQnt", "userId", "customerName", "customerPhone", "customerEmail", "customerAddress", "shippingMethod", "paymentMethod", "customerComment", "currency", "createDate", "updateDate" FROM "temporary_crw_order"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_order"`);
  }

  async down(queryRunner) {}
};
