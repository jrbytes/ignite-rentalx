import { Express } from 'express/lib/express'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

let connection: DataSource
let server: Express

describe('List Category Controller', () => {
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

  it('should be able to list all categories', async () => {
    const responseToken = await request(server).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })

    await request(server)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      })

    const response = await request(server)
      .get('/categories')
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      })

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0].name).toEqual('Category Supertest')
  })
})
