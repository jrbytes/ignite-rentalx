import { Express } from 'express/lib/express'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

let connection: DataSource
let server: Express

describe('Import Category Controller', () => {
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

  it('should be able to import category from file', async () => {
    const responseToken = await request(server).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })
    const { refresh_token } = responseToken.body

    const responseSpecification = await request(server)
      .post('/categories/import')
      .set({
        Authorization: `Bearer ${refresh_token}`,
      })
      .attach('file', './tmp/filetest/categories-test.csv')

    expect(responseSpecification.status).toBe(201)
  })
})
