import { Repository } from 'typeorm'

import {
  ICreateSpecificationDTO,
  ISpecificationRepository,
} from '@modules/cars/repositories/ISpecificationRepository'
import dataSource from '@shared/infra/typeorm/data-source'

import { Specification } from '../entities/Specification'

class SpecificationRepository implements ISpecificationRepository {
  private repository: Repository<Specification>

  constructor() {
    this.repository = dataSource.getRepository(Specification)
  }

  async create({ description, name }: ICreateSpecificationDTO): Promise<void> {
    const specification = this.repository.create({
      description,
      name,
    })

    await this.repository.save(specification)
  }

  async findByName(name: string): Promise<Specification> {
    const specification = this.repository.findOne({ where: { name } })

    return specification
  }
}

export { SpecificationRepository }
