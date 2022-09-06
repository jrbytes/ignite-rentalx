import { faker } from '@faker-js/faker'
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory'

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase'

let carsRepositoryInMemory: CarsRepositoryInMemory
let listAvailableCarsUseCase: ListAvailableCarsUseCase

describe('List Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory()
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    )
  })

  it('should be able to list all available cars', async () => {
    await carsRepositoryInMemory.create({
      name: 'Name car',
      description: 'Description car',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Brand',
      category_id: 'category',
    })

    const cars = await listAvailableCarsUseCase.execute({})

    expect(cars).toHaveLength(1)
  })

  it('should be able to list all available cars by brand', async () => {
    const brand = faker.random.word()

    const car = await carsRepositoryInMemory.create({
      name: 'Car2',
      description: 'Description car',
      daily_rate: 110,
      license_plate: 'ABC-1234',
      fine_amount: 40,
      brand,
      category_id: 'category',
    })

    const cars = await listAvailableCarsUseCase.execute({
      brand,
    })

    expect(cars).toEqual([car])
  })

  it('should be able to list all available cars by category_id', async () => {
    const category_id = faker.datatype.uuid()

    const car = await carsRepositoryInMemory.create({
      name: 'Car2',
      description: 'Description car',
      daily_rate: 110,
      license_plate: 'ABC-1234',
      fine_amount: 40,
      brand: 'Car_brand',
      category_id,
    })

    const cars = await listAvailableCarsUseCase.execute({
      category_id,
    })

    expect(cars).toEqual([car])
  })

  it('should be able to list all available cars by name', async () => {
    const name = faker.random.word()

    const car = await carsRepositoryInMemory.create({
      name,
      description: 'Description car',
      daily_rate: 110,
      license_plate: 'ABC-1234',
      fine_amount: 40,
      brand: 'Car_brand',
      category_id: 'category',
    })

    const cars = await listAvailableCarsUseCase.execute({
      name,
    })

    expect(cars).toEqual([car])
  })
})
