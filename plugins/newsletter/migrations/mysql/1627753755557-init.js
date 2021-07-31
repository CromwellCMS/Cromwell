const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class init1627753755557 {
    name = 'init1627753755557'

    async up(queryRunner) {
        await queryRunner.query("CREATE TABLE `crw_plugin_newsletter__newsletter_form` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    async down(queryRunner) {
        await queryRunner.query("DROP TABLE `crw_plugin_newsletter__newsletter_form`");
    }
}
