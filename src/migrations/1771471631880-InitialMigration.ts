import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1771471631880 implements MigrationInterface {
    name = 'InitialMigration1771471631880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "publications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "summary" text NOT NULL, "content" text NOT NULL, "tags" text NOT NULL, "author" character varying NOT NULL, "date" date NOT NULL, "readTime" character varying NOT NULL, "imageUrl" text, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2c4e732b044e09139d2f1065fae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shift_rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roomName" character varying NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "team" text NOT NULL, "start" TIMESTAMP WITH TIME ZONE, "end" TIMESTAMP WITH TIME ZONE, "groupId" uuid, CONSTRAINT "PK_64db0574449b3badef5422af701" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shift_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "start" TIMESTAMP WITH TIME ZONE NOT NULL, "end" TIMESTAMP WITH TIME ZONE NOT NULL, "color" character varying(7) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_77787c0c9ca85c673c066f347da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "shift_rooms" ADD CONSTRAINT "FK_f744ba9089d436c2075d68c2585" FOREIGN KEY ("groupId") REFERENCES "shift_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shift_rooms" DROP CONSTRAINT "FK_f744ba9089d436c2075d68c2585"`);
        await queryRunner.query(`DROP TABLE "shift_groups"`);
        await queryRunner.query(`DROP TABLE "shift_rooms"`);
        await queryRunner.query(`DROP TABLE "publications"`);
    }

}
