const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class init1628509499895 {
    name = 'init1628509499895'

    async up(queryRunner) {
        await queryRunner.query("CREATE TABLE `crw_PluginNewsletter_NewsletterForm` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    async down(queryRunner) {
        await queryRunner.query("DROP TABLE `crw_PluginNewsletter_NewsletterForm`");
    }
}
