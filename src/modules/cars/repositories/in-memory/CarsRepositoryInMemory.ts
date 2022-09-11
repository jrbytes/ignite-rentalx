import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO'
import { Car } from '@modules/cars/infra/typeorm/entities/Car'

import { ICarsRepository } from '../ICarsRepository'

export class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = []

  async create(data: ICreateCarDTO): Promise<Car> {
    const car = new Car()

    Object.assign(car, data)

    this.cars.push(car)

    return car
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate)
  }

  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]> {
    return this.cars.filter(
      (car) =>
        (brand && car.brand === brand && !!car.available) ||
        (category_id && car.category_id === category_id && !!car.available) ||
        (name && car.name === name && !!car.available) ||
        !!car.available
    )
  }

  async findById(id: string): Promise<Car> {
    return this.cars.find((car) => car.id === id)
  }
}
