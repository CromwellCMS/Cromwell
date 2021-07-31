const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class init1627750299606 {
    name = 'init1627750299606'

    async up(queryRunner) {
        await queryRunner.query("CREATE TABLE `crw_base_page_entity` (`id` int NOT NULL AUTO_INCREMENT, `slug` varchar(255) NULL, `pageTitle` varchar(255) NULL, `pageDescription` varchar(255) NULL, `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isEnabled` tinyint NULL DEFAULT 1, UNIQUE INDEX `IDX_33d156210ae42177f24eb55b52` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_attribute` (`id` int NOT NULL AUTO_INCREMENT, `slug` varchar(255) NULL, `pageTitle` varchar(255) NULL, `pageDescription` varchar(255) NULL, `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isEnabled` tinyint NULL DEFAULT 1, `key` varchar(255) NOT NULL, `valuesJSON` text NULL, `type` varchar(255) NOT NULL, `icon` varchar(300) NULL, `required` tinyint NULL, UNIQUE INDEX `IDX_21d04deefef2e9d62ed19ba759` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_cms` (`id` int NOT NULL AUTO_INCREMENT, `slug` varchar(255) NULL, `pageTitle` varchar(255) NULL, `pageDescription` varchar(255) NULL, `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isEnabled` tinyint NULL DEFAULT 1, `themeName` varchar(255) NOT NULL, `protocol` varchar(255) NULL, `defaultPageSize` int NULL, `timezone` int NULL, `language` varchar(255) NULL, `favicon` varchar(300) NULL, `logo` varchar(300) NULL, `headHtml` text NULL, `footerHtml` text NULL, `defaultShippingPrice` float NULL, `_currencies` text NULL, `version` varchar(255) NULL, `versions` varchar(2000) NULL, `installed` tinyint NULL, `beta` tinyint NULL, `smtpConnectionString` varchar(400) NULL, `sendFromEmail` varchar(255) NULL, `isUpdating` tinyint NULL, `_adminSettings` text NULL, UNIQUE INDEX `IDX_45a249e9f534b6af909ffedf0d` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_order` (`id` int NOT NULL AUTO_INCREMENT, `slug` varchar(255) NULL, `pageTitle` varchar(255) NULL, `pageDescription` varchar(255) NULL, `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isEnabled` tinyint NULL DEFAULT 1, `status` varchar(255) NULL, `cart` text NULL, `orderTotalPrice` float NULL, `cartTotalPrice` float NULL, `cartOldTotalPrice` float NULL, `shippingPrice` float NULL, `totalQnt` float NULL, `userId` varchar(255) NULL, `customerName` varchar(255) NULL, `customerPhone` varchar(255) NULL, `customerEmail` varchar(255) NULL, `customerAddress` varchar(255) NULL, `shippingMethod` varchar(255) NULL, `paymentMethod` varchar(255) NULL, `customerComment` varchar(255) NULL, `currency` varchar(255) NULL, INDEX `IDX_56caac5bbc2683720ddd655a23` (`status`), INDEX `IDX_86c22318de90222b57a2f0ac90` (`userId`), INDEX `IDX_a71afe78a44fdebe245d06c0fb` (`customerName`), INDEX `IDX_8bb01ee9a429f70390bbedbaf6` (`customerPhone`), INDEX `IDX_0d115ee42c627f4c5f5ea6d12a` (`customerEmail`), UNIQUE INDEX `IDX_7a2428bdc18f7abd3758570668` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_page_stats` (`id` int NOT NULL AUTO_INCREMENT, `pageRoute` varchar(255) NOT NULL, `views` int NULL, `productSlug` varchar(255) NULL, `categorySlug` varchar(255) NULL, `postSlug` varchar(255) NULL, `tagSlug` varchar(255) NULL, `pageId` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_plugin` (`id` int NOT NULL AUTO_INCREMENT, `slug` varchar(255) NULL, `pageTitle` varchar(255) NULL, `pageDescription` varchar(255) NULL, `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isEnabled` tinyint NULL DEFAULT 1, `name` varchar(255) NOT NULL, `version` varchar(255) NULL, `title` varchar(255) NULL, `isInstalled` tinyint NOT NULL, `hasAdminBundle` tinyint NULL, `settings` text NULL, `defaultSettings` text NULL, `moduleInfo` text NULL, `isUpdating` tinyint NULL, UNIQUE INDEX `IDX_067de3d2c7d9e0e6fc733c7ba5` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_post_comment` (`id` int NOT NULL AUTO_INCREMENT, `slug` varchar(255) NULL, `pageTitle` varchar(255) NULL, `pageDescription` varchar(255) NULL, `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isEnabled` tinyint NULL DEFAULT 1, `postId` int NOT NULL, `title` varchar(255) NULL, `comment` text NULL, `userEmail` varchar(255) NULL, `userName` varchar(255) NULL, `userId` varchar(255) NULL, `approved` tinyint NULL, INDEX `IDX_787534d5ddf971c1b85d99c88c` (`postId`), INDEX `IDX_16527a7e9f22a68a274e61d6da` (`userEmail`), INDEX `IDX_cb0a2cf3605d77131907fb4664` (`userId`), UNIQUE INDEX `IDX_0c41e89299843ea6cd5bb1e10b` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_tag` (`id` int NOT NULL AUTO_INCREMENT, `slug` varchar(255) NULL, `pageTitle` varchar(255) NULL, `pageDescription` varchar(255) NULL, `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isEnabled` tinyint NULL DEFAULT 1, `name` varchar(255) NOT NULL, `color` varchar(255) NULL, `image` varchar(255) NULL, `description` text NULL, `descriptionDelta` text NULL, UNIQUE INDEX `IDX_3ad1ae94ac65ac5cf6ef4a97fd` (`slug`), UNIQUE INDEX `IDX_ecaa69a0357666eebdd48c8c75` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_post` (`id` int NOT NULL AUTO_INCREMENT, `slug` varchar(255) NULL, `pageTitle` varchar(255) NULL, `pageDescription` varchar(255) NULL, `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isEnabled` tinyint NULL DEFAULT 1, `title` varchar(255) NULL, `authorId` varchar(255) NOT NULL, `content` text NULL, `delta` text NULL, `excerpt` varchar(5000) NULL, `mainImage` varchar(300) NULL, `readTime` varchar(255) NULL, `published` tinyint NULL, `publishDate` datetime NULL, `featured` tinyint NULL, INDEX `IDX_e47953e4571dce4050c9524443` (`title`), INDEX `IDX_35c1445265a8d5362e06167ae3` (`authorId`), INDEX `IDX_8d98eb30db4dfb464ce54c1957` (`published`), INDEX `IDX_0977d4805adadb696f735445ee` (`featured`), UNIQUE INDEX `IDX_29f14d08659ef8a3230e244708` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_product_category` (`id` int NOT NULL AUTO_INCREMENT, `slug` varchar(255) NULL, `pageTitle` varchar(255) NULL, `pageDescription` varchar(255) NULL, `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isEnabled` tinyint NULL DEFAULT 1, `name` varchar(255) NOT NULL, `mainImage` varchar(300) NULL, `description` text NULL, `descriptionDelta` text NULL, `parentId` int NULL, UNIQUE INDEX `IDX_273d34ee465b63376bead18bbf` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_product_review` (`id` int NOT NULL AUTO_INCREMENT, `slug` varchar(255) NULL, `pageTitle` varchar(255) NULL, `pageDescription` varchar(255) NULL, `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isEnabled` tinyint NULL DEFAULT 1, `productId` int NOT NULL, `title` varchar(255) NULL, `description` text NULL, `rating` float NULL, `userEmail` varchar(255) NULL, `userName` varchar(255) NULL, `userId` varchar(255) NULL, `approved` tinyint NULL, INDEX `IDX_487be848a7b34339aec3524e22` (`productId`), INDEX `IDX_c1cdd15bc1a00fb7500146d9cd` (`rating`), INDEX `IDX_399b21eccdf612065456fb2610` (`userEmail`), INDEX `IDX_dc5af49e3e348deae17df11497` (`userId`), INDEX `IDX_b096b1be8dd42fe22ddc88821d` (`approved`), UNIQUE INDEX `IDX_2fa3845bbaf6607041282074f3` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_product` (`id` int NOT NULL AUTO_INCREMENT, `slug` varchar(255) NULL, `pageTitle` varchar(255) NULL, `pageDescription` varchar(255) NULL, `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isEnabled` tinyint NULL DEFAULT 1, `name` varchar(255) NULL, `price` float NULL, `oldPrice` float NULL, `sku` varchar(255) NULL, `mainImage` varchar(300) NULL, `images` text NULL, `description` text NULL, `descriptionDelta` text NULL, `attributesJSON` text NULL, `averageRating` decimal NULL, `reviewsCount` int NULL, INDEX `IDX_e734039ba75ee043d3c61466de` (`name`), INDEX `IDX_a4383ddcc0498cfacd641f9cf8` (`price`), INDEX `IDX_c717d9265ea3490790ee35edcd` (`sku`), INDEX `IDX_ce9152d8ef22b16ce86a6e0fd8` (`attributesJSON`), UNIQUE INDEX `IDX_404785f00e4d88df4fa5783830` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_theme` (`id` int NOT NULL AUTO_INCREMENT, `slug` varchar(255) NULL, `pageTitle` varchar(255) NULL, `pageDescription` varchar(255) NULL, `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isEnabled` tinyint NULL DEFAULT 1, `name` varchar(255) NOT NULL, `version` varchar(255) NULL, `title` varchar(255) NULL, `isInstalled` tinyint NOT NULL, `hasAdminBundle` tinyint NULL, `settings` text NULL, `defaultSettings` text NULL, `moduleInfo` text NULL, `isUpdating` tinyint NULL, UNIQUE INDEX `IDX_05d0c5a03358df4a5fc355eb7f` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_user` (`id` int NOT NULL AUTO_INCREMENT, `slug` varchar(255) NULL, `pageTitle` varchar(255) NULL, `pageDescription` varchar(255) NULL, `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `isEnabled` tinyint NULL DEFAULT 1, `fullName` varchar(255) NULL, `email` varchar(255) NULL, `avatar` varchar(255) NULL, `bio` varchar(6000) NULL, `role` varchar(255) NULL, `address` varchar(1000) NULL, `phone` varchar(255) NULL, `password` varchar(255) NOT NULL, `refreshToken` varchar(500) NULL, `resetPasswordCode` varchar(255) NULL, `resetPasswordDate` datetime NULL, INDEX `IDX_0537e4a35e2b1842afc531deab` (`fullName`), INDEX `IDX_850a536df6641e90872f905e74` (`role`), INDEX `IDX_644eed41dbcadfe2e3e634ba84` (`phone`), UNIQUE INDEX `IDX_86fcd952549ae797ab020043b2` (`slug`), UNIQUE INDEX `IDX_4544ef20d7756aad6b7a49d813` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_post_tags_tag` (`postId` int NOT NULL, `tagId` int NOT NULL, INDEX `IDX_f24f47df26e67c493b68bfc75b` (`postId`), INDEX `IDX_6c786f2afb686050d8233fdc6e` (`tagId`), PRIMARY KEY (`postId`, `tagId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_product_categories_product_category` (`productId` int NOT NULL, `productCategoryId` int NOT NULL, INDEX `IDX_8056740044bde85c6535e4cc6c` (`productId`), INDEX `IDX_f4f41beb6142f70af17b37ff50` (`productCategoryId`), PRIMARY KEY (`productId`, `productCategoryId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crw_product_category_closure` (`id_ancestor` int NOT NULL, `id_descendant` int NOT NULL, INDEX `IDX_9463c9a5893b1efb969e9a21c5` (`id_ancestor`), INDEX `IDX_bc8936d152e18bc99150472594` (`id_descendant`), PRIMARY KEY (`id_ancestor`, `id_descendant`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `crw_post_comment` ADD CONSTRAINT `FK_787534d5ddf971c1b85d99c88c3` FOREIGN KEY (`postId`) REFERENCES `crw_post`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `crw_product_category` ADD CONSTRAINT `FK_e7959ee49453ac5342ed33c2f0f` FOREIGN KEY (`parentId`) REFERENCES `crw_product_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `crw_product_review` ADD CONSTRAINT `FK_487be848a7b34339aec3524e221` FOREIGN KEY (`productId`) REFERENCES `crw_product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `crw_post_tags_tag` ADD CONSTRAINT `FK_f24f47df26e67c493b68bfc75bb` FOREIGN KEY (`postId`) REFERENCES `crw_post`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `crw_post_tags_tag` ADD CONSTRAINT `FK_6c786f2afb686050d8233fdc6e7` FOREIGN KEY (`tagId`) REFERENCES `crw_tag`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `crw_product_categories_product_category` ADD CONSTRAINT `FK_8056740044bde85c6535e4cc6c9` FOREIGN KEY (`productId`) REFERENCES `crw_product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `crw_product_categories_product_category` ADD CONSTRAINT `FK_f4f41beb6142f70af17b37ff50f` FOREIGN KEY (`productCategoryId`) REFERENCES `crw_product_category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `crw_product_category_closure` ADD CONSTRAINT `FK_9463c9a5893b1efb969e9a21c59` FOREIGN KEY (`id_ancestor`) REFERENCES `crw_product_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `crw_product_category_closure` ADD CONSTRAINT `FK_bc8936d152e18bc991504725944` FOREIGN KEY (`id_descendant`) REFERENCES `crw_product_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    async down(queryRunner) {
        await queryRunner.query("ALTER TABLE `crw_product_category_closure` DROP FOREIGN KEY `FK_bc8936d152e18bc991504725944`");
        await queryRunner.query("ALTER TABLE `crw_product_category_closure` DROP FOREIGN KEY `FK_9463c9a5893b1efb969e9a21c59`");
        await queryRunner.query("ALTER TABLE `crw_product_categories_product_category` DROP FOREIGN KEY `FK_f4f41beb6142f70af17b37ff50f`");
        await queryRunner.query("ALTER TABLE `crw_product_categories_product_category` DROP FOREIGN KEY `FK_8056740044bde85c6535e4cc6c9`");
        await queryRunner.query("ALTER TABLE `crw_post_tags_tag` DROP FOREIGN KEY `FK_6c786f2afb686050d8233fdc6e7`");
        await queryRunner.query("ALTER TABLE `crw_post_tags_tag` DROP FOREIGN KEY `FK_f24f47df26e67c493b68bfc75bb`");
        await queryRunner.query("ALTER TABLE `crw_product_review` DROP FOREIGN KEY `FK_487be848a7b34339aec3524e221`");
        await queryRunner.query("ALTER TABLE `crw_product_category` DROP FOREIGN KEY `FK_e7959ee49453ac5342ed33c2f0f`");
        await queryRunner.query("ALTER TABLE `crw_post_comment` DROP FOREIGN KEY `FK_787534d5ddf971c1b85d99c88c3`");
        await queryRunner.query("DROP INDEX `IDX_bc8936d152e18bc99150472594` ON `crw_product_category_closure`");
        await queryRunner.query("DROP INDEX `IDX_9463c9a5893b1efb969e9a21c5` ON `crw_product_category_closure`");
        await queryRunner.query("DROP TABLE `crw_product_category_closure`");
        await queryRunner.query("DROP INDEX `IDX_f4f41beb6142f70af17b37ff50` ON `crw_product_categories_product_category`");
        await queryRunner.query("DROP INDEX `IDX_8056740044bde85c6535e4cc6c` ON `crw_product_categories_product_category`");
        await queryRunner.query("DROP TABLE `crw_product_categories_product_category`");
        await queryRunner.query("DROP INDEX `IDX_6c786f2afb686050d8233fdc6e` ON `crw_post_tags_tag`");
        await queryRunner.query("DROP INDEX `IDX_f24f47df26e67c493b68bfc75b` ON `crw_post_tags_tag`");
        await queryRunner.query("DROP TABLE `crw_post_tags_tag`");
        await queryRunner.query("DROP INDEX `IDX_4544ef20d7756aad6b7a49d813` ON `crw_user`");
        await queryRunner.query("DROP INDEX `IDX_86fcd952549ae797ab020043b2` ON `crw_user`");
        await queryRunner.query("DROP INDEX `IDX_644eed41dbcadfe2e3e634ba84` ON `crw_user`");
        await queryRunner.query("DROP INDEX `IDX_850a536df6641e90872f905e74` ON `crw_user`");
        await queryRunner.query("DROP INDEX `IDX_0537e4a35e2b1842afc531deab` ON `crw_user`");
        await queryRunner.query("DROP TABLE `crw_user`");
        await queryRunner.query("DROP INDEX `IDX_05d0c5a03358df4a5fc355eb7f` ON `crw_theme`");
        await queryRunner.query("DROP TABLE `crw_theme`");
        await queryRunner.query("DROP INDEX `IDX_404785f00e4d88df4fa5783830` ON `crw_product`");
        await queryRunner.query("DROP INDEX `IDX_ce9152d8ef22b16ce86a6e0fd8` ON `crw_product`");
        await queryRunner.query("DROP INDEX `IDX_c717d9265ea3490790ee35edcd` ON `crw_product`");
        await queryRunner.query("DROP INDEX `IDX_a4383ddcc0498cfacd641f9cf8` ON `crw_product`");
        await queryRunner.query("DROP INDEX `IDX_e734039ba75ee043d3c61466de` ON `crw_product`");
        await queryRunner.query("DROP TABLE `crw_product`");
        await queryRunner.query("DROP INDEX `IDX_2fa3845bbaf6607041282074f3` ON `crw_product_review`");
        await queryRunner.query("DROP INDEX `IDX_b096b1be8dd42fe22ddc88821d` ON `crw_product_review`");
        await queryRunner.query("DROP INDEX `IDX_dc5af49e3e348deae17df11497` ON `crw_product_review`");
        await queryRunner.query("DROP INDEX `IDX_399b21eccdf612065456fb2610` ON `crw_product_review`");
        await queryRunner.query("DROP INDEX `IDX_c1cdd15bc1a00fb7500146d9cd` ON `crw_product_review`");
        await queryRunner.query("DROP INDEX `IDX_487be848a7b34339aec3524e22` ON `crw_product_review`");
        await queryRunner.query("DROP TABLE `crw_product_review`");
        await queryRunner.query("DROP INDEX `IDX_273d34ee465b63376bead18bbf` ON `crw_product_category`");
        await queryRunner.query("DROP TABLE `crw_product_category`");
        await queryRunner.query("DROP INDEX `IDX_29f14d08659ef8a3230e244708` ON `crw_post`");
        await queryRunner.query("DROP INDEX `IDX_0977d4805adadb696f735445ee` ON `crw_post`");
        await queryRunner.query("DROP INDEX `IDX_8d98eb30db4dfb464ce54c1957` ON `crw_post`");
        await queryRunner.query("DROP INDEX `IDX_35c1445265a8d5362e06167ae3` ON `crw_post`");
        await queryRunner.query("DROP INDEX `IDX_e47953e4571dce4050c9524443` ON `crw_post`");
        await queryRunner.query("DROP TABLE `crw_post`");
        await queryRunner.query("DROP INDEX `IDX_ecaa69a0357666eebdd48c8c75` ON `crw_tag`");
        await queryRunner.query("DROP INDEX `IDX_3ad1ae94ac65ac5cf6ef4a97fd` ON `crw_tag`");
        await queryRunner.query("DROP TABLE `crw_tag`");
        await queryRunner.query("DROP INDEX `IDX_0c41e89299843ea6cd5bb1e10b` ON `crw_post_comment`");
        await queryRunner.query("DROP INDEX `IDX_cb0a2cf3605d77131907fb4664` ON `crw_post_comment`");
        await queryRunner.query("DROP INDEX `IDX_16527a7e9f22a68a274e61d6da` ON `crw_post_comment`");
        await queryRunner.query("DROP INDEX `IDX_787534d5ddf971c1b85d99c88c` ON `crw_post_comment`");
        await queryRunner.query("DROP TABLE `crw_post_comment`");
        await queryRunner.query("DROP INDEX `IDX_067de3d2c7d9e0e6fc733c7ba5` ON `crw_plugin`");
        await queryRunner.query("DROP TABLE `crw_plugin`");
        await queryRunner.query("DROP TABLE `crw_page_stats`");
        await queryRunner.query("DROP INDEX `IDX_7a2428bdc18f7abd3758570668` ON `crw_order`");
        await queryRunner.query("DROP INDEX `IDX_0d115ee42c627f4c5f5ea6d12a` ON `crw_order`");
        await queryRunner.query("DROP INDEX `IDX_8bb01ee9a429f70390bbedbaf6` ON `crw_order`");
        await queryRunner.query("DROP INDEX `IDX_a71afe78a44fdebe245d06c0fb` ON `crw_order`");
        await queryRunner.query("DROP INDEX `IDX_86c22318de90222b57a2f0ac90` ON `crw_order`");
        await queryRunner.query("DROP INDEX `IDX_56caac5bbc2683720ddd655a23` ON `crw_order`");
        await queryRunner.query("DROP TABLE `crw_order`");
        await queryRunner.query("DROP INDEX `IDX_45a249e9f534b6af909ffedf0d` ON `crw_cms`");
        await queryRunner.query("DROP TABLE `crw_cms`");
        await queryRunner.query("DROP INDEX `IDX_21d04deefef2e9d62ed19ba759` ON `crw_attribute`");
        await queryRunner.query("DROP TABLE `crw_attribute`");
        await queryRunner.query("DROP INDEX `IDX_33d156210ae42177f24eb55b52` ON `crw_base_page_entity`");
        await queryRunner.query("DROP TABLE `crw_base_page_entity`");
    }
}
