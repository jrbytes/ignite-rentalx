import { Express } from 'express/lib/express'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

let connection: DataSource
let server: Express

describe('Create Category Controller', () => {
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

  it('should be able to create a new category', async () => {
    const responseToken = await request(server).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })
    const { token } = responseToken.body

    const response = await request(server)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.status).toBe(201)
  })

  it('should not be able to create a new category with same exists', async () => {
    const responseToken = await request(server).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })
    const { token } = responseToken.body

    const response = await request(server)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.status).toBe(400)
  })
})
