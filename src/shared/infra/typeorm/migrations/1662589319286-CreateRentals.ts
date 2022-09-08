import { MigrationInterface, QueryRunner, Table } from 'typeorm'

import { EntityNames } from './entityNames'

export class CreateRentals1662589319286 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: EntityNames.RENTALS,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'car_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'start_date',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'end_date',
            type: 'timestamp with time zone',
          },
          {
            name: 'expected_return_date',
            type: 'timestamp with time zone',
          },
          {
            name: 'total',
            type: 'numeric',
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'FKCarRental',
            referencedTableName: EntityNames.CARS,
            referencedColumnNames: ['id'],
            columnNames: ['car_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          },
          {
            name: 'FKUserRental',
            referencedTableName: EntityNames.USERS,
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(EntityNames.RENTALS)
  }
}
