import { MigrationInterface, QueryRunner } from "typeorm";

export class AddShiftImageUrlAndTeamJsonb1771471631882 implements MigrationInterface {
    name = 'AddShiftImageUrlAndTeamJsonb1771471631882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shift_rooms" ADD "imageUrl" text`);
        await queryRunner.query(`ALTER TABLE "shift_rooms" ADD COLUMN "team_new" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "shift_rooms" DROP COLUMN "team"`);
        await queryRunner.query(`ALTER TABLE "shift_rooms" RENAME COLUMN "team_new" TO "team"`);
        await queryRunner.query(`ALTER TABLE "shift_rooms" ALTER COLUMN "team" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shift_rooms" ADD COLUMN "team_old" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "shift_rooms" DROP COLUMN "team"`);
        await queryRunner.query(`ALTER TABLE "shift_rooms" RENAME COLUMN "team_old" TO "team"`);
        await queryRunner.query(`ALTER TABLE "shift_rooms" ALTER COLUMN "team" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "shift_rooms" DROP COLUMN "imageUrl"`);
    }
}
