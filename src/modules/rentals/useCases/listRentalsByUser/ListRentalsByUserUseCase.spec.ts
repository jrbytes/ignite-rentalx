import { faker } from '@faker-js/faker'
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory'

import { ListRentalsByUserUseCase } from './ListRentalsByUserUseCase'

let rentalsRepositoryInMemory: RentalsRepositoryInMemory
let listRentalsByUser: ListRentalsByUserUseCase

describe('List Rentals By User', () => {
  beforeEach(async () => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory()

    listRentalsByUser = new ListRentalsByUserUseCase(rentalsRepositoryInMemory)
  })

  it('should be able to devolution a rental', async () => {
    const user_id = faker.datatype.uuid()

    await rentalsRepositoryInMemory.create({
      user_id,
      car_id: faker.datatype.uuid(),
      expected_return_date: faker.date.future(),
    })

    const rentals = await listRentalsByUser.execute(user_id)

    expect(rentals).toHaveLength(1)
  })
})
