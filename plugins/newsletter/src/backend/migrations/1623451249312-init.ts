import {MigrationInterface, QueryRunner} from "typeorm";

export class init1623451249312 implements MigrationInterface {
    name = 'init1623451249312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `crw_plugin_newsletter__newsletter_form` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `crw_plugin_newsletter__newsletter_form`");
    }

}
