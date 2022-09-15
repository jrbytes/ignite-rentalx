import { ICreateCarImagesDTO } from '@modules/cars/dtos/ICreateCarImagesDTO'
import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage'

import { ICarsImagesRepository } from '../ICarsImagesRepository'

export class CarsImagesRepositoryInMemory implements ICarsImagesRepository {
  carsImages: CarImage[] = []

  async create(data: ICreateCarImagesDTO): Promise<CarImage> {
    const carImage = new CarImage()

    Object.assign(carImage, data)

    this.carsImages.push(carImage)

    return carImage
  }
}
