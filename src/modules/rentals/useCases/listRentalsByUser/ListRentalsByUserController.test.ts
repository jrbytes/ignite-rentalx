import dayjs from 'dayjs'
import { Express } from 'express/lib/express'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

let connection: DataSource
let server: Express

describe('List Rentals By User Controller', () => {
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

  it('should be able to list rentals by user', async () => {
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

    await request(server)
      .post('/rentals')
      .send({
        car_id: responseCar.body.id,
        expected_return_date: dayjs().add(2, 'day').toDate(),
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    const rentalsByUser = await request(server)
      .get('/rentals/user')
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(rentalsByUser.status).toBe(200)
  })
})
