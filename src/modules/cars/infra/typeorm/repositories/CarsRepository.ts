import { Repository } from 'typeorm'

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO'
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository'
import dataSource from '@shared/infra/typeorm/data-source'

import { Car } from '../entities/Car'

export class CarsRepositoy implements ICarsRepository {
  private repository: Repository<Car>

  constructor() {
    this.repository = dataSource.getRepository(Car)
  }

  async create(data: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create(data)
    await this.repository.save(car)
    return car
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.repository.findOne({ where: { license_plate } })
    return car
  }
}
