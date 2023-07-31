const { MigrationInterface, QueryRunner } = require('typeorm');
const { migrationEnd, migrationStart } = require('../common/1651054396603-permissions');

module.exports = class permissions1651054394231 {
  name = 'permissions1651054394231';

  async up(queryRunner) {
    await migrationStart(queryRunner);

    await queryRunner.query(`DROP INDEX "public"."IDX_850a536df6641e90872f905e74"`);
    await queryRunner.query(
      `CREATE TABLE "crw_role_meta" ("id" SERIAL NOT NULL, "key" character varying(255), "value" text, "shortValue" character varying(255), "entityId" integer NOT NULL, CONSTRAINT "PK_584dad5524fbe2885a164b77ff0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_8c0ffbe1960336ef92791b77b6" ON "crw_role_meta" ("key") `);
    await queryRunner.query(`CREATE INDEX "IDX_11664fa069e1099e0f7617841f" ON "crw_role_meta" ("shortValue") `);
    await queryRunner.query(
      `CREATE TABLE "crw_role" ("id" SERIAL NOT NULL, "slug" character varying(255), "pageTitle" character varying(2000), "pageDescription" character varying(4000), "_meta" text, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "isEnabled" boolean DEFAULT true, "name" character varying(255), "title" character varying(255), "icon" character varying(255), "permissions" text, CONSTRAINT "UQ_87aa9675ec190f3eb2f29fe2ad9" UNIQUE ("slug"), CONSTRAINT "PK_1a4502bc17c5be2d5d1029c371e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_02849456a7d4070ecb57daf578" ON "crw_role" ("createDate") `);
    await queryRunner.query(`CREATE INDEX "IDX_a92a25008c1fa01a71e3ff07ba" ON "crw_role" ("updateDate") `);
    await queryRunner.query(
      `CREATE TABLE "crw_user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_5c4841bf8690f80844d47ab8bcd" PRIMARY KEY ("userId", "roleId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_86e2ad2823a8f16cffae290465" ON "crw_user_roles_role" ("userId") `);
    await queryRunner.query(`CREATE INDEX "IDX_f5f27a36e32615ebf1e9a6ab82" ON "crw_user_roles_role" ("roleId") `);
    await queryRunner.query(`ALTER TABLE "public"."crw_user" DROP COLUMN "role"`);
    await queryRunner.query(
      `ALTER TABLE "crw_role_meta" ADD CONSTRAINT "FK_ebe8676ea6dcf9a29c85579112a" FOREIGN KEY ("entityId") REFERENCES "crw_role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_user_roles_role" ADD CONSTRAINT "FK_86e2ad2823a8f16cffae290465b" FOREIGN KEY ("userId") REFERENCES "crw_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "crw_user_roles_role" ADD CONSTRAINT "FK_f5f27a36e32615ebf1e9a6ab821" FOREIGN KEY ("roleId") REFERENCES "crw_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.commitTransaction();
    await migrationEnd(queryRunner);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "crw_user_roles_role" DROP CONSTRAINT "FK_f5f27a36e32615ebf1e9a6ab821"`);
    await queryRunner.query(`ALTER TABLE "crw_user_roles_role" DROP CONSTRAINT "FK_86e2ad2823a8f16cffae290465b"`);
    await queryRunner.query(`ALTER TABLE "crw_role_meta" DROP CONSTRAINT "FK_ebe8676ea6dcf9a29c85579112a"`);
    await queryRunner.query(`ALTER TABLE "public"."crw_user" ADD "role" character varying(50)`);
    await queryRunner.query(`DROP INDEX "IDX_f5f27a36e32615ebf1e9a6ab82"`);
    await queryRunner.query(`DROP INDEX "IDX_86e2ad2823a8f16cffae290465"`);
    await queryRunner.query(`DROP TABLE "crw_user_roles_role"`);
    await queryRunner.query(`DROP INDEX "IDX_a92a25008c1fa01a71e3ff07ba"`);
    await queryRunner.query(`DROP INDEX "IDX_02849456a7d4070ecb57daf578"`);
    await queryRunner.query(`DROP TABLE "crw_role"`);
    await queryRunner.query(`DROP INDEX "IDX_11664fa069e1099e0f7617841f"`);
    await queryRunner.query(`DROP INDEX "IDX_8c0ffbe1960336ef92791b77b6"`);
    await queryRunner.query(`DROP TABLE "crw_role_meta"`);
    await queryRunner.query(`CREATE INDEX "IDX_850a536df6641e90872f905e74" ON "public"."crw_user" ("role") `);
  }
};
