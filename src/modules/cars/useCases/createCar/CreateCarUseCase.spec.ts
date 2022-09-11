import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'

import { CreateCarUseCase } from './CreateCarUseCase'

let createCar: CreateCarUseCase
let carsRepository: CarsRepositoryInMemory

describe('Create car', () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory()
    createCar = new CreateCarUseCase(carsRepository)
  })

  it('should be able to create a new car', async () => {
    const car = await createCar.execute({
      name: 'Name car',
      description: 'Description car',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category',
    })

    expect(car).toHaveProperty('id')
  })

  it('should not be able to create a car with exists license plate', async () => {
    await createCar.execute({
      name: 'Name car',
      description: 'Description car',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category',
    })

    await expect(
      createCar.execute({
        name: 'Name car 2',
        description: 'Description car',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'Brand',
        category_id: 'category',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to create a new car with available true by default', async () => {
    const car = await createCar.execute({
      name: 'Name Available',
      description: 'Description car',
      daily_rate: 100,
      license_plate: 'ABCD-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category',
    })

    expect(car.available).toBe(true)
  })
})
