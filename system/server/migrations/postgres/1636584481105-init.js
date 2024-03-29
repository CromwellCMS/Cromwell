const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class init1636584481105 {
  name = 'init1636584481105';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "crw_base_page_entity" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, CONSTRAINT "UQ_33d156210ae42177f24eb55b524" UNIQUE ("slug"), CONSTRAINT "PK_f90bc99c36e17ac27bea436a529" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_a116d8b9d2048f023d19efe688" ON "crw_base_page_entity" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_844fa3c3d939e6239a0db732c6" ON "crw_base_page_entity" ("updateDate") `);
    await queryRunner.query(
      `CREATE TABLE "crw_base_entity_meta" ("id" SERIAL NOT NULL, "key" character varying(255), "value" text, "shortValue" character varying(255), CONSTRAINT "PK_1cc5bfc32950aa6aedd6398a3fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_3d0d518265cf6018bf3e488f30" ON "crw_base_entity_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_b1fb7b510a52f67bb8bbc02b80" ON "crw_base_entity_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_attribute_meta" ("id" SERIAL NOT NULL, "key" character varying(255), "value" text, "shortValue" character varying(255), "entityId" integer NOT NULL, CONSTRAINT "PK_0dc606538c4c2cd540ad262bf8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_bbdf61b39e061e316700b803b2" ON "crw_attribute_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_cfc226f441aa035681ca94d791" ON "crw_attribute_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_attribute" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "key" character varying(255) NOT NULL, "title" character varying(255), "type" character varying(255), "icon" character varying(400), "required" boolean, CONSTRAINT "UQ_21d04deefef2e9d62ed19ba759a" UNIQUE ("slug"), CONSTRAINT "PK_14123e1bfce87c730d9f9b2e7ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_8ef1078c7f634d29bfa7970d4a" ON "crw_attribute" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_53dcf0d02fa3d06e1e68790cff" ON "crw_attribute" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_695c3d64e2b63723cfe3c046c7" ON "crw_attribute" ("key") `);
    await queryRunner.query(
      `CREATE TABLE "crw_attribute_value" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "attributeId" integer NOT NULL, "key" character varying(255) NOT NULL, "value" character varying(255), "title" character varying(255), "icon" character varying(400), CONSTRAINT "UQ_54086f22f96038e46d3b2b512c3" UNIQUE ("slug"), CONSTRAINT "PK_07a511837cf05156ab8ff24d812" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_23157f74583e1afa224da8e11f" ON "crw_attribute_value" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_4645313d5d1839bc27520ba3af" ON "crw_attribute_value" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_d6645c2ed51e531f3f85e71f39" ON "crw_attribute_value" ("attributeId") `);
    await queryRunner.query(`CREATE INDEX "IDX_383d029711cbe14d2daa4c10cb" ON "crw_attribute_value" ("key") `);
    await queryRunner.query(
      `CREATE TABLE "crw_product_meta" ("id" SERIAL NOT NULL, "key" character varying(255), "value" text, "shortValue" character varying(255), "entityId" integer NOT NULL, CONSTRAINT "PK_d8408d893ea2581b61172735598" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_30673a2af77862cdf70c0676ce" ON "crw_product_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_27954465979670837be4d63fc0" ON "crw_product_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_product_category_meta" ("id" SERIAL NOT NULL, "key" character varying(255), "value" text, "shortValue" character varying(255), "entityId" integer NOT NULL, CONSTRAINT "PK_f4870a8af135d2d0e9d541c0122" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_f27e3267cdc21478c61e42bb88" ON "crw_product_category_meta" ("key") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_c33ea052760e97d0de3c7cc8b5" ON "crw_product_category_meta" ("shortValue") `,
    );
    await queryRunner.query(
      `CREATE TABLE "crw_product_category" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "name" character varying(255), "mainImage" character varying(400), "description" text, "descriptionDelta" text, "parentId" integer, CONSTRAINT "UQ_273d34ee465b63376bead18bbf2" UNIQUE ("slug"), CONSTRAINT "PK_59bfab9f694d339b5c3c857459b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_3121c25318b5eaab5d51aba6d9" ON "crw_product_category" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_2d6326bee97904d86e512225ee" ON "crw_product_category" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_2a1e7d159e9a000b09d5cb70f4" ON "crw_product_category" ("name") `);
    await queryRunner.query(
      `CREATE TABLE "crw_product_review" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "productId" integer, "title" character varying(255), "description" text, "rating" double precision, "userEmail" character varying(255), "userName" character varying(255), "userId" character varying(255), "approved" boolean, CONSTRAINT "UQ_2fa3845bbaf6607041282074f3a" UNIQUE ("slug"), CONSTRAINT "PK_a5cf4a8450a9f6dbd2652a83fc1" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "crw_product" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "name" character varying(255), "mainCategoryId" integer, "price" double precision, "oldPrice" double precision, "sku" character varying(255), "mainImage" character varying(400), "images" text, "stockAmount" integer, "stockStatus" character varying(255), "description" text, "descriptionDelta" text, "averageRating" numeric, "reviewsCount" integer, CONSTRAINT "UQ_404785f00e4d88df4fa5783830b" UNIQUE ("slug"), CONSTRAINT "PK_eb9777ea5f5b04f2cbba1e0af09" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "crw_attribute_to_product" ("id" SERIAL NOT NULL, "productId" integer, "attributeValueId" integer, "key" character varying(255) NOT NULL, "value" character varying(255), CONSTRAINT "PK_3ef08411c210625bceb79a0e4bb" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "crw_cms" ("id" SERIAL NOT NULL, "_publicSettings" text, "_adminSettings" text, "_internalSettings" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_35aee121b80f1702414cd3d86a1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_35aee121b80f1702414cd3d86a" ON "crw_cms" ("id") `);
    await queryRunner.query(`CREATE INDEX "IDX_29b7f30f5cacfd369a34125a98" ON "crw_cms" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_11992283fb607b2ce95106e243" ON "crw_cms" ("updateDate") `);
    await queryRunner.query(
      `CREATE TABLE "crw_custom_entity_meta" ("id" SERIAL NOT NULL, "key" character varying(255), "value" text, "shortValue" character varying(255), "entityId" integer NOT NULL, CONSTRAINT "PK_5648e2b21ad22b39189c122ee51" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_f555082eae3d87f39ef5001997" ON "crw_custom_entity_meta" ("key") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_f33b5eacdc9c43019549184604" ON "crw_custom_entity_meta" ("shortValue") `,
    );
    await queryRunner.query(
      `CREATE TABLE "crw_custom_entity" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "entityType" character varying(255) NOT NULL, "name" character varying(255), CONSTRAINT "UQ_ce619267281298b316ee8ad360b" UNIQUE ("slug"), CONSTRAINT "PK_dc5766684dbc23a6b054590bc74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_b6d68788b94c05e6c4ecb75378" ON "crw_custom_entity" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_31c31500e681c0075278fcb76b" ON "crw_custom_entity" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_cb3862e657eb6cf39e77241e82" ON "crw_custom_entity" ("entityType") `);
    await queryRunner.query(`CREATE INDEX "IDX_44e0f6581a291c3814140fc0e8" ON "crw_custom_entity" ("name") `);
    await queryRunner.query(
      `CREATE TABLE "crw_order" ("id" SERIAL NOT NULL, "status" character varying(255), "cart" text, "orderTotalPrice" double precision, "cartTotalPrice" double precision, "cartOldTotalPrice" double precision, "shippingPrice" double precision, "totalQnt" double precision, "userId" integer, "customerName" character varying(255), "customerPhone" character varying(255), "customerEmail" character varying(255), "customerAddress" character varying(255), "shippingMethod" character varying(255), "paymentMethod" character varying(255), "customerComment" character varying(3000), "currency" character varying(255), "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f9516631047341dd5a92da55ed6" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "crw_order_meta" ("id" SERIAL NOT NULL, "key" character varying(255), "value" text, "shortValue" character varying(255), "entityId" integer NOT NULL, CONSTRAINT "PK_f891b186f5dcf219f990e53f261" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_d35934d4a842f8dd8798969774" ON "crw_order_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_41e918d93c14cecfc1f809891a" ON "crw_order_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_post_comment" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "postId" integer, "title" character varying(400), "comment" text, "userEmail" character varying(255), "userName" character varying(255), "userId" integer, "approved" boolean, CONSTRAINT "UQ_0c41e89299843ea6cd5bb1e10b3" UNIQUE ("slug"), CONSTRAINT "PK_29b13761ab698fe448554a3e38b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_2cdbb06f851e9b8b2872eb1b07" ON "crw_post_comment" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_d5ed51c984a9ff9b8ee7a515bb" ON "crw_post_comment" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_787534d5ddf971c1b85d99c88c" ON "crw_post_comment" ("postId") `);
    await queryRunner.query(`CREATE INDEX "IDX_16527a7e9f22a68a274e61d6da" ON "crw_post_comment" ("userEmail") `);
    await queryRunner.query(`CREATE INDEX "IDX_cb0a2cf3605d77131907fb4664" ON "crw_post_comment" ("userId") `);
    await queryRunner.query(
      `CREATE TABLE "crw_tag_meta" ("id" SERIAL NOT NULL, "key" character varying(255), "value" text, "shortValue" character varying(255), "entityId" integer NOT NULL, CONSTRAINT "PK_522f6fc8dc5db03bc204b2b8736" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_f8c8425742699651cf5f7c12e0" ON "crw_tag_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_17920baaeed623ba12afefa4b2" ON "crw_tag_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_tag" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "name" character varying(255), "color" character varying(255), "image" character varying(255), "description" text, "descriptionDelta" text, CONSTRAINT "UQ_3ad1ae94ac65ac5cf6ef4a97fd4" UNIQUE ("slug"), CONSTRAINT "PK_9f320f9f26d7779a37a1202d09a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_85d1613594ad8e9a0396922bb4" ON "crw_tag" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_ac25c70c54e0644d0ece40f1f1" ON "crw_tag" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_ecaa69a0357666eebdd48c8c75" ON "crw_tag" ("name") `);
    await queryRunner.query(
      `CREATE TABLE "crw_user_meta" ("id" SERIAL NOT NULL, "key" character varying(255), "value" text, "shortValue" character varying(255), "entityId" integer NOT NULL, CONSTRAINT "PK_281ff896ecc14998971efd7110d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_be55edbbdc5da3712ab5270b61" ON "crw_user_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_ac05041d8a345ef9bcf4df886c" ON "crw_user_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_user" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "fullName" character varying(255), "email" character varying(255), "avatar" character varying, "bio" text, "role" character varying(50), "address" character varying(1000), "phone" character varying(255), "password" character varying(255) NOT NULL, "refreshTokens" character varying(5000), "resetPasswordCode" character varying(255), "resetPasswordDate" TIMESTAMP, CONSTRAINT "UQ_86fcd952549ae797ab020043b23" UNIQUE ("slug"), CONSTRAINT "UQ_4544ef20d7756aad6b7a49d8133" UNIQUE ("email"), CONSTRAINT "PK_d1e2d7b6f6f40bef308ba789a97" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_aae8c723ca641247505d92aedc" ON "crw_user" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_82038b3a02bf4b55377a056d4e" ON "crw_user" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_0537e4a35e2b1842afc531deab" ON "crw_user" ("fullName") `);
    await queryRunner.query(`CREATE INDEX "IDX_user.entity_email" ON "crw_user" ("email") `);
    await queryRunner.query(`CREATE INDEX "IDX_850a536df6641e90872f905e74" ON "crw_user" ("role") `);
    await queryRunner.query(`CREATE INDEX "IDX_644eed41dbcadfe2e3e634ba84" ON "crw_user" ("phone") `);
    await queryRunner.query(
      `CREATE TABLE "crw_post" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "title" character varying(255), "authorId" integer, "content" text, "delta" text, "excerpt" character varying(5000), "mainImage" character varying(400), "readTime" character varying(255), "published" boolean, "publishDate" TIMESTAMP, "featured" boolean, CONSTRAINT "UQ_29f14d08659ef8a3230e244708e" UNIQUE ("slug"), CONSTRAINT "PK_5ab22641659adcdaff7704b6c5c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_ec3abbafac22f27f03f3ddeb67" ON "crw_post" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_b4056f8c22fa23bd54d854b866" ON "crw_post" ("updateDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_e47953e4571dce4050c9524443" ON "crw_post" ("title") `);
    await queryRunner.query(`CREATE INDEX "IDX_35c1445265a8d5362e06167ae3" ON "crw_post" ("authorId") `);
    await queryRunner.query(`CREATE INDEX "IDX_8d98eb30db4dfb464ce54c1957" ON "crw_post" ("published") `);
    await queryRunner.query(`CREATE INDEX "IDX_0977d4805adadb696f735445ee" ON "crw_post" ("featured") `);
    await queryRunner.query(
      `CREATE TABLE "crw_post_meta" ("id" SERIAL NOT NULL, "key" character varying(255), "value" text, "shortValue" character varying(255), "entityId" integer NOT NULL, CONSTRAINT "PK_c0094a087e1d95e1f8b4698a46a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_a6e8f93e58953b3440e4ce8e97" ON "crw_post_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_f88f049ff16c909c2117a3b737" ON "crw_post_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_page_stats" ("id" SERIAL NOT NULL, "pageRoute" character varying(255) NOT NULL, "pageName" character varying(255), "pageId" character varying(255), "views" integer, "slug" character varying(255), "entityType" character varying(255), CONSTRAINT "PK_f774ad09d3d69ddbdef96705010" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_b77d858a4e600256c226b71e7d" ON "crw_page_stats" ("slug") `);
    await queryRunner.query(`CREATE INDEX "IDX_1f6131609d99f50bc4da4b9333" ON "crw_page_stats" ("entityType") `);
    await queryRunner.query(
      `CREATE TABLE "crw_plugin" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "name" character varying(255) NOT NULL, "version" character varying(255), "title" character varying(255), "isInstalled" boolean NOT NULL, "hasAdminBundle" boolean, "settings" text, "defaultSettings" text, "moduleInfo" text, "isUpdating" boolean, CONSTRAINT "UQ_067de3d2c7d9e0e6fc733c7ba59" UNIQUE ("slug"), CONSTRAINT "PK_89a31be444f5f741a1d247f6275" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_9cb3bd0ef9e43cde320c123bff" ON "crw_plugin" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_363ec5f7b94386accb06dbbb4e" ON "crw_plugin" ("updateDate") `);
    await queryRunner.query(
      `CREATE TABLE "crw_theme" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "name" character varying(255) NOT NULL, "version" character varying, "title" character varying, "isInstalled" boolean NOT NULL, "hasAdminBundle" boolean, "settings" text, "defaultSettings" text, "moduleInfo" text, "isUpdating" boolean, CONSTRAINT "UQ_05d0c5a03358df4a5fc355eb7fc" UNIQUE ("slug"), CONSTRAINT "PK_e1ce51262721c84f8d0b0e167c0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_78cf29997948828f22da70514d" ON "crw_theme" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_a1a866ef4e58782a1e886a5bc8" ON "crw_theme" ("updateDate") `);
    await queryRunner.query(
      `CREATE TABLE "crw_product_categories_product_category" ("productId" integer NOT NULL, "productCategoryId" integer NOT NULL, CONSTRAINT "PK_7236365889528039c2f20767a16" PRIMARY KEY ("productId", "productCategoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8056740044bde85c6535e4cc6c" ON "crw_product_categories_product_category" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f4f41beb6142f70af17b37ff50" ON "crw_product_categories_product_category" ("productCategoryId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "crw_post_tags_tag" ("postId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_96ce8d01fd93486defe1bfe23df" PRIMARY KEY ("postId", "tagId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_f24f47df26e67c493b68bfc75b" ON "crw_post_tags_tag" ("postId") `);
    await queryRunner.query(`CREATE INDEX "IDX_6c786f2afb686050d8233fdc6e" ON "crw_post_tags_tag" ("tagId") `);
    await queryRunner.query(
      `CREATE TABLE "crw_product_category_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, CONSTRAINT "PK_1f42bca2566c624ff114986df40" PRIMARY KEY ("id_ancestor", "id_descendant"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9463c9a5893b1efb969e9a21c5" ON "crw_product_category_closure" ("id_ancestor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bc8936d152e18bc99150472594" ON "crw_product_category_closure" ("id_descendant") `,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_attribute_meta" ADD CONSTRAINT "FK_b5e4e97e31370c47395b4a6edc1" FOREIGN KEY ("entityId") REFERENCES "crw_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_attribute_value" ADD CONSTRAINT "FK_d6645c2ed51e531f3f85e71f396" FOREIGN KEY ("attributeId") REFERENCES "crw_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_product_meta" ADD CONSTRAINT "FK_05fc2d8b68b3833525d7c837c10" FOREIGN KEY ("entityId") REFERENCES "crw_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_product_category_meta" ADD CONSTRAINT "FK_c850099194d3cd3a991634bc12d" FOREIGN KEY ("entityId") REFERENCES "crw_product_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_product_category" ADD CONSTRAINT "FK_e7959ee49453ac5342ed33c2f0f" FOREIGN KEY ("parentId") REFERENCES "crw_product_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_product_review" ADD CONSTRAINT "FK_487be848a7b34339aec3524e221" FOREIGN KEY ("productId") REFERENCES "crw_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_attribute_to_product" ADD CONSTRAINT "FK_533b299ee136f75e261be4ebcf1" FOREIGN KEY ("productId") REFERENCES "crw_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_attribute_to_product" ADD CONSTRAINT "FK_6a9b506859de7cc2ac65414ec95" FOREIGN KEY ("attributeValueId") REFERENCES "crw_attribute_value"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_custom_entity_meta" ADD CONSTRAINT "FK_9339113c97fb03140bf2765fc41" FOREIGN KEY ("entityId") REFERENCES "crw_custom_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_order_meta" ADD CONSTRAINT "FK_5f0402c8bc745a0142da357102e" FOREIGN KEY ("entityId") REFERENCES "crw_order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_post_comment" ADD CONSTRAINT "FK_787534d5ddf971c1b85d99c88c3" FOREIGN KEY ("postId") REFERENCES "crw_post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_tag_meta" ADD CONSTRAINT "FK_4ce88d2ef01aa532e616b2e5dc6" FOREIGN KEY ("entityId") REFERENCES "crw_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_user_meta" ADD CONSTRAINT "FK_eb456c31e1202a6f6eb8f9f563c" FOREIGN KEY ("entityId") REFERENCES "crw_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_post" ADD CONSTRAINT "FK_35c1445265a8d5362e06167ae3c" FOREIGN KEY ("authorId") REFERENCES "crw_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_post_meta" ADD CONSTRAINT "FK_9f46af18aca849480af6ac0642b" FOREIGN KEY ("entityId") REFERENCES "crw_post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_product_categories_product_category" ADD CONSTRAINT "FK_8056740044bde85c6535e4cc6c9" FOREIGN KEY ("productId") REFERENCES "crw_product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_product_categories_product_category" ADD CONSTRAINT "FK_f4f41beb6142f70af17b37ff50f" FOREIGN KEY ("productCategoryId") REFERENCES "crw_product_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_post_tags_tag" ADD CONSTRAINT "FK_f24f47df26e67c493b68bfc75bb" FOREIGN KEY ("postId") REFERENCES "crw_post"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_post_tags_tag" ADD CONSTRAINT "FK_6c786f2afb686050d8233fdc6e7" FOREIGN KEY ("tagId") REFERENCES "crw_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_product_category_closure" ADD CONSTRAINT "FK_9463c9a5893b1efb969e9a21c59" FOREIGN KEY ("id_ancestor") REFERENCES "crw_product_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_product_category_closure" ADD CONSTRAINT "FK_bc8936d152e18bc991504725944" FOREIGN KEY ("id_descendant") REFERENCES "crw_product_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "crw_product_category_closure" DROP CONSTRAINT "FK_bc8936d152e18bc991504725944"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_product_category_closure" DROP CONSTRAINT "FK_9463c9a5893b1efb969e9a21c59"`,
    );
    await queryRunner.query(`ALTER TABLE "crw_post_tags_tag" DROP CONSTRAINT "FK_6c786f2afb686050d8233fdc6e7"`);
    await queryRunner.query(`ALTER TABLE "crw_post_tags_tag" DROP CONSTRAINT "FK_f24f47df26e67c493b68bfc75bb"`);
    await queryRunner.query(
      `ALTER TABLE "crw_product_categories_product_category" DROP CONSTRAINT "FK_f4f41beb6142f70af17b37ff50f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_product_categories_product_category" DROP CONSTRAINT "FK_8056740044bde85c6535e4cc6c9"`,
    );
    await queryRunner.query(`ALTER TABLE "crw_post_meta" DROP CONSTRAINT "FK_9f46af18aca849480af6ac0642b"`);
    await queryRunner.query(`ALTER TABLE "crw_post" DROP CONSTRAINT "FK_35c1445265a8d5362e06167ae3c"`);
    await queryRunner.query(`ALTER TABLE "crw_user_meta" DROP CONSTRAINT "FK_eb456c31e1202a6f6eb8f9f563c"`);
    await queryRunner.query(`ALTER TABLE "crw_tag_meta" DROP CONSTRAINT "FK_4ce88d2ef01aa532e616b2e5dc6"`);
    await queryRunner.query(`ALTER TABLE "crw_post_comment" DROP CONSTRAINT "FK_787534d5ddf971c1b85d99c88c3"`);
    await queryRunner.query(`ALTER TABLE "crw_order_meta" DROP CONSTRAINT "FK_5f0402c8bc745a0142da357102e"`);
    await queryRunner.query(`ALTER TABLE "crw_custom_entity_meta" DROP CONSTRAINT "FK_9339113c97fb03140bf2765fc41"`);
    await queryRunner.query(`ALTER TABLE "crw_attribute_to_product" DROP CONSTRAINT "FK_6a9b506859de7cc2ac65414ec95"`);
    await queryRunner.query(`ALTER TABLE "crw_attribute_to_product" DROP CONSTRAINT "FK_533b299ee136f75e261be4ebcf1"`);
    await queryRunner.query(`ALTER TABLE "crw_product_review" DROP CONSTRAINT "FK_487be848a7b34339aec3524e221"`);
    await queryRunner.query(`ALTER TABLE "crw_product_category" DROP CONSTRAINT "FK_e7959ee49453ac5342ed33c2f0f"`);
    await queryRunner.query(`ALTER TABLE "crw_product_category_meta" DROP CONSTRAINT "FK_c850099194d3cd3a991634bc12d"`);
    await queryRunner.query(`ALTER TABLE "crw_product_meta" DROP CONSTRAINT "FK_05fc2d8b68b3833525d7c837c10"`);
    await queryRunner.query(`ALTER TABLE "crw_attribute_value" DROP CONSTRAINT "FK_d6645c2ed51e531f3f85e71f396"`);
    await queryRunner.query(`ALTER TABLE "crw_attribute_meta" DROP CONSTRAINT "FK_b5e4e97e31370c47395b4a6edc1"`);
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
