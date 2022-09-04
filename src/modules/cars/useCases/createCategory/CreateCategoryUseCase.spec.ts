import { AppError } from '@errors/AppError'
import { CategoriesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory'

import { CreateCategoryUseCase } from './CreateCategoryUseCase'

let createCategory: CreateCategoryUseCase
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory

describe('create category', () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory()
    createCategory = new CreateCategoryUseCase(categoriesRepositoryInMemory)
  })

  it('should be able to create a new category', async () => {
    await createCategory.execute({
      name: 'Category test',
      description: 'Category description test',
    })

    const category = await categoriesRepositoryInMemory.findByName(
      'Category test'
    )

    expect(category).toHaveProperty('id')
  })

  it('should not be able to create a new category with same name', async () => {
    await createCategory.execute({
      name: 'Category test',
      description: 'Category description test',
    })

    expect(async () => {
      await createCategory.execute({
        name: 'Category test',
        description: 'Category description test',
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
