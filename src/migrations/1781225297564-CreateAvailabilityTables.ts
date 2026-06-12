import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAvailabilityTables1781225297564
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS recurring_availability (
        id SERIAL PRIMARY KEY,
        "dayOfWeek" VARCHAR NOT NULL,
        "startTime" VARCHAR NOT NULL,
        "endTime" VARCHAR NOT NULL,
        "doctorId" INTEGER REFERENCES doctor(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS custom_availability (
        id SERIAL PRIMARY KEY,
        date VARCHAR NOT NULL,
        "startTime" VARCHAR NOT NULL,
        "endTime" VARCHAR NOT NULL,
        "doctorId" INTEGER REFERENCES doctor(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS custom_availability`);
    await queryRunner.query(`DROP TABLE IF EXISTS recurring_availability`);
  }
}
