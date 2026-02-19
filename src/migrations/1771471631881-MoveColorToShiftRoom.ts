import { MigrationInterface, QueryRunner } from "typeorm";

export class MoveColorToShiftRoom1771471631881 implements MigrationInterface {
    name = 'MoveColorToShiftRoom1771471631881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shift_rooms" ADD "color" character varying(7) NOT NULL DEFAULT '#000000'`);
        await queryRunner.query(`ALTER TABLE "shift_rooms" ALTER COLUMN "color" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "shift_groups" DROP COLUMN "color"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shift_groups" ADD "color" character varying(7) NOT NULL DEFAULT '#000000'`);
        await queryRunner.query(`ALTER TABLE "shift_groups" ALTER COLUMN "color" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "shift_rooms" DROP COLUMN "color"`);
    }
}
