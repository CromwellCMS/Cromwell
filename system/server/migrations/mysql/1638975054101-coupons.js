const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class coupons1638975054101 {
    name = 'coupons1638975054101'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`crw_coupon_meta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NULL, \`value\` text NULL, \`shortValue\` varchar(255) NULL, \`entityId\` int NOT NULL, INDEX \`IDX_ce0ab3c7587baeea578774af63\` (\`key\`), FULLTEXT INDEX \`IDX_0a9f48c68638eb11163c845f39\` (\`shortValue\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`crw_coupon\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`discountType\` varchar(255) NOT NULL, \`value\` float NULL, \`code\` varchar(255) NOT NULL, \`description\` varchar(3000) NULL, \`allowFreeShipping\` tinyint NULL, \`minimumSpend\` float NULL, \`maximumSpend\` float NULL, \`categoryIds\` text NULL, \`productIds\` text NULL, \`expiryDate\` datetime NULL, \`usageLimit\` int NULL, \`usedTimes\` int NULL, INDEX \`IDX_1319981d75d460ab975b4fae1e\` (\`createDate\`), INDEX \`IDX_b6fc6f1f4278fe1a1514d4dd65\` (\`updateDate\`), INDEX \`IDX_ba32138329c7114a4ebe5e46c8\` (\`discountType\`), UNIQUE INDEX \`IDX_a42d0cda340107e201bb3145f9\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`crw_order_coupons_coupon\` (\`orderId\` int NOT NULL, \`couponId\` int NOT NULL, INDEX \`IDX_59198cce77c3b44f2e9ac47008\` (\`orderId\`), INDEX \`IDX_22d6089b34dabf8e84ecdd3cd9\` (\`couponId\`), PRIMARY KEY (\`orderId\`, \`couponId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`crw_coupon_meta\` ADD CONSTRAINT \`FK_ae33d7acbc699d8192c2eea22cf\` FOREIGN KEY (\`entityId\`) REFERENCES \`crw_coupon\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`crw_order_coupons_coupon\` ADD CONSTRAINT \`FK_59198cce77c3b44f2e9ac470082\` FOREIGN KEY (\`orderId\`) REFERENCES \`crw_order\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`crw_order_coupons_coupon\` ADD CONSTRAINT \`FK_22d6089b34dabf8e84ecdd3cd96\` FOREIGN KEY (\`couponId\`) REFERENCES \`crw_coupon\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`crw_order_coupons_coupon\` DROP FOREIGN KEY \`FK_22d6089b34dabf8e84ecdd3cd96\``);
        await queryRunner.query(`ALTER TABLE \`crw_order_coupons_coupon\` DROP FOREIGN KEY \`FK_59198cce77c3b44f2e9ac470082\``);
        await queryRunner.query(`ALTER TABLE \`crw_coupon_meta\` DROP FOREIGN KEY \`FK_ae33d7acbc699d8192c2eea22cf\``);
        await queryRunner.query(`DROP INDEX \`IDX_22d6089b34dabf8e84ecdd3cd9\` ON \`crw_order_coupons_coupon\``);
        await queryRunner.query(`DROP INDEX \`IDX_59198cce77c3b44f2e9ac47008\` ON \`crw_order_coupons_coupon\``);
        await queryRunner.query(`DROP TABLE \`crw_order_coupons_coupon\``);
        await queryRunner.query(`DROP INDEX \`IDX_a42d0cda340107e201bb3145f9\` ON \`crw_coupon\``);
        await queryRunner.query(`DROP INDEX \`IDX_ba32138329c7114a4ebe5e46c8\` ON \`crw_coupon\``);
        await queryRunner.query(`DROP INDEX \`IDX_b6fc6f1f4278fe1a1514d4dd65\` ON \`crw_coupon\``);
        await queryRunner.query(`DROP INDEX \`IDX_1319981d75d460ab975b4fae1e\` ON \`crw_coupon\``);
        await queryRunner.query(`DROP TABLE \`crw_coupon\``);
        await queryRunner.query(`DROP INDEX \`IDX_0a9f48c68638eb11163c845f39\` ON \`crw_coupon_meta\``);
        await queryRunner.query(`DROP INDEX \`IDX_ce0ab3c7587baeea578774af63\` ON \`crw_coupon_meta\``);
        await queryRunner.query(`DROP TABLE \`crw_coupon_meta\``);
    }
}
