const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class productVariants1640287891928 {
    name = 'productVariants1640287891928'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`crw_product_variant_meta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NULL, \`value\` text NULL, \`shortValue\` varchar(255) NULL, \`entityId\` int NOT NULL, INDEX \`IDX_043b6fccace5ccd18abcd0472d\` (\`key\`), FULLTEXT INDEX \`IDX_5d353c6757ba25557fcaa97b16\` (\`shortValue\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`crw_product_variant\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`productId\` int NOT NULL, \`name\` varchar(255) NULL, \`price\` float NULL, \`oldPrice\` float NULL, \`sku\` varchar(255) NULL, \`mainImage\` varchar(400) NULL, \`images\` text NULL, \`stockAmount\` int NULL, \`stockStatus\` varchar(255) NULL, \`manageStock\` tinyint NULL, \`description\` text NULL, \`descriptionDelta\` text NULL, \`attributesJson\` text NULL, INDEX \`IDX_4f0d03313fc011fd0cdf8db5a8\` (\`createDate\`), INDEX \`IDX_57a78fa5ef24fa0ea0fa33a74e\` (\`updateDate\`), FULLTEXT INDEX \`IDX_d56c009fabddf3cf7a7b54210b\` (\`name\`), INDEX \`IDX_36939bbe847d64f4b78f3b5234\` (\`price\`), INDEX \`IDX_4676dd0b234c31f55656eb82b5\` (\`oldPrice\`), FULLTEXT INDEX \`IDX_9ae265ee4eb7735d7f0f2eb84d\` (\`sku\`), INDEX \`IDX_421fcfb5bf7bf531646dcd52ab\` (\`stockAmount\`), INDEX \`IDX_e34d9eb5816f615f44218fe5c2\` (\`stockStatus\`), UNIQUE INDEX \`IDX_c7c9273af9577aa30bb613bfe5\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        try {
            await queryRunner.query(`ALTER TABLE \`crw_product\` ADD \`manageStock\` tinyint NULL`);
        } catch (error) { console.error(error); }
        await queryRunner.query(`ALTER TABLE \`crw_product_variant_meta\` ADD CONSTRAINT \`FK_f2833cc1e1bb9516471b126327e\` FOREIGN KEY (\`entityId\`) REFERENCES \`crw_product_variant\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`crw_product_variant\` ADD CONSTRAINT \`FK_a787a73dfa5575dafeaab729bb5\` FOREIGN KEY (\`productId\`) REFERENCES \`crw_product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`crw_product_variant\` DROP FOREIGN KEY \`FK_a787a73dfa5575dafeaab729bb5\``);
        await queryRunner.query(`ALTER TABLE \`crw_product_variant_meta\` DROP FOREIGN KEY \`FK_f2833cc1e1bb9516471b126327e\``);
        await queryRunner.query(`ALTER TABLE \`crw_product\` DROP COLUMN \`manageStock\``);
        await queryRunner.query(`DROP INDEX \`IDX_c7c9273af9577aa30bb613bfe5\` ON \`crw_product_variant\``);
        await queryRunner.query(`DROP INDEX \`IDX_e34d9eb5816f615f44218fe5c2\` ON \`crw_product_variant\``);
        await queryRunner.query(`DROP INDEX \`IDX_421fcfb5bf7bf531646dcd52ab\` ON \`crw_product_variant\``);
        await queryRunner.query(`DROP INDEX \`IDX_9ae265ee4eb7735d7f0f2eb84d\` ON \`crw_product_variant\``);
        await queryRunner.query(`DROP INDEX \`IDX_4676dd0b234c31f55656eb82b5\` ON \`crw_product_variant\``);
        await queryRunner.query(`DROP INDEX \`IDX_36939bbe847d64f4b78f3b5234\` ON \`crw_product_variant\``);
        await queryRunner.query(`DROP INDEX \`IDX_d56c009fabddf3cf7a7b54210b\` ON \`crw_product_variant\``);
        await queryRunner.query(`DROP INDEX \`IDX_57a78fa5ef24fa0ea0fa33a74e\` ON \`crw_product_variant\``);
        await queryRunner.query(`DROP INDEX \`IDX_4f0d03313fc011fd0cdf8db5a8\` ON \`crw_product_variant\``);
        await queryRunner.query(`DROP TABLE \`crw_product_variant\``);
        await queryRunner.query(`DROP INDEX \`IDX_5d353c6757ba25557fcaa97b16\` ON \`crw_product_variant_meta\``);
        await queryRunner.query(`DROP INDEX \`IDX_043b6fccace5ccd18abcd0472d\` ON \`crw_product_variant_meta\``);
        await queryRunner.query(`DROP TABLE \`crw_product_variant_meta\``);
    }
}
