import { Repository } from 'typeorm'

import { ICreateCarImagesDTO } from '@modules/cars/dtos/ICreateCarImagesDTO'
import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository'
import dataSource from '@shared/infra/typeorm/data-source'

import { CarImage } from '../entities/CarImage'

export class CarsImagesRepository implements ICarsImagesRepository {
  private repository: Repository<CarImage>

  constructor() {
    this.repository = dataSource.getRepository(CarImage)
  }

  async create(data: ICreateCarImagesDTO): Promise<CarImage> {
    const carImage = this.repository.create(data)

    await this.repository.save(carImage)

    return carImage
  }
}
