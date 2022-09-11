import { faker } from '@faker-js/faker'
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'

import { CreateSpecificationUseCase } from './CreateSpecificationUseCase'

let createSpecification: CreateSpecificationUseCase
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory

describe('create specification', () => {
  beforeEach(() => {
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory()
    createSpecification = new CreateSpecificationUseCase(
      specificationsRepositoryInMemory
    )
  })

  it('should be able to create a new specification', async () => {
    await createSpecification.execute({
      name: 'Category test',
      description: 'Category description test',
    })

    const category = await specificationsRepositoryInMemory.findByName(
      'Category test'
    )

    expect(category).toHaveProperty('id')
  })

  it('should not be able to create a new category with same name', async () => {
    const name = faker.name.firstName()

    await createSpecification.execute({
      name,
      description: 'Category description test',
    })

    await expect(
      createSpecification.execute({
        name,
        description: 'Category description test',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
