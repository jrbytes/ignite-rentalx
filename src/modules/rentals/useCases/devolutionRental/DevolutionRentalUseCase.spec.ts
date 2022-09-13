import { faker } from '@faker-js/faker'
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory'
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider'
import { AppError } from '@shared/errors/AppError'

import { DevolutionRentalUseCase } from './DevolutionRentalUseCase'

let rentalsRepositoryInMemory: RentalsRepositoryInMemory
let carsRepositoryInMemory: CarsRepositoryInMemory
let dayJsProvider: DayjsDateProvider
let devolutionRental: DevolutionRentalUseCase

describe('Devolution Rental', () => {
  beforeEach(async () => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory()
    carsRepositoryInMemory = new CarsRepositoryInMemory()
    dayJsProvider = new DayjsDateProvider()

    devolutionRental = new DevolutionRentalUseCase(
      rentalsRepositoryInMemory,
      carsRepositoryInMemory,
      dayJsProvider
    )
  })

  it('should be able to devolution a rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: faker.vehicle.model(),
      description: faker.lorem.paragraph(),
      daily_rate: faker.datatype.number(),
      license_plate: faker.vehicle.vrm(),
      fine_amount: faker.datatype.number(),
      brand: faker.vehicle.manufacturer(),
      category_id: faker.datatype.uuid(),
    })

    const rental = await rentalsRepositoryInMemory.create({
      user_id: faker.datatype.uuid(),
      car_id: car.id,
      expected_return_date: dayJsProvider.addDays(5),
    })

    const devolution = await devolutionRental.execute({
      id: rental.id,
      user_id: faker.datatype.uuid(),
    })

    expect(devolution).toHaveProperty('id')
    expect(devolution).toHaveProperty('start_date')
  })

  it('should not be able to devolution if non-exists a rental', async () => {
    await expect(
      devolutionRental.execute({
        id: 'non-exists',
        user_id: 'user-id',
      })
    ).rejects.toEqual(new AppError('Rental does not exists'))
  })
})
