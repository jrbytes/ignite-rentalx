import { Repository } from 'typeorm'

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import dataSource from '@shared/infra/typeorm/data-source'

import { User } from '../entities/User'

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = dataSource.getRepository(User)
  }

  async create(data: ICreateUserDTO): Promise<void> {
    const user = this.repository.create(data)

    await this.repository.save(user)
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ where: { email } })

    return user
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne({ where: { id } })

    return user
  }
}

export { UsersRepository }
