import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory'
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase'

let carsRepositoryInMemory: CarsRepositoryInMemory
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory
let createCarSpecification: CreateCarSpecificationUseCase

describe('Create Car Specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory()
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory()

    createCarSpecification = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    )
  })

  it('should be able to add a new specification to a now-existent car', async () => {
    await expect(
      createCarSpecification.execute({
        car_id: '1234',
        specifications_id: ['54321'],
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to add a new specification to the car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category',
    })

    const specification = await specificationsRepositoryInMemory.create({
      description: 'test',
      name: 'test',
    })

    const specificationCars = await createCarSpecification.execute({
      car_id: car.id,
      specifications_id: [specification.id],
    })

    expect(specificationCars).toHaveProperty('specifications')
    expect(specificationCars.specifications.length).toBe(1)
  })
})
