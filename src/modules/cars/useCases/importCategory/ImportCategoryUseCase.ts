import { inject, injectable } from 'tsyringe'

import { ICategoriesRepository } from '@modules/cars/repositories/ICategoriesRepository'
import { loadCategories } from '@utils/fileCategory'

@injectable()
export class ImportCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await loadCategories(file)

    categories.map(async (category) => {
      const { name, description } = category

      const existCategory = await this.categoriesRepository.findByName(name)

      if (!existCategory) {
        await this.categoriesRepository.create({ name, description })
      }
    })
  }
}
