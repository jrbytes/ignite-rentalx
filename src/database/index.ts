import { DataSource } from 'typeorm'

import { Category } from '../modules/cars/model/Category'
import { CreateCategories1662090870937 } from './migrations/1662090870937-CreateCategories'

const dataSource = new DataSource({
  type: 'postgres',
  username: 'docker',
  password: 'ignite',
  database: 'rentx',
  entities: [Category],
  migrations: [CreateCategories1662090870937],
})

export function createConnection(host = 'database_rentx'): Promise<DataSource> {
  return dataSource
    .setOptions({
      host,
    })
    .initialize()
}

export default dataSource
