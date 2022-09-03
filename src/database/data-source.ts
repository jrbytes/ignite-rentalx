import { DataSource } from 'typeorm'

import { User } from '../modules/accounts/entities/User'
import { Category } from '../modules/cars/entities/Category'
import { Specification } from '../modules/cars/entities/Specification'
import { CreateCategories1662090870937 } from './migrations/1662090870937-CreateCategories'
import { CreateSpecifications1662156987439 } from './migrations/1662156987439-CreateSpecifications'
import { CreateUsers1662169955896 } from './migrations/1662169955896-CreateUsers'
import { AlterUserDeleteUsername1662172106549 } from './migrations/1662172106549-AlterUserDeleteUsername'

const dataSource = new DataSource({
  type: 'postgres',
  username: 'docker',
  password: 'ignite',
  database: 'rentx',
  entities: [Category, Specification, User],
  migrations: [
    CreateCategories1662090870937,
    CreateSpecifications1662156987439,
    CreateUsers1662169955896,
    AlterUserDeleteUsername1662172106549,
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
