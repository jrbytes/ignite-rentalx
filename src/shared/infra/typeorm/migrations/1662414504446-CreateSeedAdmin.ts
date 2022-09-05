import { hash } from 'bcryptjs'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { v4 as uuid } from 'uuid'

import { EntityNames } from './entityNames'

export class CreateSeedAdmin1662414504446 implements MigrationInterface {
  private id = uuid()
  private email = 'admin@rentx.com.br'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await hash('admin', 8)
    await queryRunner.query(
      `INSERT INTO ${EntityNames.USERS} (id, name, email, password, "isAdmin", created_at, updated_at, driver_license) VALUES ('${this.id}', 'admin', '${this.email}', '${password}', true, 'now()', 'now()', 'XXXXXX')`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM ${EntityNames.USERS} WHERE email = '${this.email}'`
    )
  }
}
