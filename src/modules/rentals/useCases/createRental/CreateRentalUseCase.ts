import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO'
import { Rental } from '@modules/rentals/infra/entities/Rental'
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository'
import { AppError } from '@shared/errors/AppError'

dayjs.extend(utc)

export class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository) {}

  async execute({
    car_id,
    user_id,
    expected_return_date,
  }: ICreateRentalDTO): Promise<Rental> {
    const minimumHour = 24

    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    )

    if (carUnavailable) {
      throw new AppError('Car is unavailable')
    }

    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(
      user_id
    )

    if (rentalOpenToUser) {
      throw new AppError('There is a rental in progress for user')
    }

    const expectedReturnDateFormat = dayjs(expected_return_date)
      .utc()
      .local()
      .format()

    const dateNow = dayjs().utc().local().format()

    const compare = dayjs(expectedReturnDateFormat).diff(dateNow, 'hours')

    if (compare < minimumHour) {
      throw new AppError('Invalid return time!')
    }

    const rental = await this.rentalsRepository.create({
      car_id,
      user_id,
      expected_return_date,
    })

    return rental
  }
}
