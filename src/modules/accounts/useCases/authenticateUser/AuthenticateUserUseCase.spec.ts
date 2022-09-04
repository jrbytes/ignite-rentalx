import { AppError } from '@errors/AppError'
import { faker } from '@faker-js/faker'
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory'

import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'

let authenticateUser: AuthenticateUserUseCase
let usersRepositoryInMemory: UsersRepositoryInMemory
let createUser: CreateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    createUser = new CreateUserUseCase(usersRepositoryInMemory)
    authenticateUser = new AuthenticateUserUseCase(usersRepositoryInMemory)
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
    expect(async () => {
      await authenticateUser.execute({
        email: 'nonexistent@example.com',
        password: '1234',
      })
    }).rejects.toBeInstanceOf(AppError)
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

    expect(async () => {
      await authenticateUser.execute({
        email,
        password: 'incorrect',
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
