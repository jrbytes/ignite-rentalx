import { Express } from 'express/lib/express'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

let connection: DataSource
let server: Express

describe('Upload Car Images Controller', () => {
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

  it('should be able to upload car images', async () => {
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

    const responseCarImages = await request(server)
      .post(`/cars/images/${responseCar.body.id}`)
      .attach('images', './tmp/filetest/audi-a3.jpeg')
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(responseCarImages.status).toBe(201)
  })
})
