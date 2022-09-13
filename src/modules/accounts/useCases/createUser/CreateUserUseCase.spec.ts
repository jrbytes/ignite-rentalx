import { faker } from '@faker-js/faker'
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory'
import { AppError } from '@shared/errors/AppError'

import { CreateUserUseCase } from './CreateUserUseCase'

let usersRepositoryInMemory: UsersRepositoryInMemory
let createUser: CreateUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    createUser = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it('should be able to create an user', async () => {
    const email = faker.name.fullName()
    const password = faker.random.alphaNumeric(8)

    await createUser.execute({
      name: 'John Doe',
      email,
      password,
      driver_license: '000123',
    })

    const userRepository = await usersRepositoryInMemory.findByEmail(email)

    expect(userRepository).toHaveProperty('id')
  })

  it('should be able to create an user and select by id', async () => {
    const email = faker.name.fullName()
    const password = faker.random.alphaNumeric(8)

    await createUser.execute({
      name: 'John Doe',
      email,
      password,
      driver_license: '000123',
    })

    const searchByEmail = await usersRepositoryInMemory.findByEmail(email)

    const searchById = await usersRepositoryInMemory.findById(searchByEmail.id)

    expect(searchById).toHaveProperty('id')
  })

  it('should not be able to create with the same email', async () => {
    const email = 'example@example.com'
    const password = '123456'

    await usersRepositoryInMemory.create({
      name: 'John Doe',
      email,
      password,
      driver_license: '000123',
    })

    await expect(
      createUser.execute({
        name: 'John Doe',
        email,
        password,
        driver_license: '000123',
      })
    ).rejects.toEqual(new AppError('User already exists'))
  })
})
