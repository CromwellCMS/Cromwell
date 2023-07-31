const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class init1636584474808 {
  name = 'init1636584474808';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE \`crw_base_page_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, INDEX \`IDX_a116d8b9d2048f023d19efe688\` (\`createDate\`), INDEX \`IDX_844fa3c3d939e6239a0db732c6\` (\`updateDate\`), UNIQUE INDEX \`IDX_33d156210ae42177f24eb55b52\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_base_entity_meta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NULL, \`value\` text NULL, \`shortValue\` varchar(255) NULL, INDEX \`IDX_3d0d518265cf6018bf3e488f30\` (\`key\`), FULLTEXT INDEX \`IDX_b1fb7b510a52f67bb8bbc02b80\` (\`shortValue\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_attribute_meta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NULL, \`value\` text NULL, \`shortValue\` varchar(255) NULL, \`entityId\` int NOT NULL, INDEX \`IDX_bbdf61b39e061e316700b803b2\` (\`key\`), FULLTEXT INDEX \`IDX_cfc226f441aa035681ca94d791\` (\`shortValue\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_attribute\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`key\` varchar(255) NOT NULL, \`title\` varchar(255) NULL, \`type\` varchar(255) NULL, \`icon\` varchar(400) NULL, \`required\` tinyint NULL, INDEX \`IDX_8ef1078c7f634d29bfa7970d4a\` (\`createDate\`), INDEX \`IDX_53dcf0d02fa3d06e1e68790cff\` (\`updateDate\`), INDEX \`IDX_695c3d64e2b63723cfe3c046c7\` (\`key\`), UNIQUE INDEX \`IDX_21d04deefef2e9d62ed19ba759\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_attribute_value\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`attributeId\` int NOT NULL, \`key\` varchar(255) NOT NULL, \`value\` varchar(255) NULL, \`title\` varchar(255) NULL, \`icon\` varchar(400) NULL, INDEX \`IDX_23157f74583e1afa224da8e11f\` (\`createDate\`), INDEX \`IDX_4645313d5d1839bc27520ba3af\` (\`updateDate\`), INDEX \`IDX_d6645c2ed51e531f3f85e71f39\` (\`attributeId\`), INDEX \`IDX_383d029711cbe14d2daa4c10cb\` (\`key\`), UNIQUE INDEX \`IDX_54086f22f96038e46d3b2b512c\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_product_meta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NULL, \`value\` text NULL, \`shortValue\` varchar(255) NULL, \`entityId\` int NOT NULL, INDEX \`IDX_30673a2af77862cdf70c0676ce\` (\`key\`), FULLTEXT INDEX \`IDX_27954465979670837be4d63fc0\` (\`shortValue\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_product_category_meta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NULL, \`value\` text NULL, \`shortValue\` varchar(255) NULL, \`entityId\` int NOT NULL, INDEX \`IDX_f27e3267cdc21478c61e42bb88\` (\`key\`), FULLTEXT INDEX \`IDX_c33ea052760e97d0de3c7cc8b5\` (\`shortValue\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_product_category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`name\` varchar(255) NULL, \`mainImage\` varchar(400) NULL, \`description\` text NULL, \`descriptionDelta\` text NULL, \`parentId\` int NULL, INDEX \`IDX_3121c25318b5eaab5d51aba6d9\` (\`createDate\`), INDEX \`IDX_2d6326bee97904d86e512225ee\` (\`updateDate\`), FULLTEXT INDEX \`IDX_2a1e7d159e9a000b09d5cb70f4\` (\`name\`), UNIQUE INDEX \`IDX_273d34ee465b63376bead18bbf\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_product_review\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`productId\` int NULL, \`title\` varchar(255) NULL, \`description\` text NULL, \`rating\` float NULL, \`userEmail\` varchar(255) NULL, \`userName\` varchar(255) NULL, \`userId\` varchar(255) NULL, \`approved\` tinyint NULL, INDEX \`IDX_c2f533935056c7f29553b6e19a\` (\`createDate\`), INDEX \`IDX_282a9f102f8f653176677fef08\` (\`updateDate\`), INDEX \`IDX_487be848a7b34339aec3524e22\` (\`productId\`), INDEX \`IDX_70465de7e17c6e1c31077c01e4\` (\`title\`), INDEX \`IDX_c1cdd15bc1a00fb7500146d9cd\` (\`rating\`), INDEX \`IDX_399b21eccdf612065456fb2610\` (\`userEmail\`), INDEX \`IDX_dc5af49e3e348deae17df11497\` (\`userId\`), INDEX \`IDX_b096b1be8dd42fe22ddc88821d\` (\`approved\`), UNIQUE INDEX \`IDX_2fa3845bbaf6607041282074f3\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`name\` varchar(255) NULL, \`mainCategoryId\` int NULL, \`price\` float NULL, \`oldPrice\` float NULL, \`sku\` varchar(255) NULL, \`mainImage\` varchar(400) NULL, \`images\` text NULL, \`stockAmount\` int NULL, \`stockStatus\` varchar(255) NULL, \`description\` text NULL, \`descriptionDelta\` text NULL, \`averageRating\` decimal NULL, \`reviewsCount\` int NULL, INDEX \`IDX_a51cbca1c3ed52d289104a4029\` (\`createDate\`), INDEX \`IDX_519eaf50959bea415509872bb9\` (\`updateDate\`), FULLTEXT INDEX \`IDX_e734039ba75ee043d3c61466de\` (\`name\`), INDEX \`IDX_c07a670f3308a2db7824d76d6a\` (\`mainCategoryId\`), INDEX \`IDX_a4383ddcc0498cfacd641f9cf8\` (\`price\`), INDEX \`IDX_fbee175d8049460160e35a36ba\` (\`oldPrice\`), FULLTEXT INDEX \`IDX_c717d9265ea3490790ee35edcd\` (\`sku\`), INDEX \`IDX_5adfdd26419d9b737b683a8c65\` (\`stockAmount\`), INDEX \`IDX_77dc2abc46299b49ead89048d4\` (\`stockStatus\`), UNIQUE INDEX \`IDX_404785f00e4d88df4fa5783830\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_attribute_to_product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`productId\` int NULL, \`attributeValueId\` int NULL, \`key\` varchar(255) NOT NULL, \`value\` varchar(255) NULL, INDEX \`IDX_533b299ee136f75e261be4ebcf\` (\`productId\`), INDEX \`IDX_6a9b506859de7cc2ac65414ec9\` (\`attributeValueId\`), INDEX \`IDX_d4292415b7431d518278318057\` (\`key\`), INDEX \`IDX_854e20470498807068e94d87a8\` (\`value\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_cms\` (\`id\` int NOT NULL AUTO_INCREMENT, \`_publicSettings\` text NULL, \`_adminSettings\` text NULL, \`_internalSettings\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_35aee121b80f1702414cd3d86a\` (\`id\`), INDEX \`IDX_29b7f30f5cacfd369a34125a98\` (\`createDate\`), INDEX \`IDX_11992283fb607b2ce95106e243\` (\`updateDate\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_custom_entity_meta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NULL, \`value\` text NULL, \`shortValue\` varchar(255) NULL, \`entityId\` int NOT NULL, INDEX \`IDX_f555082eae3d87f39ef5001997\` (\`key\`), FULLTEXT INDEX \`IDX_f33b5eacdc9c43019549184604\` (\`shortValue\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_custom_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`entityType\` varchar(255) NOT NULL, \`name\` varchar(255) NULL, INDEX \`IDX_b6d68788b94c05e6c4ecb75378\` (\`createDate\`), INDEX \`IDX_31c31500e681c0075278fcb76b\` (\`updateDate\`), INDEX \`IDX_cb3862e657eb6cf39e77241e82\` (\`entityType\`), INDEX \`IDX_44e0f6581a291c3814140fc0e8\` (\`name\`), UNIQUE INDEX \`IDX_ce619267281298b316ee8ad360\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` varchar(255) NULL, \`cart\` text NULL, \`orderTotalPrice\` float NULL, \`cartTotalPrice\` float NULL, \`cartOldTotalPrice\` float NULL, \`shippingPrice\` float NULL, \`totalQnt\` float NULL, \`userId\` int NULL, \`customerName\` varchar(255) NULL, \`customerPhone\` varchar(255) NULL, \`customerEmail\` varchar(255) NULL, \`customerAddress\` varchar(255) NULL, \`shippingMethod\` varchar(255) NULL, \`paymentMethod\` varchar(255) NULL, \`customerComment\` varchar(3000) NULL, \`currency\` varchar(255) NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_f9516631047341dd5a92da55ed\` (\`id\`), INDEX \`IDX_56caac5bbc2683720ddd655a23\` (\`status\`), INDEX \`IDX_86c22318de90222b57a2f0ac90\` (\`userId\`), INDEX \`IDX_a71afe78a44fdebe245d06c0fb\` (\`customerName\`), INDEX \`IDX_8bb01ee9a429f70390bbedbaf6\` (\`customerPhone\`), INDEX \`IDX_0d115ee42c627f4c5f5ea6d12a\` (\`customerEmail\`), INDEX \`IDX_0d853efe1210ed00263c0551fb\` (\`createDate\`), INDEX \`IDX_d4300abf3566bc4a63ca0b12c5\` (\`updateDate\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_order_meta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NULL, \`value\` text NULL, \`shortValue\` varchar(255) NULL, \`entityId\` int NOT NULL, INDEX \`IDX_d35934d4a842f8dd8798969774\` (\`key\`), FULLTEXT INDEX \`IDX_41e918d93c14cecfc1f809891a\` (\`shortValue\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_post_comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`postId\` int NULL, \`title\` varchar(400) NULL, \`comment\` text NULL, \`userEmail\` varchar(255) NULL, \`userName\` varchar(255) NULL, \`userId\` int NULL, \`approved\` tinyint NULL, INDEX \`IDX_2cdbb06f851e9b8b2872eb1b07\` (\`createDate\`), INDEX \`IDX_d5ed51c984a9ff9b8ee7a515bb\` (\`updateDate\`), INDEX \`IDX_787534d5ddf971c1b85d99c88c\` (\`postId\`), INDEX \`IDX_16527a7e9f22a68a274e61d6da\` (\`userEmail\`), INDEX \`IDX_cb0a2cf3605d77131907fb4664\` (\`userId\`), UNIQUE INDEX \`IDX_0c41e89299843ea6cd5bb1e10b\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_tag_meta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NULL, \`value\` text NULL, \`shortValue\` varchar(255) NULL, \`entityId\` int NOT NULL, INDEX \`IDX_f8c8425742699651cf5f7c12e0\` (\`key\`), FULLTEXT INDEX \`IDX_17920baaeed623ba12afefa4b2\` (\`shortValue\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_tag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`name\` varchar(255) NULL, \`color\` varchar(255) NULL, \`image\` varchar(255) NULL, \`description\` text NULL, \`descriptionDelta\` text NULL, INDEX \`IDX_85d1613594ad8e9a0396922bb4\` (\`createDate\`), INDEX \`IDX_ac25c70c54e0644d0ece40f1f1\` (\`updateDate\`), FULLTEXT INDEX \`IDX_ecaa69a0357666eebdd48c8c75\` (\`name\`), UNIQUE INDEX \`IDX_3ad1ae94ac65ac5cf6ef4a97fd\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_user_meta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NULL, \`value\` text NULL, \`shortValue\` varchar(255) NULL, \`entityId\` int NOT NULL, INDEX \`IDX_be55edbbdc5da3712ab5270b61\` (\`key\`), FULLTEXT INDEX \`IDX_ac05041d8a345ef9bcf4df886c\` (\`shortValue\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`fullName\` varchar(255) NULL, \`email\` varchar(255) NULL, \`avatar\` varchar(255) NULL, \`bio\` text NULL, \`role\` varchar(50) NULL, \`address\` varchar(1000) NULL, \`phone\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`refreshTokens\` varchar(5000) NULL, \`resetPasswordCode\` varchar(255) NULL, \`resetPasswordDate\` datetime NULL, INDEX \`IDX_aae8c723ca641247505d92aedc\` (\`createDate\`), INDEX \`IDX_82038b3a02bf4b55377a056d4e\` (\`updateDate\`), FULLTEXT INDEX \`IDX_0537e4a35e2b1842afc531deab\` (\`fullName\`), FULLTEXT INDEX \`IDX_user.entity_email\` (\`email\`), INDEX \`IDX_850a536df6641e90872f905e74\` (\`role\`), FULLTEXT INDEX \`IDX_644eed41dbcadfe2e3e634ba84\` (\`phone\`), UNIQUE INDEX \`IDX_86fcd952549ae797ab020043b2\` (\`slug\`), UNIQUE INDEX \`IDX_4544ef20d7756aad6b7a49d813\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`title\` varchar(255) NULL, \`authorId\` int NULL, \`content\` text NULL, \`delta\` text NULL, \`excerpt\` varchar(5000) NULL, \`mainImage\` varchar(400) NULL, \`readTime\` varchar(255) NULL, \`published\` tinyint NULL, \`publishDate\` datetime NULL, \`featured\` tinyint NULL, INDEX \`IDX_ec3abbafac22f27f03f3ddeb67\` (\`createDate\`), INDEX \`IDX_b4056f8c22fa23bd54d854b866\` (\`updateDate\`), FULLTEXT INDEX \`IDX_e47953e4571dce4050c9524443\` (\`title\`), INDEX \`IDX_35c1445265a8d5362e06167ae3\` (\`authorId\`), INDEX \`IDX_8d98eb30db4dfb464ce54c1957\` (\`published\`), INDEX \`IDX_0977d4805adadb696f735445ee\` (\`featured\`), UNIQUE INDEX \`IDX_29f14d08659ef8a3230e244708\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_post_meta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(255) NULL, \`value\` text NULL, \`shortValue\` varchar(255) NULL, \`entityId\` int NOT NULL, INDEX \`IDX_a6e8f93e58953b3440e4ce8e97\` (\`key\`), FULLTEXT INDEX \`IDX_f88f049ff16c909c2117a3b737\` (\`shortValue\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_page_stats\` (\`id\` int NOT NULL AUTO_INCREMENT, \`pageRoute\` varchar(255) NOT NULL, \`pageName\` varchar(255) NULL, \`pageId\` varchar(255) NULL, \`views\` int NULL, \`slug\` varchar(255) NULL, \`entityType\` varchar(255) NULL, INDEX \`IDX_b77d858a4e600256c226b71e7d\` (\`slug\`), INDEX \`IDX_1f6131609d99f50bc4da4b9333\` (\`entityType\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_plugin\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`name\` varchar(255) NOT NULL, \`version\` varchar(255) NULL, \`title\` varchar(255) NULL, \`isInstalled\` tinyint NOT NULL, \`hasAdminBundle\` tinyint NULL, \`settings\` text NULL, \`defaultSettings\` text NULL, \`moduleInfo\` text NULL, \`isUpdating\` tinyint NULL, INDEX \`IDX_9cb3bd0ef9e43cde320c123bff\` (\`createDate\`), INDEX \`IDX_363ec5f7b94386accb06dbbb4e\` (\`updateDate\`), UNIQUE INDEX \`IDX_067de3d2c7d9e0e6fc733c7ba5\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_theme\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NULL, \`pageTitle\` varchar(2000) NULL, \`pageDescription\` varchar(4000) NULL, \`_meta\` text NULL, \`createDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isEnabled\` tinyint NULL DEFAULT 1, \`name\` varchar(255) NOT NULL, \`version\` varchar(255) NULL, \`title\` varchar(255) NULL, \`isInstalled\` tinyint NOT NULL, \`hasAdminBundle\` tinyint NULL, \`settings\` text NULL, \`defaultSettings\` text NULL, \`moduleInfo\` text NULL, \`isUpdating\` tinyint NULL, INDEX \`IDX_78cf29997948828f22da70514d\` (\`createDate\`), INDEX \`IDX_a1a866ef4e58782a1e886a5bc8\` (\`updateDate\`), UNIQUE INDEX \`IDX_05d0c5a03358df4a5fc355eb7f\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_product_categories_product_category\` (\`productId\` int NOT NULL, \`productCategoryId\` int NOT NULL, INDEX \`IDX_8056740044bde85c6535e4cc6c\` (\`productId\`), INDEX \`IDX_f4f41beb6142f70af17b37ff50\` (\`productCategoryId\`), PRIMARY KEY (\`productId\`, \`productCategoryId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_post_tags_tag\` (\`postId\` int NOT NULL, \`tagId\` int NOT NULL, INDEX \`IDX_f24f47df26e67c493b68bfc75b\` (\`postId\`), INDEX \`IDX_6c786f2afb686050d8233fdc6e\` (\`tagId\`), PRIMARY KEY (\`postId\`, \`tagId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`crw_product_category_closure\` (\`id_ancestor\` int NOT NULL, \`id_descendant\` int NOT NULL, INDEX \`IDX_9463c9a5893b1efb969e9a21c5\` (\`id_ancestor\`), INDEX \`IDX_bc8936d152e18bc99150472594\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_attribute_meta\` ADD CONSTRAINT \`FK_b5e4e97e31370c47395b4a6edc1\` FOREIGN KEY (\`entityId\`) REFERENCES \`crw_attribute\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_attribute_value\` ADD CONSTRAINT \`FK_d6645c2ed51e531f3f85e71f396\` FOREIGN KEY (\`attributeId\`) REFERENCES \`crw_attribute\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_product_meta\` ADD CONSTRAINT \`FK_05fc2d8b68b3833525d7c837c10\` FOREIGN KEY (\`entityId\`) REFERENCES \`crw_product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_product_category_meta\` ADD CONSTRAINT \`FK_c850099194d3cd3a991634bc12d\` FOREIGN KEY (\`entityId\`) REFERENCES \`crw_product_category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_product_category\` ADD CONSTRAINT \`FK_e7959ee49453ac5342ed33c2f0f\` FOREIGN KEY (\`parentId\`) REFERENCES \`crw_product_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_product_review\` ADD CONSTRAINT \`FK_487be848a7b34339aec3524e221\` FOREIGN KEY (\`productId\`) REFERENCES \`crw_product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_attribute_to_product\` ADD CONSTRAINT \`FK_533b299ee136f75e261be4ebcf1\` FOREIGN KEY (\`productId\`) REFERENCES \`crw_product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_attribute_to_product\` ADD CONSTRAINT \`FK_6a9b506859de7cc2ac65414ec95\` FOREIGN KEY (\`attributeValueId\`) REFERENCES \`crw_attribute_value\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_custom_entity_meta\` ADD CONSTRAINT \`FK_9339113c97fb03140bf2765fc41\` FOREIGN KEY (\`entityId\`) REFERENCES \`crw_custom_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_order_meta\` ADD CONSTRAINT \`FK_5f0402c8bc745a0142da357102e\` FOREIGN KEY (\`entityId\`) REFERENCES \`crw_order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_post_comment\` ADD CONSTRAINT \`FK_787534d5ddf971c1b85d99c88c3\` FOREIGN KEY (\`postId\`) REFERENCES \`crw_post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_tag_meta\` ADD CONSTRAINT \`FK_4ce88d2ef01aa532e616b2e5dc6\` FOREIGN KEY (\`entityId\`) REFERENCES \`crw_tag\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_user_meta\` ADD CONSTRAINT \`FK_eb456c31e1202a6f6eb8f9f563c\` FOREIGN KEY (\`entityId\`) REFERENCES \`crw_user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_post\` ADD CONSTRAINT \`FK_35c1445265a8d5362e06167ae3c\` FOREIGN KEY (\`authorId\`) REFERENCES \`crw_user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_post_meta\` ADD CONSTRAINT \`FK_9f46af18aca849480af6ac0642b\` FOREIGN KEY (\`entityId\`) REFERENCES \`crw_post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_product_categories_product_category\` ADD CONSTRAINT \`FK_8056740044bde85c6535e4cc6c9\` FOREIGN KEY (\`productId\`) REFERENCES \`crw_product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_product_categories_product_category\` ADD CONSTRAINT \`FK_f4f41beb6142f70af17b37ff50f\` FOREIGN KEY (\`productCategoryId\`) REFERENCES \`crw_product_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_post_tags_tag\` ADD CONSTRAINT \`FK_f24f47df26e67c493b68bfc75bb\` FOREIGN KEY (\`postId\`) REFERENCES \`crw_post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_post_tags_tag\` ADD CONSTRAINT \`FK_6c786f2afb686050d8233fdc6e7\` FOREIGN KEY (\`tagId\`) REFERENCES \`crw_tag\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_product_category_closure\` ADD CONSTRAINT \`FK_9463c9a5893b1efb969e9a21c59\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`crw_product_category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_product_category_closure\` ADD CONSTRAINT \`FK_bc8936d152e18bc991504725944\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`crw_product_category\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE \`crw_product_category_closure\` DROP FOREIGN KEY \`FK_bc8936d152e18bc991504725944\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_product_category_closure\` DROP FOREIGN KEY \`FK_9463c9a5893b1efb969e9a21c59\``,
    );
    await queryRunner.query(`ALTER TABLE \`crw_post_tags_tag\` DROP FOREIGN KEY \`FK_6c786f2afb686050d8233fdc6e7\``);
    await queryRunner.query(`ALTER TABLE \`crw_post_tags_tag\` DROP FOREIGN KEY \`FK_f24f47df26e67c493b68bfc75bb\``);
    await queryRunner.query(
      `ALTER TABLE \`crw_product_categories_product_category\` DROP FOREIGN KEY \`FK_f4f41beb6142f70af17b37ff50f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_product_categories_product_category\` DROP FOREIGN KEY \`FK_8056740044bde85c6535e4cc6c9\``,
    );
    await queryRunner.query(`ALTER TABLE \`crw_post_meta\` DROP FOREIGN KEY \`FK_9f46af18aca849480af6ac0642b\``);
    await queryRunner.query(`ALTER TABLE \`crw_post\` DROP FOREIGN KEY \`FK_35c1445265a8d5362e06167ae3c\``);
    await queryRunner.query(`ALTER TABLE \`crw_user_meta\` DROP FOREIGN KEY \`FK_eb456c31e1202a6f6eb8f9f563c\``);
    await queryRunner.query(`ALTER TABLE \`crw_tag_meta\` DROP FOREIGN KEY \`FK_4ce88d2ef01aa532e616b2e5dc6\``);
    await queryRunner.query(`ALTER TABLE \`crw_post_comment\` DROP FOREIGN KEY \`FK_787534d5ddf971c1b85d99c88c3\``);
    await queryRunner.query(`ALTER TABLE \`crw_order_meta\` DROP FOREIGN KEY \`FK_5f0402c8bc745a0142da357102e\``);
    await queryRunner.query(
      `ALTER TABLE \`crw_custom_entity_meta\` DROP FOREIGN KEY \`FK_9339113c97fb03140bf2765fc41\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_attribute_to_product\` DROP FOREIGN KEY \`FK_6a9b506859de7cc2ac65414ec95\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`crw_attribute_to_product\` DROP FOREIGN KEY \`FK_533b299ee136f75e261be4ebcf1\``,
    );
    await queryRunner.query(`ALTER TABLE \`crw_product_review\` DROP FOREIGN KEY \`FK_487be848a7b34339aec3524e221\``);
    await queryRunner.query(`ALTER TABLE \`crw_product_category\` DROP FOREIGN KEY \`FK_e7959ee49453ac5342ed33c2f0f\``);
    await queryRunner.query(
      `ALTER TABLE \`crw_product_category_meta\` DROP FOREIGN KEY \`FK_c850099194d3cd3a991634bc12d\``,
    );
    await queryRunner.query(`ALTER TABLE \`crw_product_meta\` DROP FOREIGN KEY \`FK_05fc2d8b68b3833525d7c837c10\``);
    await queryRunner.query(`ALTER TABLE \`crw_attribute_value\` DROP FOREIGN KEY \`FK_d6645c2ed51e531f3f85e71f396\``);
    await queryRunner.query(`ALTER TABLE \`crw_attribute_meta\` DROP FOREIGN KEY \`FK_b5e4e97e31370c47395b4a6edc1\``);
    await queryRunner.query(`DROP INDEX \`IDX_bc8936d152e18bc99150472594\` ON \`crw_product_category_closure\``);
    await queryRunner.query(`DROP INDEX \`IDX_9463c9a5893b1efb969e9a21c5\` ON \`crw_product_category_closure\``);
    await queryRunner.query(`DROP TABLE \`crw_product_category_closure\``);
    await queryRunner.query(`DROP INDEX \`IDX_6c786f2afb686050d8233fdc6e\` ON \`crw_post_tags_tag\``);
    await queryRunner.query(`DROP INDEX \`IDX_f24f47df26e67c493b68bfc75b\` ON \`crw_post_tags_tag\``);
    await queryRunner.query(`DROP TABLE \`crw_post_tags_tag\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f4f41beb6142f70af17b37ff50\` ON \`crw_product_categories_product_category\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_8056740044bde85c6535e4cc6c\` ON \`crw_product_categories_product_category\``,
    );
    await queryRunner.query(`DROP TABLE \`crw_product_categories_product_category\``);
    await queryRunner.query(`DROP INDEX \`IDX_05d0c5a03358df4a5fc355eb7f\` ON \`crw_theme\``);
    await queryRunner.query(`DROP INDEX \`IDX_a1a866ef4e58782a1e886a5bc8\` ON \`crw_theme\``);
    await queryRunner.query(`DROP INDEX \`IDX_78cf29997948828f22da70514d\` ON \`crw_theme\``);
    await queryRunner.query(`DROP TABLE \`crw_theme\``);
    await queryRunner.query(`DROP INDEX \`IDX_067de3d2c7d9e0e6fc733c7ba5\` ON \`crw_plugin\``);
    await queryRunner.query(`DROP INDEX \`IDX_363ec5f7b94386accb06dbbb4e\` ON \`crw_plugin\``);
    await queryRunner.query(`DROP INDEX \`IDX_9cb3bd0ef9e43cde320c123bff\` ON \`crw_plugin\``);
    await queryRunner.query(`DROP TABLE \`crw_plugin\``);
    await queryRunner.query(`DROP INDEX \`IDX_1f6131609d99f50bc4da4b9333\` ON \`crw_page_stats\``);
    await queryRunner.query(`DROP INDEX \`IDX_b77d858a4e600256c226b71e7d\` ON \`crw_page_stats\``);
    await queryRunner.query(`DROP TABLE \`crw_page_stats\``);
    await queryRunner.query(`DROP INDEX \`IDX_f88f049ff16c909c2117a3b737\` ON \`crw_post_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_a6e8f93e58953b3440e4ce8e97\` ON \`crw_post_meta\``);
    await queryRunner.query(`DROP TABLE \`crw_post_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_29f14d08659ef8a3230e244708\` ON \`crw_post\``);
    await queryRunner.query(`DROP INDEX \`IDX_0977d4805adadb696f735445ee\` ON \`crw_post\``);
    await queryRunner.query(`DROP INDEX \`IDX_8d98eb30db4dfb464ce54c1957\` ON \`crw_post\``);
    await queryRunner.query(`DROP INDEX \`IDX_35c1445265a8d5362e06167ae3\` ON \`crw_post\``);
    await queryRunner.query(`DROP INDEX \`IDX_e47953e4571dce4050c9524443\` ON \`crw_post\``);
    await queryRunner.query(`DROP INDEX \`IDX_b4056f8c22fa23bd54d854b866\` ON \`crw_post\``);
    await queryRunner.query(`DROP INDEX \`IDX_ec3abbafac22f27f03f3ddeb67\` ON \`crw_post\``);
    await queryRunner.query(`DROP TABLE \`crw_post\``);
    await queryRunner.query(`DROP INDEX \`IDX_4544ef20d7756aad6b7a49d813\` ON \`crw_user\``);
    await queryRunner.query(`DROP INDEX \`IDX_86fcd952549ae797ab020043b2\` ON \`crw_user\``);
    await queryRunner.query(`DROP INDEX \`IDX_644eed41dbcadfe2e3e634ba84\` ON \`crw_user\``);
    await queryRunner.query(`DROP INDEX \`IDX_850a536df6641e90872f905e74\` ON \`crw_user\``);
    await queryRunner.query(`DROP INDEX \`IDX_user.entity_email\` ON \`crw_user\``);
    await queryRunner.query(`DROP INDEX \`IDX_0537e4a35e2b1842afc531deab\` ON \`crw_user\``);
    await queryRunner.query(`DROP INDEX \`IDX_82038b3a02bf4b55377a056d4e\` ON \`crw_user\``);
    await queryRunner.query(`DROP INDEX \`IDX_aae8c723ca641247505d92aedc\` ON \`crw_user\``);
    await queryRunner.query(`DROP TABLE \`crw_user\``);
    await queryRunner.query(`DROP INDEX \`IDX_ac05041d8a345ef9bcf4df886c\` ON \`crw_user_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_be55edbbdc5da3712ab5270b61\` ON \`crw_user_meta\``);
    await queryRunner.query(`DROP TABLE \`crw_user_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_3ad1ae94ac65ac5cf6ef4a97fd\` ON \`crw_tag\``);
    await queryRunner.query(`DROP INDEX \`IDX_ecaa69a0357666eebdd48c8c75\` ON \`crw_tag\``);
    await queryRunner.query(`DROP INDEX \`IDX_ac25c70c54e0644d0ece40f1f1\` ON \`crw_tag\``);
    await queryRunner.query(`DROP INDEX \`IDX_85d1613594ad8e9a0396922bb4\` ON \`crw_tag\``);
    await queryRunner.query(`DROP TABLE \`crw_tag\``);
    await queryRunner.query(`DROP INDEX \`IDX_17920baaeed623ba12afefa4b2\` ON \`crw_tag_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_f8c8425742699651cf5f7c12e0\` ON \`crw_tag_meta\``);
    await queryRunner.query(`DROP TABLE \`crw_tag_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_0c41e89299843ea6cd5bb1e10b\` ON \`crw_post_comment\``);
    await queryRunner.query(`DROP INDEX \`IDX_cb0a2cf3605d77131907fb4664\` ON \`crw_post_comment\``);
    await queryRunner.query(`DROP INDEX \`IDX_16527a7e9f22a68a274e61d6da\` ON \`crw_post_comment\``);
    await queryRunner.query(`DROP INDEX \`IDX_787534d5ddf971c1b85d99c88c\` ON \`crw_post_comment\``);
    await queryRunner.query(`DROP INDEX \`IDX_d5ed51c984a9ff9b8ee7a515bb\` ON \`crw_post_comment\``);
    await queryRunner.query(`DROP INDEX \`IDX_2cdbb06f851e9b8b2872eb1b07\` ON \`crw_post_comment\``);
    await queryRunner.query(`DROP TABLE \`crw_post_comment\``);
    await queryRunner.query(`DROP INDEX \`IDX_41e918d93c14cecfc1f809891a\` ON \`crw_order_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_d35934d4a842f8dd8798969774\` ON \`crw_order_meta\``);
    await queryRunner.query(`DROP TABLE \`crw_order_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_d4300abf3566bc4a63ca0b12c5\` ON \`crw_order\``);
    await queryRunner.query(`DROP INDEX \`IDX_0d853efe1210ed00263c0551fb\` ON \`crw_order\``);
    await queryRunner.query(`DROP INDEX \`IDX_0d115ee42c627f4c5f5ea6d12a\` ON \`crw_order\``);
    await queryRunner.query(`DROP INDEX \`IDX_8bb01ee9a429f70390bbedbaf6\` ON \`crw_order\``);
    await queryRunner.query(`DROP INDEX \`IDX_a71afe78a44fdebe245d06c0fb\` ON \`crw_order\``);
    await queryRunner.query(`DROP INDEX \`IDX_86c22318de90222b57a2f0ac90\` ON \`crw_order\``);
    await queryRunner.query(`DROP INDEX \`IDX_56caac5bbc2683720ddd655a23\` ON \`crw_order\``);
    await queryRunner.query(`DROP INDEX \`IDX_f9516631047341dd5a92da55ed\` ON \`crw_order\``);
    await queryRunner.query(`DROP TABLE \`crw_order\``);
    await queryRunner.query(`DROP INDEX \`IDX_ce619267281298b316ee8ad360\` ON \`crw_custom_entity\``);
    await queryRunner.query(`DROP INDEX \`IDX_44e0f6581a291c3814140fc0e8\` ON \`crw_custom_entity\``);
    await queryRunner.query(`DROP INDEX \`IDX_cb3862e657eb6cf39e77241e82\` ON \`crw_custom_entity\``);
    await queryRunner.query(`DROP INDEX \`IDX_31c31500e681c0075278fcb76b\` ON \`crw_custom_entity\``);
    await queryRunner.query(`DROP INDEX \`IDX_b6d68788b94c05e6c4ecb75378\` ON \`crw_custom_entity\``);
    await queryRunner.query(`DROP TABLE \`crw_custom_entity\``);
    await queryRunner.query(`DROP INDEX \`IDX_f33b5eacdc9c43019549184604\` ON \`crw_custom_entity_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_f555082eae3d87f39ef5001997\` ON \`crw_custom_entity_meta\``);
    await queryRunner.query(`DROP TABLE \`crw_custom_entity_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_11992283fb607b2ce95106e243\` ON \`crw_cms\``);
    await queryRunner.query(`DROP INDEX \`IDX_29b7f30f5cacfd369a34125a98\` ON \`crw_cms\``);
    await queryRunner.query(`DROP INDEX \`IDX_35aee121b80f1702414cd3d86a\` ON \`crw_cms\``);
    await queryRunner.query(`DROP TABLE \`crw_cms\``);
    await queryRunner.query(`DROP INDEX \`IDX_854e20470498807068e94d87a8\` ON \`crw_attribute_to_product\``);
    await queryRunner.query(`DROP INDEX \`IDX_d4292415b7431d518278318057\` ON \`crw_attribute_to_product\``);
    await queryRunner.query(`DROP INDEX \`IDX_6a9b506859de7cc2ac65414ec9\` ON \`crw_attribute_to_product\``);
    await queryRunner.query(`DROP INDEX \`IDX_533b299ee136f75e261be4ebcf\` ON \`crw_attribute_to_product\``);
    await queryRunner.query(`DROP TABLE \`crw_attribute_to_product\``);
    await queryRunner.query(`DROP INDEX \`IDX_404785f00e4d88df4fa5783830\` ON \`crw_product\``);
    await queryRunner.query(`DROP INDEX \`IDX_77dc2abc46299b49ead89048d4\` ON \`crw_product\``);
    await queryRunner.query(`DROP INDEX \`IDX_5adfdd26419d9b737b683a8c65\` ON \`crw_product\``);
    await queryRunner.query(`DROP INDEX \`IDX_c717d9265ea3490790ee35edcd\` ON \`crw_product\``);
    await queryRunner.query(`DROP INDEX \`IDX_fbee175d8049460160e35a36ba\` ON \`crw_product\``);
    await queryRunner.query(`DROP INDEX \`IDX_a4383ddcc0498cfacd641f9cf8\` ON \`crw_product\``);
    await queryRunner.query(`DROP INDEX \`IDX_c07a670f3308a2db7824d76d6a\` ON \`crw_product\``);
    await queryRunner.query(`DROP INDEX \`IDX_e734039ba75ee043d3c61466de\` ON \`crw_product\``);
    await queryRunner.query(`DROP INDEX \`IDX_519eaf50959bea415509872bb9\` ON \`crw_product\``);
    await queryRunner.query(`DROP INDEX \`IDX_a51cbca1c3ed52d289104a4029\` ON \`crw_product\``);
    await queryRunner.query(`DROP TABLE \`crw_product\``);
    await queryRunner.query(`DROP INDEX \`IDX_2fa3845bbaf6607041282074f3\` ON \`crw_product_review\``);
    await queryRunner.query(`DROP INDEX \`IDX_b096b1be8dd42fe22ddc88821d\` ON \`crw_product_review\``);
    await queryRunner.query(`DROP INDEX \`IDX_dc5af49e3e348deae17df11497\` ON \`crw_product_review\``);
    await queryRunner.query(`DROP INDEX \`IDX_399b21eccdf612065456fb2610\` ON \`crw_product_review\``);
    await queryRunner.query(`DROP INDEX \`IDX_c1cdd15bc1a00fb7500146d9cd\` ON \`crw_product_review\``);
    await queryRunner.query(`DROP INDEX \`IDX_70465de7e17c6e1c31077c01e4\` ON \`crw_product_review\``);
    await queryRunner.query(`DROP INDEX \`IDX_487be848a7b34339aec3524e22\` ON \`crw_product_review\``);
    await queryRunner.query(`DROP INDEX \`IDX_282a9f102f8f653176677fef08\` ON \`crw_product_review\``);
    await queryRunner.query(`DROP INDEX \`IDX_c2f533935056c7f29553b6e19a\` ON \`crw_product_review\``);
    await queryRunner.query(`DROP TABLE \`crw_product_review\``);
    await queryRunner.query(`DROP INDEX \`IDX_273d34ee465b63376bead18bbf\` ON \`crw_product_category\``);
    await queryRunner.query(`DROP INDEX \`IDX_2a1e7d159e9a000b09d5cb70f4\` ON \`crw_product_category\``);
    await queryRunner.query(`DROP INDEX \`IDX_2d6326bee97904d86e512225ee\` ON \`crw_product_category\``);
    await queryRunner.query(`DROP INDEX \`IDX_3121c25318b5eaab5d51aba6d9\` ON \`crw_product_category\``);
    await queryRunner.query(`DROP TABLE \`crw_product_category\``);
    await queryRunner.query(`DROP INDEX \`IDX_c33ea052760e97d0de3c7cc8b5\` ON \`crw_product_category_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_f27e3267cdc21478c61e42bb88\` ON \`crw_product_category_meta\``);
    await queryRunner.query(`DROP TABLE \`crw_product_category_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_27954465979670837be4d63fc0\` ON \`crw_product_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_30673a2af77862cdf70c0676ce\` ON \`crw_product_meta\``);
    await queryRunner.query(`DROP TABLE \`crw_product_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_54086f22f96038e46d3b2b512c\` ON \`crw_attribute_value\``);
    await queryRunner.query(`DROP INDEX \`IDX_383d029711cbe14d2daa4c10cb\` ON \`crw_attribute_value\``);
    await queryRunner.query(`DROP INDEX \`IDX_d6645c2ed51e531f3f85e71f39\` ON \`crw_attribute_value\``);
    await queryRunner.query(`DROP INDEX \`IDX_4645313d5d1839bc27520ba3af\` ON \`crw_attribute_value\``);
    await queryRunner.query(`DROP INDEX \`IDX_23157f74583e1afa224da8e11f\` ON \`crw_attribute_value\``);
    await queryRunner.query(`DROP TABLE \`crw_attribute_value\``);
    await queryRunner.query(`DROP INDEX \`IDX_21d04deefef2e9d62ed19ba759\` ON \`crw_attribute\``);
    await queryRunner.query(`DROP INDEX \`IDX_695c3d64e2b63723cfe3c046c7\` ON \`crw_attribute\``);
    await queryRunner.query(`DROP INDEX \`IDX_53dcf0d02fa3d06e1e68790cff\` ON \`crw_attribute\``);
    await queryRunner.query(`DROP INDEX \`IDX_8ef1078c7f634d29bfa7970d4a\` ON \`crw_attribute\``);
    await queryRunner.query(`DROP TABLE \`crw_attribute\``);
    await queryRunner.query(`DROP INDEX \`IDX_cfc226f441aa035681ca94d791\` ON \`crw_attribute_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_bbdf61b39e061e316700b803b2\` ON \`crw_attribute_meta\``);
    await queryRunner.query(`DROP TABLE \`crw_attribute_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_b1fb7b510a52f67bb8bbc02b80\` ON \`crw_base_entity_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_3d0d518265cf6018bf3e488f30\` ON \`crw_base_entity_meta\``);
    await queryRunner.query(`DROP TABLE \`crw_base_entity_meta\``);
    await queryRunner.query(`DROP INDEX \`IDX_33d156210ae42177f24eb55b52\` ON \`crw_base_page_entity\``);
    await queryRunner.query(`DROP INDEX \`IDX_844fa3c3d939e6239a0db732c6\` ON \`crw_base_page_entity\``);
    await queryRunner.query(`DROP INDEX \`IDX_a116d8b9d2048f023d19efe688\` ON \`crw_base_page_entity\``);
    await queryRunner.query(`DROP TABLE \`crw_base_page_entity\``);
  }
};
