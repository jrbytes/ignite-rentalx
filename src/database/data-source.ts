import { DataSource } from 'typeorm'

const dataSource = new DataSource({
  type: 'postgres',
  username: 'docker',
  password: 'ignite',
  database: 'rentx',
  entities: ['src/modules/**/entities/*.ts'],
  migrations: ['src/database/migrations/*.ts'],
})

export function createConnection(host = 'database_rentx'): Promise<DataSource> {
  return dataSource
    .setOptions({
      host,
    })
    .initialize()
}

export default dataSource
