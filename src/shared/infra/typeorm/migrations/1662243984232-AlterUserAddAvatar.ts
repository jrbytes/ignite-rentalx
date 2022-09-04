import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

import { EntityNames } from './entityNames'

export class AlterUserAddAvatar1662243984232 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      EntityNames.USERS,
      new TableColumn({
        name: 'avatar',
        type: 'varchar',
        isNullable: true,
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(EntityNames.USERS, 'avatar')
  }
}
