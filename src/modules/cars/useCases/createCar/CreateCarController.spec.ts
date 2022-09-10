import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

let connection: DataSource

describe('Create Car Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.destroy()
  })

  it('should be able to create a cart', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })

    const { token } = responseToken.body

    const responseCategory = await request(app)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    const responseCar = await request(app)
      .post('/cars')
      .send({
        name: 'Car Supertest',
        description: 'Car Supertest',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'Car Supertest',
        category_id: responseCategory.body.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(responseCar.status).toBe(201)
    expect(responseCar.body).toHaveProperty('id')
  })
})
