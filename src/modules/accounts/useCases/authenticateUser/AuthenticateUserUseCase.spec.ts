import { faker } from '@faker-js/faker'
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory'
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider'
import { AppError } from '@shared/errors/AppError'

import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'

let authenticateUser: AuthenticateUserUseCase
let usersRepositoryInMemory: UsersRepositoryInMemory
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory
let dateProvider: DayjsDateProvider
let createUser: CreateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
    dateProvider = new DayjsDateProvider()
    createUser = new CreateUserUseCase(usersRepositoryInMemory)

    authenticateUser = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider
    )
  })

  it('should be able to authenticate an user', async () => {
    const email = faker.name.fullName()
    const password = faker.random.alphaNumeric(8)

    await createUser.execute({
      name: 'John Doe',
      email,
      password,
      driver_license: '000123',
    })

    const authenticated = await authenticateUser.execute({
      email,
      password,
    })

    expect(authenticated).toHaveProperty('token')
  })

  it('should not be able to authenticate an nonexistent user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'nonexistent@example.com',
        password: '1234',
      })
    ).rejects.toEqual(new AppError('Email or password incorrect!'))
  })

  it('should not be able to authenticate with incorrect password', async () => {
    const email = faker.name.fullName()
    const password = faker.random.alphaNumeric(8)

    await createUser.execute({
      name: 'John Doe',
      email,
      password,
      driver_license: '000123',
    })

    await expect(
      authenticateUser.execute({
        email,
        password: 'incorrect',
      })
    ).rejects.toEqual(new AppError('Email or password incorrect!'))
  })
})
