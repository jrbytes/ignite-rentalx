import dayjs from 'dayjs'

import { faker } from '@faker-js/faker'
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider'
import { AppError } from '@shared/errors/AppError'

import { CreateRentalUseCase } from './CreateRentalUseCase'

let rentalsRepositoryInMemory: RentalsRepositoryInMemory
let createRentalUseCase: CreateRentalUseCase
let dayJsProvider: DayjsDateProvider

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate()

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory()
    dayJsProvider = new DayjsDateProvider()

    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJsProvider
    )
  })

  it('should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      car_id: '1234',
      user_id: '4321',
      expected_return_date: dayAdd24Hours,
    })

    expect(rental).toHaveProperty('id')
    expect(rental).toHaveProperty('start_date')
  })

  it('should not be able to create a new rental if there is another open ot the same user', async () => {
    const user = faker.datatype.uuid()

    await createRentalUseCase.execute({
      car_id: '1234',
      user_id: user,
      expected_return_date: dayAdd24Hours,
    })

    await expect(
      createRentalUseCase.execute({
        car_id: '4321',
        user_id: user,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create a new rental if there is another open ot the same car', async () => {
    const car = faker.datatype.uuid()

    await createRentalUseCase.execute({
      car_id: car,
      user_id: '1234',
      expected_return_date: dayAdd24Hours,
    })

    await expect(
      createRentalUseCase.execute({
        car_id: car,
        user_id: '4321',
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create a new rental with invalid return time', async () => {
    await expect(
      createRentalUseCase.execute({
        car_id: '1234',
        user_id: '4321',
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
