import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { AppError } from '../errors/AppError'
import { UsersRepository } from '../modules/accounts/repositories/implementations/UsersRepository'

interface IPayload {
  sub: string
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('Token missing', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const { sub: user_id } = verify(
      token,
      '7b2aaf19f6bbabc0b22d9e42ca84aa4d'
    ) as IPayload

    const usersRepository = new UsersRepository()
    const user = await usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User does not exists!', 401)
    }

    return next()
  } catch (error) {
    throw new AppError('Invalid token', 401)
  }
}
