import { verify, sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import auth from '@config/auth'
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { AppError } from '@shared/errors/AppError'

interface IPayload {
  sub: string
  email: string
}

interface ITokenResponse {
  token: string
  refresh_token: string
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<ITokenResponse> {
    const { email, sub } = verify(token, auth.secret_refresh_token) as IPayload

    const user_id = sub

    const userTokens =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        token
      )

    if (!userTokens) {
      throw new AppError('Refresh Token does not exists!')
    }

    await this.usersTokensRepository.deleteById(userTokens.id)

    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: sub,
      expiresIn: auth.expires_in_refresh_token,
    })

    const expires_date = this.dateProvider.addDays(
      auth.expires_refresh_token_days
    )

    const newToken = sign({}, auth.secret_token, {
      subject: user_id,
      expiresIn: auth.expires_in_token,
    })

    await this.usersTokensRepository.create({
      expires_date,
      refresh_token,
      user_id,
    })

    return {
      token: newToken,
      refresh_token,
    }
  }
}
