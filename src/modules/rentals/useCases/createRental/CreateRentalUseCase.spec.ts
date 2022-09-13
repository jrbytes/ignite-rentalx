import dayjs from 'dayjs'

import { faker } from '@faker-js/faker'
import { Car } from '@modules/cars/infra/typeorm/entities/Car'
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory'
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider'
import { AppError } from '@shared/errors/AppError'

import { CreateRentalUseCase } from './CreateRentalUseCase'

let rentalsRepositoryInMemory: RentalsRepositoryInMemory
let carsRepositoryInMemory: CarsRepositoryInMemory
let createRentalUseCase: CreateRentalUseCase
let dayJsProvider: DayjsDateProvider
let car: Car

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate()

  beforeEach(async () => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory()
    carsRepositoryInMemory = new CarsRepositoryInMemory()
    dayJsProvider = new DayjsDateProvider()

    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJsProvider,
      carsRepositoryInMemory
    )

    car = await carsRepositoryInMemory.create({
      name: faker.vehicle.model(),
      description: faker.lorem.paragraph(),
      daily_rate: faker.datatype.number(),
      license_plate: faker.vehicle.vrm(),
      fine_amount: faker.datatype.number(),
      brand: faker.vehicle.manufacturer(),
      category_id: faker.datatype.uuid(),
    })
  })

  it('should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: '4321',
      expected_return_date: dayAdd24Hours,
    })

    expect(rental).toHaveProperty('id')
    expect(rental).toHaveProperty('start_date')
  })

  it('should not be able to create a new rental if there is another open ot the same user', async () => {
    const user = faker.datatype.uuid()

    await createRentalUseCase.execute({
      car_id: car.id,
      user_id: user,
      expected_return_date: dayAdd24Hours,
    })

    await expect(
      createRentalUseCase.execute({
        car_id: '4321',
        user_id: user,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError('There is a rental in progress for user'))
  })

  it('should not be able to create a new rental if there is another open ot the same car', async () => {
    await createRentalUseCase.execute({
      car_id: car.id,
      user_id: '1234',
      expected_return_date: dayAdd24Hours,
    })

    await expect(
      createRentalUseCase.execute({
        car_id: car.id,
        user_id: '4321',
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError('Car is unavailable'))
  })

  it('should not be able to create a new rental with invalid return time', async () => {
    await expect(
      createRentalUseCase.execute({
        car_id: '1234',
        user_id: '4321',
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError('Invalid return time!'))
  })
})
