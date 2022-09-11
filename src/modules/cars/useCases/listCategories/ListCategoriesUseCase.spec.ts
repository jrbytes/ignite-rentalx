import { CategoriesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory'

import { ListCategoriesUseCase } from './ListCategoriesUseCase'

let listCategories: ListCategoriesUseCase
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory

describe('list categories', () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory()
    listCategories = new ListCategoriesUseCase(categoriesRepositoryInMemory)
  })

  it('should be able to list a category', async () => {
    await categoriesRepositoryInMemory.create({
      name: 'Name test',
      description: 'Description test',
    })

    const categories = await listCategories.execute()

    expect(categories).toHaveLength(1)
  })
})
