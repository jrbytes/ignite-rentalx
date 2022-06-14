import { Specification } from '../model/Specification'
import {
  ICreateSpecificationDTO,
  ISpecificationRepository,
} from './ISpecificationRepository'

class SpecificationRepository implements ISpecificationRepository {
  private specification: Specification[]

  constructor() {
    this.specification = []
  }

  findByName(name: string): Specification {
    const specification = this.specification.find(
      (specification) => specification.name === name
    )
    return specification
  }

  create({ description, name }: ICreateSpecificationDTO): void {
    const specification = new Specification()
    Object.assign(specification, { description, name, created_at: new Date() })
    this.specification.push(specification)
  }
}

export { SpecificationRepository }
