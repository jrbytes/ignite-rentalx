import { Repository } from 'typeorm'

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO'
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository'
import dataSource from '@shared/infra/typeorm/data-source'

import { Rental } from '../entities/Rental'

export class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>

  constructor() {
    this.repository = dataSource.getRepository(Rental)
  }

  async create(data: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create(data)

    await this.repository.save(rental)

    return rental
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    const rental = await this.repository.findOne({
      where: { car_id },
    })

    return rental
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const rental = await this.repository.findOne({
      where: { user_id },
    })

    return rental
  }
}
