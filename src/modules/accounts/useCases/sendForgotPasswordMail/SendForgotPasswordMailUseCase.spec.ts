import { faker } from '@faker-js/faker'
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory'
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider'
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory'
import { AppError } from '@shared/errors/AppError'

import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase'

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase
let usersRepositoryInMemory: UsersRepositoryInMemory
let dateProvider: DayjsDateProvider
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory
let mailProvider: MailProviderInMemory

describe('Send Forgot Mail', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
    dateProvider = new DayjsDateProvider()
    mailProvider = new MailProviderInMemory()
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    )
  })

  it('should be able to send a forgot password mail to user', async () => {
    const email = faker.internet.email()
    const sendMail = jest.spyOn(mailProvider, 'sendMail')

    await usersRepositoryInMemory.create({
      driver_license: '000123',
      email,
      name: 'Example',
      password: '1234',
    })

    await sendForgotPasswordMailUseCase.execute(email)

    expect(sendMail).toHaveBeenCalled()
  })

  it('should not be able to send an email if user does not exists', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('non-existing-user')
    ).rejects.toEqual(new AppError('User does not exists'))
  })

  it('should be able to create an users token', async () => {
    const email = faker.internet.email()

    const generateTokenMail = jest.spyOn(
      usersTokensRepositoryInMemory,
      'create'
    )

    await usersRepositoryInMemory.create({
      driver_license: '000123',
      email,
      name: 'Example',
      password: '1234',
    })

    await sendForgotPasswordMailUseCase.execute(email)

    expect(generateTokenMail).toBeCalled()
  })
})
