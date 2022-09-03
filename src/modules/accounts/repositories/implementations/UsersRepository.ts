import { Repository } from 'typeorm'

import dataSource from '../../../../database/data-source'
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO'
import { User } from '../../entities/User'
import { IUsersRepository } from '../IUsersRepository'

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = dataSource.getRepository(User)
  }

  async create(data: ICreateUserDTO): Promise<void> {
    const user = this.repository.create(data)

    await this.repository.save(user)
  }
}

export { UsersRepository }
