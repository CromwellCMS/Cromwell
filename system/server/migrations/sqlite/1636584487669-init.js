const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class init1636584487669 {
  name = 'init1636584487669';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "crw_base_page_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), CONSTRAINT "UQ_33d156210ae42177f24eb55b524" UNIQUE ("slug"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_a116d8b9d2048f023d19efe688" ON "crw_base_page_entity" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_844fa3c3d939e6239a0db732c6" ON "crw_base_page_entity" ("updateDate") `);
    await queryRunner.query(
      `CREATE TABLE "crw_base_entity_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_3d0d518265cf6018bf3e488f30" ON "crw_base_entity_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_b1fb7b510a52f67bb8bbc02b80" ON "crw_base_entity_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_attribute_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_bbdf61b39e061e316700b803b2" ON "crw_attribute_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_cfc226f441aa035681ca94d791" ON "crw_attribute_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_attribute" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "key" varchar(255) NOT NULL, "title" varchar(255), "type" varchar(255), "icon" varchar(400), "required" boolean, CONSTRAINT "UQ_21d04deefef2e9d62ed19ba759a" UNIQUE ("slug"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_8ef1078c7f634d29bfa7970d4a" ON "crw_attribute" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_53dcf0d02fa3d06e1e68790cff" ON "crw_attribute" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_695c3d64e2b63723cfe3c046c7" ON "crw_attribute" ("key") `);
    await queryRunner.query(
      `CREATE TABLE "crw_attribute_value" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "attributeId" integer NOT NULL, "key" varchar(255) NOT NULL, "value" varchar(255), "title" varchar(255), "icon" varchar(400), CONSTRAINT "UQ_54086f22f96038e46d3b2b512c3" UNIQUE ("slug"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_23157f74583e1afa224da8e11f" ON "crw_attribute_value" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_4645313d5d1839bc27520ba3af" ON "crw_attribute_value" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_d6645c2ed51e531f3f85e71f39" ON "crw_attribute_value" ("attributeId") `);
    await queryRunner.query(`CREATE INDEX "IDX_383d029711cbe14d2daa4c10cb" ON "crw_attribute_value" ("key") `);
    await queryRunner.query(
      `CREATE TABLE "crw_product_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_30673a2af77862cdf70c0676ce" ON "crw_product_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_27954465979670837be4d63fc0" ON "crw_product_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_product_category_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_f27e3267cdc21478c61e42bb88" ON "crw_product_category_meta" ("key") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_c33ea052760e97d0de3c7cc8b5" ON "crw_product_category_meta" ("shortValue") `,
    );
    await queryRunner.query(
      `CREATE TABLE "crw_product_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "name" varchar(255), "mainImage" varchar(400), "description" text, "descriptionDelta" text, "parentId" integer, CONSTRAINT "UQ_273d34ee465b63376bead18bbf2" UNIQUE ("slug"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_3121c25318b5eaab5d51aba6d9" ON "crw_product_category" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_2d6326bee97904d86e512225ee" ON "crw_product_category" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_2a1e7d159e9a000b09d5cb70f4" ON "crw_product_category" ("name") `);
    await queryRunner.query(
      `CREATE TABLE "crw_product_review" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "productId" integer, "title" varchar(255), "description" text, "rating" float, "userEmail" varchar(255), "userName" varchar(255), "userId" varchar(255), "approved" boolean, CONSTRAINT "UQ_2fa3845bbaf6607041282074f3a" UNIQUE ("slug"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_c2f533935056c7f29553b6e19a" ON "crw_product_review" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_282a9f102f8f653176677fef08" ON "crw_product_review" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_487be848a7b34339aec3524e22" ON "crw_product_review" ("productId") `);
    await queryRunner.query(`CREATE INDEX "IDX_70465de7e17c6e1c31077c01e4" ON "crw_product_review" ("title") `);
    await queryRunner.query(`CREATE INDEX "IDX_c1cdd15bc1a00fb7500146d9cd" ON "crw_product_review" ("rating") `);
    await queryRunner.query(`CREATE INDEX "IDX_399b21eccdf612065456fb2610" ON "crw_product_review" ("userEmail") `);
    await queryRunner.query(`CREATE INDEX "IDX_dc5af49e3e348deae17df11497" ON "crw_product_review" ("userId") `);
    await queryRunner.query(`CREATE INDEX "IDX_b096b1be8dd42fe22ddc88821d" ON "crw_product_review" ("approved") `);
    await queryRunner.query(
      `CREATE TABLE "crw_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "name" varchar(255), "mainCategoryId" integer, "price" float, "oldPrice" float, "sku" varchar(255), "mainImage" varchar(400), "images" text, "stockAmount" integer, "stockStatus" varchar(255), "description" text, "descriptionDelta" text, "averageRating" decimal, "reviewsCount" integer, CONSTRAINT "UQ_404785f00e4d88df4fa5783830b" UNIQUE ("slug"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_a51cbca1c3ed52d289104a4029" ON "crw_product" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_519eaf50959bea415509872bb9" ON "crw_product" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_e734039ba75ee043d3c61466de" ON "crw_product" ("name") `);
    await queryRunner.query(`CREATE INDEX "IDX_c07a670f3308a2db7824d76d6a" ON "crw_product" ("mainCategoryId") `);
    await queryRunner.query(`CREATE INDEX "IDX_a4383ddcc0498cfacd641f9cf8" ON "crw_product" ("price") `);
    await queryRunner.query(`CREATE INDEX "IDX_fbee175d8049460160e35a36ba" ON "crw_product" ("oldPrice") `);
    await queryRunner.query(`CREATE INDEX "IDX_c717d9265ea3490790ee35edcd" ON "crw_product" ("sku") `);
    await queryRunner.query(`CREATE INDEX "IDX_5adfdd26419d9b737b683a8c65" ON "crw_product" ("stockAmount") `);
    await queryRunner.query(`CREATE INDEX "IDX_77dc2abc46299b49ead89048d4" ON "crw_product" ("stockStatus") `);
    await queryRunner.query(
      `CREATE TABLE "crw_attribute_to_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "productId" integer, "attributeValueId" integer, "key" varchar(255) NOT NULL, "value" varchar(255))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_533b299ee136f75e261be4ebcf" ON "crw_attribute_to_product" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6a9b506859de7cc2ac65414ec9" ON "crw_attribute_to_product" ("attributeValueId") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_d4292415b7431d518278318057" ON "crw_attribute_to_product" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_854e20470498807068e94d87a8" ON "crw_attribute_to_product" ("value") `);
    await queryRunner.query(
      `CREATE TABLE "crw_cms" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "_publicSettings" text, "_adminSettings" text, "_internalSettings" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_35aee121b80f1702414cd3d86a" ON "crw_cms" ("id") `);
    await queryRunner.query(`CREATE INDEX "IDX_29b7f30f5cacfd369a34125a98" ON "crw_cms" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_11992283fb607b2ce95106e243" ON "crw_cms" ("updateDate") `);
    await queryRunner.query(
      `CREATE TABLE "crw_custom_entity_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_f555082eae3d87f39ef5001997" ON "crw_custom_entity_meta" ("key") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_f33b5eacdc9c43019549184604" ON "crw_custom_entity_meta" ("shortValue") `,
    );
    await queryRunner.query(
      `CREATE TABLE "crw_custom_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "entityType" varchar(255) NOT NULL, "name" varchar(255), CONSTRAINT "UQ_ce619267281298b316ee8ad360b" UNIQUE ("slug"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_b6d68788b94c05e6c4ecb75378" ON "crw_custom_entity" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_31c31500e681c0075278fcb76b" ON "crw_custom_entity" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_cb3862e657eb6cf39e77241e82" ON "crw_custom_entity" ("entityType") `);
    await queryRunner.query(`CREATE INDEX "IDX_44e0f6581a291c3814140fc0e8" ON "crw_custom_entity" ("name") `);
    await queryRunner.query(
      `CREATE TABLE "crw_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "status" varchar(255), "cart" text, "orderTotalPrice" float, "cartTotalPrice" float, "cartOldTotalPrice" float, "shippingPrice" float, "totalQnt" float, "userId" integer, "customerName" varchar(255), "customerPhone" varchar(255), "customerEmail" varchar(255), "customerAddress" varchar(255), "shippingMethod" varchar(255), "paymentMethod" varchar(255), "customerComment" varchar(3000), "currency" varchar(255), "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')))`,
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
      `CREATE TABLE "crw_order_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_d35934d4a842f8dd8798969774" ON "crw_order_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_41e918d93c14cecfc1f809891a" ON "crw_order_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_post_comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "postId" integer, "title" varchar(400), "comment" text, "userEmail" varchar(255), "userName" varchar(255), "userId" integer, "approved" boolean, CONSTRAINT "UQ_0c41e89299843ea6cd5bb1e10b3" UNIQUE ("slug"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_2cdbb06f851e9b8b2872eb1b07" ON "crw_post_comment" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_d5ed51c984a9ff9b8ee7a515bb" ON "crw_post_comment" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_787534d5ddf971c1b85d99c88c" ON "crw_post_comment" ("postId") `);
    await queryRunner.query(`CREATE INDEX "IDX_16527a7e9f22a68a274e61d6da" ON "crw_post_comment" ("userEmail") `);
    await queryRunner.query(`CREATE INDEX "IDX_cb0a2cf3605d77131907fb4664" ON "crw_post_comment" ("userId") `);
    await queryRunner.query(
      `CREATE TABLE "crw_tag_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_f8c8425742699651cf5f7c12e0" ON "crw_tag_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_17920baaeed623ba12afefa4b2" ON "crw_tag_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_tag" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "name" varchar(255), "color" varchar(255), "image" varchar(255), "description" text, "descriptionDelta" text, CONSTRAINT "UQ_3ad1ae94ac65ac5cf6ef4a97fd4" UNIQUE ("slug"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_85d1613594ad8e9a0396922bb4" ON "crw_tag" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_ac25c70c54e0644d0ece40f1f1" ON "crw_tag" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_ecaa69a0357666eebdd48c8c75" ON "crw_tag" ("name") `);
    await queryRunner.query(
      `CREATE TABLE "crw_user_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_be55edbbdc5da3712ab5270b61" ON "crw_user_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_ac05041d8a345ef9bcf4df886c" ON "crw_user_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "fullName" varchar(255), "email" varchar(255), "avatar" varchar, "bio" text, "address" varchar(1000), "phone" varchar(255), "password" varchar(255) NOT NULL, "refreshTokens" varchar(5000), "resetPasswordCode" varchar(255), "resetPasswordDate" datetime, CONSTRAINT "UQ_86fcd952549ae797ab020043b23" UNIQUE ("slug"), CONSTRAINT "UQ_4544ef20d7756aad6b7a49d8133" UNIQUE ("email"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_aae8c723ca641247505d92aedc" ON "crw_user" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_82038b3a02bf4b55377a056d4e" ON "crw_user" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_0537e4a35e2b1842afc531deab" ON "crw_user" ("fullName") `);
    await queryRunner.query(`CREATE INDEX "IDX_user.entity_email" ON "crw_user" ("email") `);
    await queryRunner.query(`CREATE INDEX "IDX_644eed41dbcadfe2e3e634ba84" ON "crw_user" ("phone") `);
    await queryRunner.query(
      `CREATE TABLE "crw_post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "title" varchar(255), "authorId" integer, "content" text, "delta" text, "excerpt" varchar(5000), "mainImage" varchar(400), "readTime" varchar(255), "published" boolean, "publishDate" datetime, "featured" boolean, CONSTRAINT "UQ_29f14d08659ef8a3230e244708e" UNIQUE ("slug"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_ec3abbafac22f27f03f3ddeb67" ON "crw_post" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_b4056f8c22fa23bd54d854b866" ON "crw_post" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_e47953e4571dce4050c9524443" ON "crw_post" ("title") `);
    await queryRunner.query(`CREATE INDEX "IDX_35c1445265a8d5362e06167ae3" ON "crw_post" ("authorId") `);
    await queryRunner.query(`CREATE INDEX "IDX_8d98eb30db4dfb464ce54c1957" ON "crw_post" ("published") `);
    await queryRunner.query(`CREATE INDEX "IDX_0977d4805adadb696f735445ee" ON "crw_post" ("featured") `);
    await queryRunner.query(
      `CREATE TABLE "crw_post_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_a6e8f93e58953b3440e4ce8e97" ON "crw_post_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_f88f049ff16c909c2117a3b737" ON "crw_post_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_page_stats" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "pageRoute" varchar(255) NOT NULL, "pageName" varchar(255), "pageId" varchar(255), "views" integer, "slug" varchar(255), "entityType" varchar(255))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_b77d858a4e600256c226b71e7d" ON "crw_page_stats" ("slug") `);
    await queryRunner.query(`CREATE INDEX "IDX_1f6131609d99f50bc4da4b9333" ON "crw_page_stats" ("entityType") `);
    await queryRunner.query(
      `CREATE TABLE "crw_plugin" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "name" varchar(255) NOT NULL, "version" varchar(255), "title" varchar(255), "isInstalled" boolean NOT NULL, "hasAdminBundle" boolean, "settings" text, "defaultSettings" text, "moduleInfo" text, "isUpdating" boolean, CONSTRAINT "UQ_067de3d2c7d9e0e6fc733c7ba59" UNIQUE ("slug"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_9cb3bd0ef9e43cde320c123bff" ON "crw_plugin" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_363ec5f7b94386accb06dbbb4e" ON "crw_plugin" ("updateDate") `);
    await queryRunner.query(
      `CREATE TABLE "crw_theme" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "name" varchar(255) NOT NULL, "version" varchar, "title" varchar, "isInstalled" boolean NOT NULL, "hasAdminBundle" boolean, "settings" text, "defaultSettings" text, "moduleInfo" text, "isUpdating" boolean, CONSTRAINT "UQ_05d0c5a03358df4a5fc355eb7fc" UNIQUE ("slug"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_78cf29997948828f22da70514d" ON "crw_theme" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_a1a866ef4e58782a1e886a5bc8" ON "crw_theme" ("updateDate") `);
    await queryRunner.query(
      `CREATE TABLE "crw_product_categories_product_category" ("productId" integer NOT NULL, "productCategoryId" integer NOT NULL, PRIMARY KEY ("productId", "productCategoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8056740044bde85c6535e4cc6c" ON "crw_product_categories_product_category" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f4f41beb6142f70af17b37ff50" ON "crw_product_categories_product_category" ("productCategoryId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "crw_post_tags_tag" ("postId" integer NOT NULL, "tagId" integer NOT NULL, PRIMARY KEY ("postId", "tagId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_f24f47df26e67c493b68bfc75b" ON "crw_post_tags_tag" ("postId") `);
    await queryRunner.query(`CREATE INDEX "IDX_6c786f2afb686050d8233fdc6e" ON "crw_post_tags_tag" ("tagId") `);
    await queryRunner.query(
      `CREATE TABLE "crw_product_category_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, PRIMARY KEY ("id_ancestor", "id_descendant"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9463c9a5893b1efb969e9a21c5" ON "crw_product_category_closure" ("id_ancestor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bc8936d152e18bc99150472594" ON "crw_product_category_closure" ("id_descendant") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_bbdf61b39e061e316700b803b2"`);
    await queryRunner.query(`DROP INDEX "IDX_cfc226f441aa035681ca94d791"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_attribute_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL, CONSTRAINT "FK_b5e4e97e31370c47395b4a6edc1" FOREIGN KEY ("entityId") REFERENCES "crw_attribute" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_attribute_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "crw_attribute_meta"`,
    );
    await queryRunner.query(`DROP TABLE "crw_attribute_meta"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_attribute_meta" RENAME TO "crw_attribute_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_bbdf61b39e061e316700b803b2" ON "crw_attribute_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_cfc226f441aa035681ca94d791" ON "crw_attribute_meta" ("shortValue") `);
    await queryRunner.query(`DROP INDEX "IDX_23157f74583e1afa224da8e11f"`);
    await queryRunner.query(`DROP INDEX "IDX_4645313d5d1839bc27520ba3af"`);
    await queryRunner.query(`DROP INDEX "IDX_d6645c2ed51e531f3f85e71f39"`);
    await queryRunner.query(`DROP INDEX "IDX_383d029711cbe14d2daa4c10cb"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_attribute_value" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "attributeId" integer NOT NULL, "key" varchar(255) NOT NULL, "value" varchar(255), "title" varchar(255), "icon" varchar(400), CONSTRAINT "UQ_54086f22f96038e46d3b2b512c3" UNIQUE ("slug"), CONSTRAINT "FK_d6645c2ed51e531f3f85e71f396" FOREIGN KEY ("attributeId") REFERENCES "crw_attribute" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_attribute_value"("id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "attributeId", "key", "value", "title", "icon") SELECT "id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "attributeId", "key", "value", "title", "icon" FROM "crw_attribute_value"`,
    );
    await queryRunner.query(`DROP TABLE "crw_attribute_value"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_attribute_value" RENAME TO "crw_attribute_value"`);
    await queryRunner.query(`CREATE INDEX "IDX_23157f74583e1afa224da8e11f" ON "crw_attribute_value" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_4645313d5d1839bc27520ba3af" ON "crw_attribute_value" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_d6645c2ed51e531f3f85e71f39" ON "crw_attribute_value" ("attributeId") `);
    await queryRunner.query(`CREATE INDEX "IDX_383d029711cbe14d2daa4c10cb" ON "crw_attribute_value" ("key") `);
    await queryRunner.query(`DROP INDEX "IDX_30673a2af77862cdf70c0676ce"`);
    await queryRunner.query(`DROP INDEX "IDX_27954465979670837be4d63fc0"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_product_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL, CONSTRAINT "FK_05fc2d8b68b3833525d7c837c10" FOREIGN KEY ("entityId") REFERENCES "crw_product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_product_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "crw_product_meta"`,
    );
    await queryRunner.query(`DROP TABLE "crw_product_meta"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_product_meta" RENAME TO "crw_product_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_30673a2af77862cdf70c0676ce" ON "crw_product_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_27954465979670837be4d63fc0" ON "crw_product_meta" ("shortValue") `);
    await queryRunner.query(`DROP INDEX "IDX_f27e3267cdc21478c61e42bb88"`);
    await queryRunner.query(`DROP INDEX "IDX_c33ea052760e97d0de3c7cc8b5"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_product_category_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL, CONSTRAINT "FK_c850099194d3cd3a991634bc12d" FOREIGN KEY ("entityId") REFERENCES "crw_product_category" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_product_category_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "crw_product_category_meta"`,
    );
    await queryRunner.query(`DROP TABLE "crw_product_category_meta"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_product_category_meta" RENAME TO "crw_product_category_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_f27e3267cdc21478c61e42bb88" ON "crw_product_category_meta" ("key") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_c33ea052760e97d0de3c7cc8b5" ON "crw_product_category_meta" ("shortValue") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_3121c25318b5eaab5d51aba6d9"`);
    await queryRunner.query(`DROP INDEX "IDX_2d6326bee97904d86e512225ee"`);
    await queryRunner.query(`DROP INDEX "IDX_2a1e7d159e9a000b09d5cb70f4"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_product_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "name" varchar(255), "mainImage" varchar(400), "description" text, "descriptionDelta" text, "parentId" integer, CONSTRAINT "UQ_273d34ee465b63376bead18bbf2" UNIQUE ("slug"), CONSTRAINT "FK_e7959ee49453ac5342ed33c2f0f" FOREIGN KEY ("parentId") REFERENCES "crw_product_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_product_category"("id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "name", "mainImage", "description", "descriptionDelta", "parentId") SELECT "id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "name", "mainImage", "description", "descriptionDelta", "parentId" FROM "crw_product_category"`,
    );
    await queryRunner.query(`DROP TABLE "crw_product_category"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_product_category" RENAME TO "crw_product_category"`);
    await queryRunner.query(`CREATE INDEX "IDX_3121c25318b5eaab5d51aba6d9" ON "crw_product_category" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_2d6326bee97904d86e512225ee" ON "crw_product_category" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_2a1e7d159e9a000b09d5cb70f4" ON "crw_product_category" ("name") `);
    await queryRunner.query(`DROP INDEX "IDX_c2f533935056c7f29553b6e19a"`);
    await queryRunner.query(`DROP INDEX "IDX_282a9f102f8f653176677fef08"`);
    await queryRunner.query(`DROP INDEX "IDX_487be848a7b34339aec3524e22"`);
    await queryRunner.query(`DROP INDEX "IDX_70465de7e17c6e1c31077c01e4"`);
    await queryRunner.query(`DROP INDEX "IDX_c1cdd15bc1a00fb7500146d9cd"`);
    await queryRunner.query(`DROP INDEX "IDX_399b21eccdf612065456fb2610"`);
    await queryRunner.query(`DROP INDEX "IDX_dc5af49e3e348deae17df11497"`);
    await queryRunner.query(`DROP INDEX "IDX_b096b1be8dd42fe22ddc88821d"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_product_review" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "productId" integer, "title" varchar(255), "description" text, "rating" float, "userEmail" varchar(255), "userName" varchar(255), "userId" varchar(255), "approved" boolean, CONSTRAINT "UQ_2fa3845bbaf6607041282074f3a" UNIQUE ("slug"), CONSTRAINT "FK_487be848a7b34339aec3524e221" FOREIGN KEY ("productId") REFERENCES "crw_product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_product_review"("id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "productId", "title", "description", "rating", "userEmail", "userName", "userId", "approved") SELECT "id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "productId", "title", "description", "rating", "userEmail", "userName", "userId", "approved" FROM "crw_product_review"`,
    );
    await queryRunner.query(`DROP TABLE "crw_product_review"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_product_review" RENAME TO "crw_product_review"`);
    await queryRunner.query(`CREATE INDEX "IDX_c2f533935056c7f29553b6e19a" ON "crw_product_review" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_282a9f102f8f653176677fef08" ON "crw_product_review" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_487be848a7b34339aec3524e22" ON "crw_product_review" ("productId") `);
    await queryRunner.query(`CREATE INDEX "IDX_70465de7e17c6e1c31077c01e4" ON "crw_product_review" ("title") `);
    await queryRunner.query(`CREATE INDEX "IDX_c1cdd15bc1a00fb7500146d9cd" ON "crw_product_review" ("rating") `);
    await queryRunner.query(`CREATE INDEX "IDX_399b21eccdf612065456fb2610" ON "crw_product_review" ("userEmail") `);
    await queryRunner.query(`CREATE INDEX "IDX_dc5af49e3e348deae17df11497" ON "crw_product_review" ("userId") `);
    await queryRunner.query(`CREATE INDEX "IDX_b096b1be8dd42fe22ddc88821d" ON "crw_product_review" ("approved") `);
    await queryRunner.query(`DROP INDEX "IDX_533b299ee136f75e261be4ebcf"`);
    await queryRunner.query(`DROP INDEX "IDX_6a9b506859de7cc2ac65414ec9"`);
    await queryRunner.query(`DROP INDEX "IDX_d4292415b7431d518278318057"`);
    await queryRunner.query(`DROP INDEX "IDX_854e20470498807068e94d87a8"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_attribute_to_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "productId" integer, "attributeValueId" integer, "key" varchar(255) NOT NULL, "value" varchar(255), CONSTRAINT "FK_533b299ee136f75e261be4ebcf1" FOREIGN KEY ("productId") REFERENCES "crw_product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_6a9b506859de7cc2ac65414ec95" FOREIGN KEY ("attributeValueId") REFERENCES "crw_attribute_value" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_attribute_to_product"("id", "productId", "attributeValueId", "key", "value") SELECT "id", "productId", "attributeValueId", "key", "value" FROM "crw_attribute_to_product"`,
    );
    await queryRunner.query(`DROP TABLE "crw_attribute_to_product"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_attribute_to_product" RENAME TO "crw_attribute_to_product"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_533b299ee136f75e261be4ebcf" ON "crw_attribute_to_product" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6a9b506859de7cc2ac65414ec9" ON "crw_attribute_to_product" ("attributeValueId") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_d4292415b7431d518278318057" ON "crw_attribute_to_product" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_854e20470498807068e94d87a8" ON "crw_attribute_to_product" ("value") `);
    await queryRunner.query(`DROP INDEX "IDX_f555082eae3d87f39ef5001997"`);
    await queryRunner.query(`DROP INDEX "IDX_f33b5eacdc9c43019549184604"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_custom_entity_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL, CONSTRAINT "FK_9339113c97fb03140bf2765fc41" FOREIGN KEY ("entityId") REFERENCES "crw_custom_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_custom_entity_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "crw_custom_entity_meta"`,
    );
    await queryRunner.query(`DROP TABLE "crw_custom_entity_meta"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_custom_entity_meta" RENAME TO "crw_custom_entity_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_f555082eae3d87f39ef5001997" ON "crw_custom_entity_meta" ("key") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_f33b5eacdc9c43019549184604" ON "crw_custom_entity_meta" ("shortValue") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_d35934d4a842f8dd8798969774"`);
    await queryRunner.query(`DROP INDEX "IDX_41e918d93c14cecfc1f809891a"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_order_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL, CONSTRAINT "FK_5f0402c8bc745a0142da357102e" FOREIGN KEY ("entityId") REFERENCES "crw_order" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_order_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "crw_order_meta"`,
    );
    await queryRunner.query(`DROP TABLE "crw_order_meta"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_order_meta" RENAME TO "crw_order_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_d35934d4a842f8dd8798969774" ON "crw_order_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_41e918d93c14cecfc1f809891a" ON "crw_order_meta" ("shortValue") `);
    await queryRunner.query(`DROP INDEX "IDX_2cdbb06f851e9b8b2872eb1b07"`);
    await queryRunner.query(`DROP INDEX "IDX_d5ed51c984a9ff9b8ee7a515bb"`);
    await queryRunner.query(`DROP INDEX "IDX_787534d5ddf971c1b85d99c88c"`);
    await queryRunner.query(`DROP INDEX "IDX_16527a7e9f22a68a274e61d6da"`);
    await queryRunner.query(`DROP INDEX "IDX_cb0a2cf3605d77131907fb4664"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_post_comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "postId" integer, "title" varchar(400), "comment" text, "userEmail" varchar(255), "userName" varchar(255), "userId" integer, "approved" boolean, CONSTRAINT "UQ_0c41e89299843ea6cd5bb1e10b3" UNIQUE ("slug"), CONSTRAINT "FK_787534d5ddf971c1b85d99c88c3" FOREIGN KEY ("postId") REFERENCES "crw_post" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_post_comment"("id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "postId", "title", "comment", "userEmail", "userName", "userId", "approved") SELECT "id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "postId", "title", "comment", "userEmail", "userName", "userId", "approved" FROM "crw_post_comment"`,
    );
    await queryRunner.query(`DROP TABLE "crw_post_comment"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_post_comment" RENAME TO "crw_post_comment"`);
    await queryRunner.query(`CREATE INDEX "IDX_2cdbb06f851e9b8b2872eb1b07" ON "crw_post_comment" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_d5ed51c984a9ff9b8ee7a515bb" ON "crw_post_comment" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_787534d5ddf971c1b85d99c88c" ON "crw_post_comment" ("postId") `);
    await queryRunner.query(`CREATE INDEX "IDX_16527a7e9f22a68a274e61d6da" ON "crw_post_comment" ("userEmail") `);
    await queryRunner.query(`CREATE INDEX "IDX_cb0a2cf3605d77131907fb4664" ON "crw_post_comment" ("userId") `);
    await queryRunner.query(`DROP INDEX "IDX_f8c8425742699651cf5f7c12e0"`);
    await queryRunner.query(`DROP INDEX "IDX_17920baaeed623ba12afefa4b2"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_tag_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL, CONSTRAINT "FK_4ce88d2ef01aa532e616b2e5dc6" FOREIGN KEY ("entityId") REFERENCES "crw_tag" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_tag_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "crw_tag_meta"`,
    );
    await queryRunner.query(`DROP TABLE "crw_tag_meta"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_tag_meta" RENAME TO "crw_tag_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_f8c8425742699651cf5f7c12e0" ON "crw_tag_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_17920baaeed623ba12afefa4b2" ON "crw_tag_meta" ("shortValue") `);
    await queryRunner.query(`DROP INDEX "IDX_be55edbbdc5da3712ab5270b61"`);
    await queryRunner.query(`DROP INDEX "IDX_ac05041d8a345ef9bcf4df886c"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_user_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL, CONSTRAINT "FK_eb456c31e1202a6f6eb8f9f563c" FOREIGN KEY ("entityId") REFERENCES "crw_user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_user_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "crw_user_meta"`,
    );
    await queryRunner.query(`DROP TABLE "crw_user_meta"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_user_meta" RENAME TO "crw_user_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_be55edbbdc5da3712ab5270b61" ON "crw_user_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_ac05041d8a345ef9bcf4df886c" ON "crw_user_meta" ("shortValue") `);
    await queryRunner.query(`DROP INDEX "IDX_ec3abbafac22f27f03f3ddeb67"`);
    await queryRunner.query(`DROP INDEX "IDX_b4056f8c22fa23bd54d854b866"`);
    await queryRunner.query(`DROP INDEX "IDX_e47953e4571dce4050c9524443"`);
    await queryRunner.query(`DROP INDEX "IDX_35c1445265a8d5362e06167ae3"`);
    await queryRunner.query(`DROP INDEX "IDX_8d98eb30db4dfb464ce54c1957"`);
    await queryRunner.query(`DROP INDEX "IDX_0977d4805adadb696f735445ee"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "title" varchar(255), "authorId" integer, "content" text, "delta" text, "excerpt" varchar(5000), "mainImage" varchar(400), "readTime" varchar(255), "published" boolean, "publishDate" datetime, "featured" boolean, CONSTRAINT "UQ_29f14d08659ef8a3230e244708e" UNIQUE ("slug"), CONSTRAINT "FK_35c1445265a8d5362e06167ae3c" FOREIGN KEY ("authorId") REFERENCES "crw_user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_post"("id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "title", "authorId", "content", "delta", "excerpt", "mainImage", "readTime", "published", "publishDate", "featured") SELECT "id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "title", "authorId", "content", "delta", "excerpt", "mainImage", "readTime", "published", "publishDate", "featured" FROM "crw_post"`,
    );
    await queryRunner.query(`DROP TABLE "crw_post"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_post" RENAME TO "crw_post"`);
    await queryRunner.query(`CREATE INDEX "IDX_ec3abbafac22f27f03f3ddeb67" ON "crw_post" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_b4056f8c22fa23bd54d854b866" ON "crw_post" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_e47953e4571dce4050c9524443" ON "crw_post" ("title") `);
    await queryRunner.query(`CREATE INDEX "IDX_35c1445265a8d5362e06167ae3" ON "crw_post" ("authorId") `);
    await queryRunner.query(`CREATE INDEX "IDX_8d98eb30db4dfb464ce54c1957" ON "crw_post" ("published") `);
    await queryRunner.query(`CREATE INDEX "IDX_0977d4805adadb696f735445ee" ON "crw_post" ("featured") `);
    await queryRunner.query(`DROP INDEX "IDX_a6e8f93e58953b3440e4ce8e97"`);
    await queryRunner.query(`DROP INDEX "IDX_f88f049ff16c909c2117a3b737"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_post_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL, CONSTRAINT "FK_9f46af18aca849480af6ac0642b" FOREIGN KEY ("entityId") REFERENCES "crw_post" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_post_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "crw_post_meta"`,
    );
    await queryRunner.query(`DROP TABLE "crw_post_meta"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_post_meta" RENAME TO "crw_post_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_a6e8f93e58953b3440e4ce8e97" ON "crw_post_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_f88f049ff16c909c2117a3b737" ON "crw_post_meta" ("shortValue") `);
    await queryRunner.query(`DROP INDEX "IDX_8056740044bde85c6535e4cc6c"`);
    await queryRunner.query(`DROP INDEX "IDX_f4f41beb6142f70af17b37ff50"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_product_categories_product_category" ("productId" integer NOT NULL, "productCategoryId" integer NOT NULL, CONSTRAINT "FK_8056740044bde85c6535e4cc6c9" FOREIGN KEY ("productId") REFERENCES "crw_product" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_f4f41beb6142f70af17b37ff50f" FOREIGN KEY ("productCategoryId") REFERENCES "crw_product_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("productId", "productCategoryId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_product_categories_product_category"("productId", "productCategoryId") SELECT "productId", "productCategoryId" FROM "crw_product_categories_product_category"`,
    );
    await queryRunner.query(`DROP TABLE "crw_product_categories_product_category"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_crw_product_categories_product_category" RENAME TO "crw_product_categories_product_category"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8056740044bde85c6535e4cc6c" ON "crw_product_categories_product_category" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f4f41beb6142f70af17b37ff50" ON "crw_product_categories_product_category" ("productCategoryId") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_f24f47df26e67c493b68bfc75b"`);
    await queryRunner.query(`DROP INDEX "IDX_6c786f2afb686050d8233fdc6e"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_post_tags_tag" ("postId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "FK_f24f47df26e67c493b68bfc75bb" FOREIGN KEY ("postId") REFERENCES "crw_post" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_6c786f2afb686050d8233fdc6e7" FOREIGN KEY ("tagId") REFERENCES "crw_tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("postId", "tagId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_post_tags_tag"("postId", "tagId") SELECT "postId", "tagId" FROM "crw_post_tags_tag"`,
    );
    await queryRunner.query(`DROP TABLE "crw_post_tags_tag"`);
    await queryRunner.query(`ALTER TABLE "temporary_crw_post_tags_tag" RENAME TO "crw_post_tags_tag"`);
    await queryRunner.query(`CREATE INDEX "IDX_f24f47df26e67c493b68bfc75b" ON "crw_post_tags_tag" ("postId") `);
    await queryRunner.query(`CREATE INDEX "IDX_6c786f2afb686050d8233fdc6e" ON "crw_post_tags_tag" ("tagId") `);
    await queryRunner.query(`DROP INDEX "IDX_9463c9a5893b1efb969e9a21c5"`);
    await queryRunner.query(`DROP INDEX "IDX_bc8936d152e18bc99150472594"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_crw_product_category_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, CONSTRAINT "FK_9463c9a5893b1efb969e9a21c59" FOREIGN KEY ("id_ancestor") REFERENCES "crw_product_category" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_bc8936d152e18bc991504725944" FOREIGN KEY ("id_descendant") REFERENCES "crw_product_category" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("id_ancestor", "id_descendant"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_crw_product_category_closure"("id_ancestor", "id_descendant") SELECT "id_ancestor", "id_descendant" FROM "crw_product_category_closure"`,
    );
    await queryRunner.query(`DROP TABLE "crw_product_category_closure"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_crw_product_category_closure" RENAME TO "crw_product_category_closure"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9463c9a5893b1efb969e9a21c5" ON "crw_product_category_closure" ("id_ancestor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bc8936d152e18bc99150472594" ON "crw_product_category_closure" ("id_descendant") `,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP INDEX "IDX_bc8936d152e18bc99150472594"`);
    await queryRunner.query(`DROP INDEX "IDX_9463c9a5893b1efb969e9a21c5"`);
    await queryRunner.query(
      `ALTER TABLE "crw_product_category_closure" RENAME TO "temporary_crw_product_category_closure"`,
    );
    await queryRunner.query(
      `CREATE TABLE "crw_product_category_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, PRIMARY KEY ("id_ancestor", "id_descendant"))`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_product_category_closure"("id_ancestor", "id_descendant") SELECT "id_ancestor", "id_descendant" FROM "temporary_crw_product_category_closure"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_product_category_closure"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_bc8936d152e18bc99150472594" ON "crw_product_category_closure" ("id_descendant") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9463c9a5893b1efb969e9a21c5" ON "crw_product_category_closure" ("id_ancestor") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_6c786f2afb686050d8233fdc6e"`);
    await queryRunner.query(`DROP INDEX "IDX_f24f47df26e67c493b68bfc75b"`);
    await queryRunner.query(`ALTER TABLE "crw_post_tags_tag" RENAME TO "temporary_crw_post_tags_tag"`);
    await queryRunner.query(
      `CREATE TABLE "crw_post_tags_tag" ("postId" integer NOT NULL, "tagId" integer NOT NULL, PRIMARY KEY ("postId", "tagId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_post_tags_tag"("postId", "tagId") SELECT "postId", "tagId" FROM "temporary_crw_post_tags_tag"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_post_tags_tag"`);
    await queryRunner.query(`CREATE INDEX "IDX_6c786f2afb686050d8233fdc6e" ON "crw_post_tags_tag" ("tagId") `);
    await queryRunner.query(`CREATE INDEX "IDX_f24f47df26e67c493b68bfc75b" ON "crw_post_tags_tag" ("postId") `);
    await queryRunner.query(`DROP INDEX "IDX_f4f41beb6142f70af17b37ff50"`);
    await queryRunner.query(`DROP INDEX "IDX_8056740044bde85c6535e4cc6c"`);
    await queryRunner.query(
      `ALTER TABLE "crw_product_categories_product_category" RENAME TO "temporary_crw_product_categories_product_category"`,
    );
    await queryRunner.query(
      `CREATE TABLE "crw_product_categories_product_category" ("productId" integer NOT NULL, "productCategoryId" integer NOT NULL, PRIMARY KEY ("productId", "productCategoryId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_product_categories_product_category"("productId", "productCategoryId") SELECT "productId", "productCategoryId" FROM "temporary_crw_product_categories_product_category"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_product_categories_product_category"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_f4f41beb6142f70af17b37ff50" ON "crw_product_categories_product_category" ("productCategoryId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8056740044bde85c6535e4cc6c" ON "crw_product_categories_product_category" ("productId") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_f88f049ff16c909c2117a3b737"`);
    await queryRunner.query(`DROP INDEX "IDX_a6e8f93e58953b3440e4ce8e97"`);
    await queryRunner.query(`ALTER TABLE "crw_post_meta" RENAME TO "temporary_crw_post_meta"`);
    await queryRunner.query(
      `CREATE TABLE "crw_post_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_post_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "temporary_crw_post_meta"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_post_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_f88f049ff16c909c2117a3b737" ON "crw_post_meta" ("shortValue") `);
    await queryRunner.query(`CREATE INDEX "IDX_a6e8f93e58953b3440e4ce8e97" ON "crw_post_meta" ("key") `);
    await queryRunner.query(`DROP INDEX "IDX_0977d4805adadb696f735445ee"`);
    await queryRunner.query(`DROP INDEX "IDX_8d98eb30db4dfb464ce54c1957"`);
    await queryRunner.query(`DROP INDEX "IDX_35c1445265a8d5362e06167ae3"`);
    await queryRunner.query(`DROP INDEX "IDX_e47953e4571dce4050c9524443"`);
    await queryRunner.query(`DROP INDEX "IDX_b4056f8c22fa23bd54d854b866"`);
    await queryRunner.query(`DROP INDEX "IDX_ec3abbafac22f27f03f3ddeb67"`);
    await queryRunner.query(`ALTER TABLE "crw_post" RENAME TO "temporary_crw_post"`);
    await queryRunner.query(
      `CREATE TABLE "crw_post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "title" varchar(255), "authorId" integer, "content" text, "delta" text, "excerpt" varchar(5000), "mainImage" varchar(400), "readTime" varchar(255), "published" boolean, "publishDate" datetime, "featured" boolean, CONSTRAINT "UQ_29f14d08659ef8a3230e244708e" UNIQUE ("slug"))`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_post"("id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "title", "authorId", "content", "delta", "excerpt", "mainImage", "readTime", "published", "publishDate", "featured") SELECT "id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "title", "authorId", "content", "delta", "excerpt", "mainImage", "readTime", "published", "publishDate", "featured" FROM "temporary_crw_post"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_post"`);
    await queryRunner.query(`CREATE INDEX "IDX_0977d4805adadb696f735445ee" ON "crw_post" ("featured") `);
    await queryRunner.query(`CREATE INDEX "IDX_8d98eb30db4dfb464ce54c1957" ON "crw_post" ("published") `);
    await queryRunner.query(`CREATE INDEX "IDX_35c1445265a8d5362e06167ae3" ON "crw_post" ("authorId") `);
    await queryRunner.query(`CREATE INDEX "IDX_e47953e4571dce4050c9524443" ON "crw_post" ("title") `);
    await queryRunner.query(`CREATE INDEX "IDX_b4056f8c22fa23bd54d854b866" ON "crw_post" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_ec3abbafac22f27f03f3ddeb67" ON "crw_post" ("createDate") `);
    await queryRunner.query(`DROP INDEX "IDX_ac05041d8a345ef9bcf4df886c"`);
    await queryRunner.query(`DROP INDEX "IDX_be55edbbdc5da3712ab5270b61"`);
    await queryRunner.query(`ALTER TABLE "crw_user_meta" RENAME TO "temporary_crw_user_meta"`);
    await queryRunner.query(
      `CREATE TABLE "crw_user_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_user_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "temporary_crw_user_meta"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_user_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_ac05041d8a345ef9bcf4df886c" ON "crw_user_meta" ("shortValue") `);
    await queryRunner.query(`CREATE INDEX "IDX_be55edbbdc5da3712ab5270b61" ON "crw_user_meta" ("key") `);
    await queryRunner.query(`DROP INDEX "IDX_17920baaeed623ba12afefa4b2"`);
    await queryRunner.query(`DROP INDEX "IDX_f8c8425742699651cf5f7c12e0"`);
    await queryRunner.query(`ALTER TABLE "crw_tag_meta" RENAME TO "temporary_crw_tag_meta"`);
    await queryRunner.query(
      `CREATE TABLE "crw_tag_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_tag_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "temporary_crw_tag_meta"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_tag_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_17920baaeed623ba12afefa4b2" ON "crw_tag_meta" ("shortValue") `);
    await queryRunner.query(`CREATE INDEX "IDX_f8c8425742699651cf5f7c12e0" ON "crw_tag_meta" ("key") `);
    await queryRunner.query(`DROP INDEX "IDX_cb0a2cf3605d77131907fb4664"`);
    await queryRunner.query(`DROP INDEX "IDX_16527a7e9f22a68a274e61d6da"`);
    await queryRunner.query(`DROP INDEX "IDX_787534d5ddf971c1b85d99c88c"`);
    await queryRunner.query(`DROP INDEX "IDX_d5ed51c984a9ff9b8ee7a515bb"`);
    await queryRunner.query(`DROP INDEX "IDX_2cdbb06f851e9b8b2872eb1b07"`);
    await queryRunner.query(`ALTER TABLE "crw_post_comment" RENAME TO "temporary_crw_post_comment"`);
    await queryRunner.query(
      `CREATE TABLE "crw_post_comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "postId" integer, "title" varchar(400), "comment" text, "userEmail" varchar(255), "userName" varchar(255), "userId" integer, "approved" boolean, CONSTRAINT "UQ_0c41e89299843ea6cd5bb1e10b3" UNIQUE ("slug"))`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_post_comment"("id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "postId", "title", "comment", "userEmail", "userName", "userId", "approved") SELECT "id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "postId", "title", "comment", "userEmail", "userName", "userId", "approved" FROM "temporary_crw_post_comment"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_post_comment"`);
    await queryRunner.query(`CREATE INDEX "IDX_cb0a2cf3605d77131907fb4664" ON "crw_post_comment" ("userId") `);
    await queryRunner.query(`CREATE INDEX "IDX_16527a7e9f22a68a274e61d6da" ON "crw_post_comment" ("userEmail") `);
    await queryRunner.query(`CREATE INDEX "IDX_787534d5ddf971c1b85d99c88c" ON "crw_post_comment" ("postId") `);
    await queryRunner.query(`CREATE INDEX "IDX_d5ed51c984a9ff9b8ee7a515bb" ON "crw_post_comment" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_2cdbb06f851e9b8b2872eb1b07" ON "crw_post_comment" ("createDate") `);
    await queryRunner.query(`DROP INDEX "IDX_41e918d93c14cecfc1f809891a"`);
    await queryRunner.query(`DROP INDEX "IDX_d35934d4a842f8dd8798969774"`);
    await queryRunner.query(`ALTER TABLE "crw_order_meta" RENAME TO "temporary_crw_order_meta"`);
    await queryRunner.query(
      `CREATE TABLE "crw_order_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_order_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "temporary_crw_order_meta"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_order_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_41e918d93c14cecfc1f809891a" ON "crw_order_meta" ("shortValue") `);
    await queryRunner.query(`CREATE INDEX "IDX_d35934d4a842f8dd8798969774" ON "crw_order_meta" ("key") `);
    await queryRunner.query(`DROP INDEX "IDX_f33b5eacdc9c43019549184604"`);
    await queryRunner.query(`DROP INDEX "IDX_f555082eae3d87f39ef5001997"`);
    await queryRunner.query(`ALTER TABLE "crw_custom_entity_meta" RENAME TO "temporary_crw_custom_entity_meta"`);
    await queryRunner.query(
      `CREATE TABLE "crw_custom_entity_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_custom_entity_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "temporary_crw_custom_entity_meta"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_custom_entity_meta"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_f33b5eacdc9c43019549184604" ON "crw_custom_entity_meta" ("shortValue") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_f555082eae3d87f39ef5001997" ON "crw_custom_entity_meta" ("key") `);
    await queryRunner.query(`DROP INDEX "IDX_854e20470498807068e94d87a8"`);
    await queryRunner.query(`DROP INDEX "IDX_d4292415b7431d518278318057"`);
    await queryRunner.query(`DROP INDEX "IDX_6a9b506859de7cc2ac65414ec9"`);
    await queryRunner.query(`DROP INDEX "IDX_533b299ee136f75e261be4ebcf"`);
    await queryRunner.query(`ALTER TABLE "crw_attribute_to_product" RENAME TO "temporary_crw_attribute_to_product"`);
    await queryRunner.query(
      `CREATE TABLE "crw_attribute_to_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "productId" integer, "attributeValueId" integer, "key" varchar(255) NOT NULL, "value" varchar(255))`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_attribute_to_product"("id", "productId", "attributeValueId", "key", "value") SELECT "id", "productId", "attributeValueId", "key", "value", FROM "temporary_crw_attribute_to_product"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_attribute_to_product"`);
    await queryRunner.query(`CREATE INDEX "IDX_854e20470498807068e94d87a8" ON "crw_attribute_to_product" ("value") `);
    await queryRunner.query(`CREATE INDEX "IDX_d4292415b7431d518278318057" ON "crw_attribute_to_product" ("key") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_6a9b506859de7cc2ac65414ec9" ON "crw_attribute_to_product" ("attributeValueId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_533b299ee136f75e261be4ebcf" ON "crw_attribute_to_product" ("productId") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_b096b1be8dd42fe22ddc88821d"`);
    await queryRunner.query(`DROP INDEX "IDX_dc5af49e3e348deae17df11497"`);
    await queryRunner.query(`DROP INDEX "IDX_399b21eccdf612065456fb2610"`);
    await queryRunner.query(`DROP INDEX "IDX_c1cdd15bc1a00fb7500146d9cd"`);
    await queryRunner.query(`DROP INDEX "IDX_70465de7e17c6e1c31077c01e4"`);
    await queryRunner.query(`DROP INDEX "IDX_487be848a7b34339aec3524e22"`);
    await queryRunner.query(`DROP INDEX "IDX_282a9f102f8f653176677fef08"`);
    await queryRunner.query(`DROP INDEX "IDX_c2f533935056c7f29553b6e19a"`);
    await queryRunner.query(`ALTER TABLE "crw_product_review" RENAME TO "temporary_crw_product_review"`);
    await queryRunner.query(
      `CREATE TABLE "crw_product_review" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "productId" integer, "title" varchar(255), "description" text, "rating" float, "userEmail" varchar(255), "userName" varchar(255), "userId" varchar(255), "approved" boolean, CONSTRAINT "UQ_2fa3845bbaf6607041282074f3a" UNIQUE ("slug"))`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_product_review"("id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "productId", "title", "description", "rating", "userEmail", "userName", "userId", "approved") SELECT "id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "productId", "title", "description", "rating", "userEmail", "userName", "userId", "approved" FROM "temporary_crw_product_review"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_product_review"`);
    await queryRunner.query(`CREATE INDEX "IDX_b096b1be8dd42fe22ddc88821d" ON "crw_product_review" ("approved") `);
    await queryRunner.query(`CREATE INDEX "IDX_dc5af49e3e348deae17df11497" ON "crw_product_review" ("userId") `);
    await queryRunner.query(`CREATE INDEX "IDX_399b21eccdf612065456fb2610" ON "crw_product_review" ("userEmail") `);
    await queryRunner.query(`CREATE INDEX "IDX_c1cdd15bc1a00fb7500146d9cd" ON "crw_product_review" ("rating") `);
    await queryRunner.query(`CREATE INDEX "IDX_70465de7e17c6e1c31077c01e4" ON "crw_product_review" ("title") `);
    await queryRunner.query(`CREATE INDEX "IDX_487be848a7b34339aec3524e22" ON "crw_product_review" ("productId") `);
    await queryRunner.query(`CREATE INDEX "IDX_282a9f102f8f653176677fef08" ON "crw_product_review" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_c2f533935056c7f29553b6e19a" ON "crw_product_review" ("createDate") `);
    await queryRunner.query(`DROP INDEX "IDX_2a1e7d159e9a000b09d5cb70f4"`);
    await queryRunner.query(`DROP INDEX "IDX_2d6326bee97904d86e512225ee"`);
    await queryRunner.query(`DROP INDEX "IDX_3121c25318b5eaab5d51aba6d9"`);
    await queryRunner.query(`ALTER TABLE "crw_product_category" RENAME TO "temporary_crw_product_category"`);
    await queryRunner.query(
      `CREATE TABLE "crw_product_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "name" varchar(255), "mainImage" varchar(400), "description" text, "descriptionDelta" text, "parentId" integer, CONSTRAINT "UQ_273d34ee465b63376bead18bbf2" UNIQUE ("slug"))`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_product_category"("id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "name", "mainImage", "description", "descriptionDelta", "parentId") SELECT "id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "name", "mainImage", "description", "descriptionDelta", "parentId" FROM "temporary_crw_product_category"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_product_category"`);
    await queryRunner.query(`CREATE INDEX "IDX_2a1e7d159e9a000b09d5cb70f4" ON "crw_product_category" ("name") `);
    await queryRunner.query(`CREATE INDEX "IDX_2d6326bee97904d86e512225ee" ON "crw_product_category" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_3121c25318b5eaab5d51aba6d9" ON "crw_product_category" ("createDate") `);
    await queryRunner.query(`DROP INDEX "IDX_c33ea052760e97d0de3c7cc8b5"`);
    await queryRunner.query(`DROP INDEX "IDX_f27e3267cdc21478c61e42bb88"`);
    await queryRunner.query(`ALTER TABLE "crw_product_category_meta" RENAME TO "temporary_crw_product_category_meta"`);
    await queryRunner.query(
      `CREATE TABLE "crw_product_category_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_product_category_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "temporary_crw_product_category_meta"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_product_category_meta"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_c33ea052760e97d0de3c7cc8b5" ON "crw_product_category_meta" ("shortValue") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_f27e3267cdc21478c61e42bb88" ON "crw_product_category_meta" ("key") `);
    await queryRunner.query(`DROP INDEX "IDX_27954465979670837be4d63fc0"`);
    await queryRunner.query(`DROP INDEX "IDX_30673a2af77862cdf70c0676ce"`);
    await queryRunner.query(`ALTER TABLE "crw_product_meta" RENAME TO "temporary_crw_product_meta"`);
    await queryRunner.query(
      `CREATE TABLE "crw_product_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_product_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "temporary_crw_product_meta"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_product_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_27954465979670837be4d63fc0" ON "crw_product_meta" ("shortValue") `);
    await queryRunner.query(`CREATE INDEX "IDX_30673a2af77862cdf70c0676ce" ON "crw_product_meta" ("key") `);
    await queryRunner.query(`DROP INDEX "IDX_383d029711cbe14d2daa4c10cb"`);
    await queryRunner.query(`DROP INDEX "IDX_d6645c2ed51e531f3f85e71f39"`);
    await queryRunner.query(`DROP INDEX "IDX_4645313d5d1839bc27520ba3af"`);
    await queryRunner.query(`DROP INDEX "IDX_23157f74583e1afa224da8e11f"`);
    await queryRunner.query(`ALTER TABLE "crw_attribute_value" RENAME TO "temporary_crw_attribute_value"`);
    await queryRunner.query(
      `CREATE TABLE "crw_attribute_value" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "slug" varchar(255), "pageTitle" varchar(2000), "pageDescription" varchar(4000), "_meta" text, "createDate" datetime NOT NULL DEFAULT (datetime('now')), "updateDate" datetime NOT NULL DEFAULT (datetime('now')), "isEnabled" boolean DEFAULT (1), "attributeId" integer NOT NULL, "key" varchar(255) NOT NULL, "value" varchar(255), "title" varchar(255), "icon" varchar(400), CONSTRAINT "UQ_54086f22f96038e46d3b2b512c3" UNIQUE ("slug"))`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_attribute_value"("id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "attributeId", "key", "value", "title", "icon") SELECT "id", "slug", "pageTitle", "pageDescription", "_meta", "createDate", "updateDate", "isEnabled", "attributeId", "key", "value", "title", "icon" FROM "temporary_crw_attribute_value"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_attribute_value"`);
    await queryRunner.query(`CREATE INDEX "IDX_383d029711cbe14d2daa4c10cb" ON "crw_attribute_value" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_d6645c2ed51e531f3f85e71f39" ON "crw_attribute_value" ("attributeId") `);
    await queryRunner.query(`CREATE INDEX "IDX_4645313d5d1839bc27520ba3af" ON "crw_attribute_value" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_23157f74583e1afa224da8e11f" ON "crw_attribute_value" ("createDate") `);
    await queryRunner.query(`DROP INDEX "IDX_cfc226f441aa035681ca94d791"`);
    await queryRunner.query(`DROP INDEX "IDX_bbdf61b39e061e316700b803b2"`);
    await queryRunner.query(`ALTER TABLE "crw_attribute_meta" RENAME TO "temporary_crw_attribute_meta"`);
    await queryRunner.query(
      `CREATE TABLE "crw_attribute_meta" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" varchar(255), "value" text, "shortValue" varchar(255), "entityId" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "crw_attribute_meta"("id", "key", "value", "shortValue", "entityId") SELECT "id", "key", "value", "shortValue", "entityId" FROM "temporary_crw_attribute_meta"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_crw_attribute_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_cfc226f441aa035681ca94d791" ON "crw_attribute_meta" ("shortValue") `);
    await queryRunner.query(`CREATE INDEX "IDX_bbdf61b39e061e316700b803b2" ON "crw_attribute_meta" ("key") `);
    await queryRunner.query(`DROP INDEX "IDX_bc8936d152e18bc99150472594"`);
    await queryRunner.query(`DROP INDEX "IDX_9463c9a5893b1efb969e9a21c5"`);
    await queryRunner.query(`DROP TABLE "crw_product_category_closure"`);
    await queryRunner.query(`DROP INDEX "IDX_6c786f2afb686050d8233fdc6e"`);
    await queryRunner.query(`DROP INDEX "IDX_f24f47df26e67c493b68bfc75b"`);
    await queryRunner.query(`DROP TABLE "crw_post_tags_tag"`);
    await queryRunner.query(`DROP INDEX "IDX_f4f41beb6142f70af17b37ff50"`);
    await queryRunner.query(`DROP INDEX "IDX_8056740044bde85c6535e4cc6c"`);
    await queryRunner.query(`DROP TABLE "crw_product_categories_product_category"`);
    await queryRunner.query(`DROP INDEX "IDX_a1a866ef4e58782a1e886a5bc8"`);
    await queryRunner.query(`DROP INDEX "IDX_78cf29997948828f22da70514d"`);
    await queryRunner.query(`DROP TABLE "crw_theme"`);
    await queryRunner.query(`DROP INDEX "IDX_363ec5f7b94386accb06dbbb4e"`);
    await queryRunner.query(`DROP INDEX "IDX_9cb3bd0ef9e43cde320c123bff"`);
    await queryRunner.query(`DROP TABLE "crw_plugin"`);
    await queryRunner.query(`DROP INDEX "IDX_1f6131609d99f50bc4da4b9333"`);
    await queryRunner.query(`DROP INDEX "IDX_b77d858a4e600256c226b71e7d"`);
    await queryRunner.query(`DROP TABLE "crw_page_stats"`);
    await queryRunner.query(`DROP INDEX "IDX_f88f049ff16c909c2117a3b737"`);
    await queryRunner.query(`DROP INDEX "IDX_a6e8f93e58953b3440e4ce8e97"`);
    await queryRunner.query(`DROP TABLE "crw_post_meta"`);
    await queryRunner.query(`DROP INDEX "IDX_0977d4805adadb696f735445ee"`);
    await queryRunner.query(`DROP INDEX "IDX_8d98eb30db4dfb464ce54c1957"`);
    await queryRunner.query(`DROP INDEX "IDX_35c1445265a8d5362e06167ae3"`);
    await queryRunner.query(`DROP INDEX "IDX_e47953e4571dce4050c9524443"`);
    await queryRunner.query(`DROP INDEX "IDX_b4056f8c22fa23bd54d854b866"`);
    await queryRunner.query(`DROP INDEX "IDX_ec3abbafac22f27f03f3ddeb67"`);
    await queryRunner.query(`DROP TABLE "crw_post"`);
    await queryRunner.query(`DROP INDEX "IDX_644eed41dbcadfe2e3e634ba84"`);
    await queryRunner.query(`DROP INDEX "IDX_850a536df6641e90872f905e74"`);
    await queryRunner.query(`DROP INDEX "IDX_user.entity_email"`);
    await queryRunner.query(`DROP INDEX "IDX_0537e4a35e2b1842afc531deab"`);
    await queryRunner.query(`DROP INDEX "IDX_82038b3a02bf4b55377a056d4e"`);
    await queryRunner.query(`DROP INDEX "IDX_aae8c723ca641247505d92aedc"`);
    await queryRunner.query(`DROP TABLE "crw_user"`);
    await queryRunner.query(`DROP INDEX "IDX_ac05041d8a345ef9bcf4df886c"`);
    await queryRunner.query(`DROP INDEX "IDX_be55edbbdc5da3712ab5270b61"`);
    await queryRunner.query(`DROP TABLE "crw_user_meta"`);
    await queryRunner.query(`DROP INDEX "IDX_ecaa69a0357666eebdd48c8c75"`);
    await queryRunner.query(`DROP INDEX "IDX_ac25c70c54e0644d0ece40f1f1"`);
    await queryRunner.query(`DROP INDEX "IDX_85d1613594ad8e9a0396922bb4"`);
    await queryRunner.query(`DROP TABLE "crw_tag"`);
    await queryRunner.query(`DROP INDEX "IDX_17920baaeed623ba12afefa4b2"`);
    await queryRunner.query(`DROP INDEX "IDX_f8c8425742699651cf5f7c12e0"`);
    await queryRunner.query(`DROP TABLE "crw_tag_meta"`);
    await queryRunner.query(`DROP INDEX "IDX_cb0a2cf3605d77131907fb4664"`);
    await queryRunner.query(`DROP INDEX "IDX_16527a7e9f22a68a274e61d6da"`);
    await queryRunner.query(`DROP INDEX "IDX_787534d5ddf971c1b85d99c88c"`);
    await queryRunner.query(`DROP INDEX "IDX_d5ed51c984a9ff9b8ee7a515bb"`);
    await queryRunner.query(`DROP INDEX "IDX_2cdbb06f851e9b8b2872eb1b07"`);
    await queryRunner.query(`DROP TABLE "crw_post_comment"`);
    await queryRunner.query(`DROP INDEX "IDX_41e918d93c14cecfc1f809891a"`);
    await queryRunner.query(`DROP INDEX "IDX_d35934d4a842f8dd8798969774"`);
    await queryRunner.query(`DROP TABLE "crw_order_meta"`);
    await queryRunner.query(`DROP INDEX "IDX_d4300abf3566bc4a63ca0b12c5"`);
    await queryRunner.query(`DROP INDEX "IDX_0d853efe1210ed00263c0551fb"`);
    await queryRunner.query(`DROP INDEX "IDX_0d115ee42c627f4c5f5ea6d12a"`);
    await queryRunner.query(`DROP INDEX "IDX_8bb01ee9a429f70390bbedbaf6"`);
    await queryRunner.query(`DROP INDEX "IDX_a71afe78a44fdebe245d06c0fb"`);
    await queryRunner.query(`DROP INDEX "IDX_86c22318de90222b57a2f0ac90"`);
    await queryRunner.query(`DROP INDEX "IDX_56caac5bbc2683720ddd655a23"`);
    await queryRunner.query(`DROP INDEX "IDX_f9516631047341dd5a92da55ed"`);
    await queryRunner.query(`DROP TABLE "crw_order"`);
    await queryRunner.query(`DROP INDEX "IDX_44e0f6581a291c3814140fc0e8"`);
    await queryRunner.query(`DROP INDEX "IDX_cb3862e657eb6cf39e77241e82"`);
    await queryRunner.query(`DROP INDEX "IDX_31c31500e681c0075278fcb76b"`);
    await queryRunner.query(`DROP INDEX "IDX_b6d68788b94c05e6c4ecb75378"`);
    await queryRunner.query(`DROP TABLE "crw_custom_entity"`);
    await queryRunner.query(`DROP INDEX "IDX_f33b5eacdc9c43019549184604"`);
    await queryRunner.query(`DROP INDEX "IDX_f555082eae3d87f39ef5001997"`);
    await queryRunner.query(`DROP TABLE "crw_custom_entity_meta"`);
    await queryRunner.query(`DROP INDEX "IDX_11992283fb607b2ce95106e243"`);
    await queryRunner.query(`DROP INDEX "IDX_29b7f30f5cacfd369a34125a98"`);
    await queryRunner.query(`DROP INDEX "IDX_35aee121b80f1702414cd3d86a"`);
    await queryRunner.query(`DROP TABLE "crw_cms"`);
    await queryRunner.query(`DROP INDEX "IDX_854e20470498807068e94d87a8"`);
    await queryRunner.query(`DROP INDEX "IDX_d4292415b7431d518278318057"`);
    await queryRunner.query(`DROP INDEX "IDX_6a9b506859de7cc2ac65414ec9"`);
    await queryRunner.query(`DROP INDEX "IDX_533b299ee136f75e261be4ebcf"`);
    await queryRunner.query(`DROP TABLE "crw_attribute_to_product"`);
    await queryRunner.query(`DROP INDEX "IDX_77dc2abc46299b49ead89048d4"`);
    await queryRunner.query(`DROP INDEX "IDX_5adfdd26419d9b737b683a8c65"`);
    await queryRunner.query(`DROP INDEX "IDX_c717d9265ea3490790ee35edcd"`);
    await queryRunner.query(`DROP INDEX "IDX_fbee175d8049460160e35a36ba"`);
    await queryRunner.query(`DROP INDEX "IDX_a4383ddcc0498cfacd641f9cf8"`);
    await queryRunner.query(`DROP INDEX "IDX_c07a670f3308a2db7824d76d6a"`);
    await queryRunner.query(`DROP INDEX "IDX_e734039ba75ee043d3c61466de"`);
    await queryRunner.query(`DROP INDEX "IDX_519eaf50959bea415509872bb9"`);
    await queryRunner.query(`DROP INDEX "IDX_a51cbca1c3ed52d289104a4029"`);
    await queryRunner.query(`DROP TABLE "crw_product"`);
    await queryRunner.query(`DROP INDEX "IDX_b096b1be8dd42fe22ddc88821d"`);
    await queryRunner.query(`DROP INDEX "IDX_dc5af49e3e348deae17df11497"`);
    await queryRunner.query(`DROP INDEX "IDX_399b21eccdf612065456fb2610"`);
    await queryRunner.query(`DROP INDEX "IDX_c1cdd15bc1a00fb7500146d9cd"`);
    await queryRunner.query(`DROP INDEX "IDX_70465de7e17c6e1c31077c01e4"`);
    await queryRunner.query(`DROP INDEX "IDX_487be848a7b34339aec3524e22"`);
    await queryRunner.query(`DROP INDEX "IDX_282a9f102f8f653176677fef08"`);
    await queryRunner.query(`DROP INDEX "IDX_c2f533935056c7f29553b6e19a"`);
    await queryRunner.query(`DROP TABLE "crw_product_review"`);
    await queryRunner.query(`DROP INDEX "IDX_2a1e7d159e9a000b09d5cb70f4"`);
    await queryRunner.query(`DROP INDEX "IDX_2d6326bee97904d86e512225ee"`);
    await queryRunner.query(`DROP INDEX "IDX_3121c25318b5eaab5d51aba6d9"`);
    await queryRunner.query(`DROP TABLE "crw_product_category"`);
    await queryRunner.query(`DROP INDEX "IDX_c33ea052760e97d0de3c7cc8b5"`);
    await queryRunner.query(`DROP INDEX "IDX_f27e3267cdc21478c61e42bb88"`);
    await queryRunner.query(`DROP TABLE "crw_product_category_meta"`);
    await queryRunner.query(`DROP INDEX "IDX_27954465979670837be4d63fc0"`);
    await queryRunner.query(`DROP INDEX "IDX_30673a2af77862cdf70c0676ce"`);
    await queryRunner.query(`DROP TABLE "crw_product_meta"`);
    await queryRunner.query(`DROP INDEX "IDX_383d029711cbe14d2daa4c10cb"`);
    await queryRunner.query(`DROP INDEX "IDX_d6645c2ed51e531f3f85e71f39"`);
    await queryRunner.query(`DROP INDEX "IDX_4645313d5d1839bc27520ba3af"`);
    await queryRunner.query(`DROP INDEX "IDX_23157f74583e1afa224da8e11f"`);
    await queryRunner.query(`DROP TABLE "crw_attribute_value"`);
    await queryRunner.query(`DROP INDEX "IDX_695c3d64e2b63723cfe3c046c7"`);
    await queryRunner.query(`DROP INDEX "IDX_53dcf0d02fa3d06e1e68790cff"`);
    await queryRunner.query(`DROP INDEX "IDX_8ef1078c7f634d29bfa7970d4a"`);
    await queryRunner.query(`DROP TABLE "crw_attribute"`);
    await queryRunner.query(`DROP INDEX "IDX_cfc226f441aa035681ca94d791"`);
    await queryRunner.query(`DROP INDEX "IDX_bbdf61b39e061e316700b803b2"`);
    await queryRunner.query(`DROP TABLE "crw_attribute_meta"`);
    await queryRunner.query(`DROP INDEX "IDX_b1fb7b510a52f67bb8bbc02b80"`);
    await queryRunner.query(`DROP INDEX "IDX_3d0d518265cf6018bf3e488f30"`);
    await queryRunner.query(`DROP TABLE "crw_base_entity_meta"`);
    await queryRunner.query(`DROP INDEX "IDX_844fa3c3d939e6239a0db732c6"`);
    await queryRunner.query(`DROP INDEX "IDX_a116d8b9d2048f023d19efe688"`);
    await queryRunner.query(`DROP TABLE "crw_base_page_entity"`);
  }
};
