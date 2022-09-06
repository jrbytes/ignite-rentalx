import { MigrationInterface, QueryRunner, Table } from 'typeorm'

import { EntityNames } from './entityNames'

export class CreateSpecificationsCars1662489382669
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: EntityNames.SPECIFICATIONS_CARS,
        columns: [
          {
            name: 'car_id',
            type: 'uuid',
          },
          {
            name: 'specification_id',
            type: 'uuid',
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
            name: 'FKCarSpecification',
            referencedTableName: EntityNames.CARS,
            referencedColumnNames: ['id'],
            columnNames: ['car_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          },
          {
            name: 'FKSpecificationCar',
            referencedTableName: EntityNames.SPECIFICATIONS,
            referencedColumnNames: ['id'],
            columnNames: ['specification_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(EntityNames.SPECIFICATIONS_CARS)
  }
}
