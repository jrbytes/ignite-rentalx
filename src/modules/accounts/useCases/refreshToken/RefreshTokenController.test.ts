import { Express } from 'express/lib/express'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

let connection: DataSource
let server: Express

describe('Refresh Token Controller', () => {
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

  it('should be able to refresh token with body', async () => {
    const responseAuthenticate = await request(server).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })

    const responseRefreshToken = await request(server)
      .post('/sessions/refresh-token')
      .send({
        token: responseAuthenticate.body.refresh_token,
      })

    expect(responseRefreshToken.status).toBe(200)
  })

  it('should be able to refresh token with header', async () => {
    const responseAuthenticate = await request(server).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })

    const responseRefreshToken = await request(server)
      .post('/sessions/refresh-token')
      .set({
        'x-access-token': responseAuthenticate.body.refresh_token,
      })

    expect(responseRefreshToken.status).toBe(200)
  })

  it('should be able to refresh token with query', async () => {
    const responseAuthenticate = await request(server).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })

    const responseRefreshToken = await request(server)
      .post('/sessions/refresh-token')
      .query({
        token: responseAuthenticate.body.refresh_token,
      })

    expect(responseRefreshToken.status).toBe(200)
  })
})
