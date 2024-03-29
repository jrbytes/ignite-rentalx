import dayjs from 'dayjs'
import { Express } from 'express/lib/express'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

let connection: DataSource
let server: Express

describe('Create Rental Controller', () => {
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

  it('should be able to create a rental', async () => {
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
        category_id: responseCategory.body.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    const date = dayjs.utc().add(2, 'day').toDate()

    const rental = await request(server)
      .post('/rentals')
      .send({
        expected_return_date: date,
        car_id: responseCar.body.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(rental.status).toBe(201)
    expect(rental.body).toHaveProperty('id')
    expect(rental.body).toHaveProperty('user_id')
    expect(rental.body).toHaveProperty('car_id')
    expect(rental.body).toHaveProperty('expected_return_date')
  })
})
