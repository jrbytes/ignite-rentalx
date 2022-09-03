import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

import { EntityNames } from './entityNames'

export class AlterUserDeleteUsername1662172106549
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(EntityNames.USERS, 'username')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      EntityNames.USERS,
      new TableColumn({
        name: 'username',
        type: 'varchar',
        isUnique: true,
        isNullable: true,
      })
    )
  }
}
