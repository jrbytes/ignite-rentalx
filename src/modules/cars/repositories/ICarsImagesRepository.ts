import { ICreateCarImagesDTO } from '../dtos/ICreateCarImagesDTO'
import { CarImage } from '../infra/typeorm/entities/CarImage'

export interface ICarsImagesRepository {
  create(data: ICreateCarImagesDTO): Promise<CarImage>
}
