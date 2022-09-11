import { DataSource } from 'typeorm'

const dataSource = new DataSource({
  type: 'postgres',
  username: 'docker',
  password: 'ignite',
  entities: ['src/modules/**/infra/typeorm/entities/*.ts'],
  migrations: ['src/shared/infra/typeorm/migrations/*.ts'],
})

export function createConnection(host = 'database_rentx'): Promise<DataSource> {
  return dataSource
    .setOptions({
      host: process.env.NODE_ENV === 'test' ? 'localhost' : host,
      database: process.env.NODE_ENV === 'test' ? 'rentx_test' : 'rentx',
    })
    .initialize()
}

export default dataSource
