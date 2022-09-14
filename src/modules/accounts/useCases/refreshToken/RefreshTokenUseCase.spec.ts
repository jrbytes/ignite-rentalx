import { faker } from '@faker-js/faker'
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory'
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider'
import { AppError } from '@shared/errors/AppError'

import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { RefreshTokenUseCase } from './RefreshTokenUseCase'

let usersRepositoryInMemory: UsersRepositoryInMemory
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory
let dateProvider: DayjsDateProvider
let refreshToken: RefreshTokenUseCase
let createUser: CreateUserUseCase
let authentication: AuthenticateUserUseCase

describe('Refresh Token', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
    dateProvider = new DayjsDateProvider()
    createUser = new CreateUserUseCase(usersRepositoryInMemory)
    authentication = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider
    )
    refreshToken = new RefreshTokenUseCase(
      usersTokensRepositoryInMemory,
      dateProvider
    )
  })

  it('should be able to refresh token', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    await createUser.execute({
      driver_license: 'ABC-1234',
      email,
      name: 'Junior',
      password,
    })

    const { refresh_token: token } = await authentication.execute({
      email,
      password,
    })

    const result = await refreshToken.execute(token)

    expect(result).not.toBeNull()
  })

  it('should not be able to refresh token if user tokens not exists', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()

    await createUser.execute({
      driver_license: 'ABC-1234',
      email,
      name: 'Junior',
      password,
    })

    const { refresh_token: token } = await authentication.execute({
      email,
      password,
    })

    const getUser = await usersRepositoryInMemory.findByEmail(email)

    await usersTokensRepositoryInMemory.deleteById(getUser.id)

    await expect(refreshToken.execute(token)).rejects.toEqual(
      new AppError('Refresh Token does not exists!')
    )
  })
})
