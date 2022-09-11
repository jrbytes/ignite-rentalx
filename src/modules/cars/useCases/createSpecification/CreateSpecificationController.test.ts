import { Express } from 'express/lib/express'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

let connection: DataSource
let server: Express

describe('Create Specification Controller', () => {
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

  it('should be able to create a new specification', async () => {
    const responseToken = await request(server).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })
    const { token } = responseToken.body

    const responseSpecification = await request(server)
      .post('/specifications')
      .send({
        name: 'Specification Supertest',
        description: 'Specification Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(responseSpecification.status).toBe(201)
  })
})
