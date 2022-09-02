import { DataSource } from 'typeorm'

import { Category } from '../modules/cars/entities/Category'
import { Specification } from '../modules/cars/entities/Specification'
import { CreateCategories1662090870937 } from './migrations/1662090870937-CreateCategories'
import { CreateSpecifications1662156987439 } from './migrations/1662156987439-CreateSpecifications'

const dataSource = new DataSource({
  type: 'postgres',
  username: 'docker',
  password: 'ignite',
  database: 'rentx',
  entities: [Category, Specification],
  migrations: [
    CreateCategories1662090870937,
    CreateSpecifications1662156987439,
  ],
})

export function createConnection(host = 'database_rentx'): Promise<DataSource> {
  return dataSource
    .setOptions({
      host,
    })
    .initialize()
}

export default dataSource
