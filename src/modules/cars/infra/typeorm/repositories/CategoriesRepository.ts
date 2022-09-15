import { Repository } from 'typeorm'

import {
  ICategoriesRepository,
  ICreateCategoryDTO,
} from '@modules/cars/repositories/ICategoriesRepository'
import dataSource from '@shared/infra/typeorm/data-source'

import { Category } from '../entities/Category'

export class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>

  constructor() {
    this.repository = dataSource.getRepository(Category)
  }

  async create(data: ICreateCategoryDTO): Promise<void> {
    const category = this.repository.create(data)

    await this.repository.save(category)
  }

  async list(): Promise<Category[]> {
    const categories = await this.repository.find()
    return categories
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.repository.findOne({ where: { name } })
    return category
  }
}
