import { faker } from '@faker-js/faker'
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory'

import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase'

let usersRepositoryInMemory: UsersRepositoryInMemory
let createUser: CreateUserUseCase
let updateUserAvatar: UpdateUserAvatarUseCase

describe('Update User Avatar', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    createUser = new CreateUserUseCase(usersRepositoryInMemory)
    updateUserAvatar = new UpdateUserAvatarUseCase(usersRepositoryInMemory)
  })

  it('should be able to update an user avatar', async () => {
    const email = faker.name.fullName()
    const password = faker.random.alphaNumeric(8)

    await createUser.execute({
      name: 'John Doe',
      email,
      password,
      driver_license: '000123',
    })

    const user = await usersRepositoryInMemory.findByEmail(email)

    await updateUserAvatar.execute({
      avatar_file: 'avatar.jpg',
      user_id: user.id,
    })

    const userWithAvatar = await usersRepositoryInMemory.findById(user.id)

    expect(userWithAvatar.avatar).toBe('avatar.jpg')
  })

  it('should be able to update an user avatar when has exists one avatar saved', async () => {
    const email = faker.name.fullName()
    const password = faker.random.alphaNumeric(8)

    await createUser.execute({
      name: 'John Doe',
      email,
      password,
      driver_license: '000123',
      avatar: 'avatarOld.jpg',
    })

    const user = await usersRepositoryInMemory.findByEmail(email)

    await updateUserAvatar.execute({
      avatar_file: 'avatar.jpg',
      user_id: user.id,
    })

    const userWithAvatar = await usersRepositoryInMemory.findById(user.id)

    expect(userWithAvatar.avatar).toBe('avatar.jpg')
  })
})
