import { inject, injectable } from 'tsyringe'

import { IListAvailableCarsDTO } from '@modules/cars/dtos/IListAvailableCarsDTO'
import { Car } from '@modules/cars/infra/typeorm/entities/Car'
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository'

@injectable()
export class ListAvailableCarsUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute(data: IListAvailableCarsDTO): Promise<Car[]> {
    const cars = await this.carsRepository.findAvailable(
      data.brand,
      data.category_id,
      data.name
    )

    return cars
  }
}
