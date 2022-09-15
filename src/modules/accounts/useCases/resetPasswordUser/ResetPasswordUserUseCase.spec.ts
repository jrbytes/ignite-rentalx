import { compare } from 'bcryptjs'

import { faker } from '@faker-js/faker'
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory'
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider'
import { AppError } from '@shared/errors/AppError'

import { ResetPasswordUserUseCase } from './ResetPasswordUserUseCase'

let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory
let dateProvider: DayjsDateProvider
let usersRepositoryInMemory: UsersRepositoryInMemory
let resetPasswordUserUseCase: ResetPasswordUserUseCase

describe('Reset Password User', () => {
  beforeEach(() => {
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
    dateProvider = new DayjsDateProvider()
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    resetPasswordUserUseCase = new ResetPasswordUserUseCase(
      usersTokensRepositoryInMemory,
      dateProvider,
      usersRepositoryInMemory
    )
  })

  it('should be able to reset password', async () => {
    const email = faker.internet.email()
    const password = '1234'
    const newPassword = '123456'

    await usersRepositoryInMemory.create({
      driver_license: '000123',
      email,
      password,
      name: 'User Test',
    })

    await usersTokensRepositoryInMemory.create({
      expires_date: dateProvider.addHours(3),
      refresh_token: faker.datatype.uuid(),
      user_id: usersRepositoryInMemory.users[0].id,
    })

    await resetPasswordUserUseCase.execute({
      token: usersTokensRepositoryInMemory.usersTokens[0].refresh_token,
      password: newPassword,
    })

    const user = await usersRepositoryInMemory.findByEmail(email)

    const verifyPassword = await compare(newPassword, user.password)

    expect(verifyPassword).toBe(true)
  })

  it('should not be able to reset password if non-exist a valid token', async () => {
    const email = faker.internet.email()
    const password = '1234'
    const newPassword = '123456'

    await usersRepositoryInMemory.create({
      driver_license: '000123',
      email,
      password,
      name: 'User Test',
    })

    await expect(
      resetPasswordUserUseCase.execute({
        token: 'invalid-token',
        password: newPassword,
      })
    ).rejects.toEqual(new AppError('Token invalid'))
  })

  it('should not be able to reset password if the token has expired', async () => {
    const email = faker.internet.email()
    const password = '1234'
    const newPassword = '123456'

    await usersRepositoryInMemory.create({
      driver_license: '000123',
      email,
      password,
      name: 'User Test',
    })

    await usersTokensRepositoryInMemory.create({
      expires_date: dateProvider.addHours(-1),
      refresh_token: faker.datatype.uuid(),
      user_id: usersRepositoryInMemory.users[0].id,
    })

    await expect(
      resetPasswordUserUseCase.execute({
        token: usersTokensRepositoryInMemory.usersTokens[0].refresh_token,
        password: newPassword,
      })
    ).rejects.toEqual(new AppError('Token expired'))
  })
})
