import { Express } from 'express/lib/express'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

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
    const responseToken = await request(server).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })

    const { token } = responseToken.body

    const responseUpdateUserAvatar = await request(server)
      .patch('/users/avatar')
      .attach('avatar', './tmp/filetest/avatar.jpeg')
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(responseUpdateUserAvatar.status).toBe(204)
  })
})
