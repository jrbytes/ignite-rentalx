import fs from 'fs'

import { CategoriesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory'

import { ImportCategoryUseCase } from './ImportCategoryUseCase'

let categoriesRepositoryInMemory: CategoriesRepositoryInMemory
let importCategoryUseCase: ImportCategoryUseCase

describe('Import Category', () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory()
    importCategoryUseCase = new ImportCategoryUseCase(
      categoriesRepositoryInMemory
    )
  })

  it('should be able to update an user avatar', async () => {
    fs.writeFileSync('./tmp/filetest/categories-test-created.csv', 'SUV')

    const expressMulterFileSimulate = {
      fieldname: 'file',
      originalname: 'categories-test-created.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      destination: './tmp',
      filename: 'categories-test-created.csv',
      path: './tmp/filetest/categories-test-created.csv',
      size: 0,
    } as Express.Multer.File

    await importCategoryUseCase.execute(expressMulterFileSimulate)

    const categories = await categoriesRepositoryInMemory.list()

    expect(categories.length).toBe(1)
    expect(categories[0].name).toBe('SUV')
  })
})
