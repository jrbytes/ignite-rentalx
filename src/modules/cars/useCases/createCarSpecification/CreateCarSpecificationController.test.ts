import { Express } from 'express/lib/express'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

let connection: DataSource
let server: Express

describe('Create Car Specification Controller', () => {
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

  it('should be able to create a car', async () => {
    const responseToken = await request(server).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })

    const { token } = responseToken.body

    const responseCategory = await request(server)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    const responseCar = await request(server)
      .post('/cars')
      .send({
        name: 'Car Supertest',
        description: 'Car Supertest',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'Car Supertest',
        category_id: responseCategory,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    const responseSpecification = await request(server)
      .post('/specifications')
      .send({
        name: 'Specification Supertest',
        description: 'Specification Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    const responseCarSpecification = await request(server)
      .post(`/cars/specifications/${responseCar.body.id}`)
      .send({
        specifications_id: [responseSpecification.body.id],
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(responseCarSpecification.status).toBe(200)
  })
})
