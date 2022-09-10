import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

let connection: DataSource

describe('Authenticate User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.destroy()
  })

  it('should be able to authenticate an user', async () => {
    const responseAuthenticate = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })

    expect(responseAuthenticate.status).toBe(200)
    expect(responseAuthenticate.body).toHaveProperty('token')
    expect(responseAuthenticate.body.user).toHaveProperty('name')
  })
})
