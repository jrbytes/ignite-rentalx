import { Express } from 'express/lib/express'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { faker } from '@faker-js/faker'
import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

let connection: DataSource
let server: Express

describe('Send Forgot Password Mail Controller', () => {
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

  it('should be able to send a forgot password mail', async () => {
    // const email = faker.internet.email()
    // const response = await request(server).post('/passwords/forgot').send({
    //   email,
    // })
    // expect(response.status).toBe(201)
  })
})
