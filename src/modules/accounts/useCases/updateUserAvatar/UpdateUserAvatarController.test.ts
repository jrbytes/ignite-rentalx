import { Express } from 'express/lib/express'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'
import { deleteFile } from '@utils/file'

let connection: DataSource
let server: Express

describe('Update User Avatar Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
    server = app.listen()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.destroy()
    server.close()
  })

  it('should be able to update an user avatar', async () => {
    const email = 'admin@rentx.com.br'
    const password = 'admin'

    const responseToken = await request(server).post('/sessions').send({
      email,
      password,
    })

    const { refresh_token } = responseToken.body

    const responseUpdateUserAvatar = await request(server)
      .patch('/users/avatar')
      .attach('avatar', './tmp/filetest/avatar.jpeg')
      .set({
        Authorization: `Bearer ${refresh_token}`,
      })

    const responseTokenToDeleteAvatar = await request(server)
      .post('/sessions')
      .send({
        email,
        password,
      })

    const { user } = responseTokenToDeleteAvatar.body

    deleteFile(`./tmp/avatar/${user.avatar}`)

    expect(responseUpdateUserAvatar.status).toBe(204)
  })
})
