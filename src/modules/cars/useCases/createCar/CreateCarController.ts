import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO'

import { CreateCarUseCase } from './CreateCarUseCase'

export class CreateCarController {
  async handle(
    request: Request<never, never, ICreateCarDTO>,
    response: Response
  ): Promise<Response> {
    const data = request.body

    const createCarUseCase = container.resolve(CreateCarUseCase)

    const car = await createCarUseCase.execute(data)

    return response.status(201).json(car)
  }
}
