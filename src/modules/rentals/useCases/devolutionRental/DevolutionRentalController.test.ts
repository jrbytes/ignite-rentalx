import dayjs from 'dayjs'
import { Express } from 'express/lib/express'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

let connection: DataSource
let server: Express

describe('Devolution Rental Controller', () => {
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

  it('should be able to devolution rental', async () => {
    const responseToken = await request(server).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    })

    const { refresh_token } = responseToken.body

    const responseCategory = await request(server)
      .post('/categories')
      .send({
        name: 'Category Supertest',
        description: 'Category Supertest',
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
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
        Authorization: `Bearer ${refresh_token}`,
      })

    const responseRental = await request(server)
      .post('/rentals')
      .send({
        car_id: responseCar.body.id,
        expected_return_date: dayjs().add(2, 'day').toDate(),
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
      })

    const responseDevolution = await request(server)
      .post(`/rentals/devolution/${responseRental.body.id}`)
      .send({
        id: responseRental.body.id,
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
      })

    expect(responseDevolution.status).toBe(200)
  })
})
