import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO'
import { UserTokens } from '@modules/accounts/infra/typeorm/entities/UserTokens'

import { IUsersTokensRepository } from '../IUsersTokensRepository'

export class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  usersTokens: UserTokens[] = []

  async create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens()

    Object.assign(userToken, {
      expires_date,
      refresh_token,
      user_id,
    })

    this.usersTokens.push(userToken)

    return userToken
  }
}
