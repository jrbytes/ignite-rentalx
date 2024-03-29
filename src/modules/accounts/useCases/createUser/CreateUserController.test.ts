import { Express } from 'express/lib/express'
import request from 'supertest'
import { DataSource } from 'typeorm'

import { faker } from '@faker-js/faker'
import { app } from '@shared/infra/http/app'
import { createConnection } from '@shared/infra/typeorm/data-source'

let connection: DataSource
let server: Express

describe('Create User Controller', () => {
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

  it('should be able to create an user', async () => {
    const responseUser = await request(server).post('/users').send({
      name: 'User Supertest',
      username: 'user_supertest',
      email: 'test@example.com',
      password: '123456',
      driver_license: '123456XX',
    })

    expect(responseUser.status).toBe(201)
  })

  it('should not be able to create an user with exists email', async () => {
    const email = faker.internet.email()

    await request(server).post('/users').send({
      name: 'User Supertest',
      username: 'user_supertest',
      email,
      password: '123456',
      driver_license: '123456XX',
    })

    const responseUser = await request(server).post('/users').send({
      name: 'User Supertest',
      username: 'user_supertest',
      email,
      password: '123456',
      driver_license: '123456XX',
    })

    expect(responseUser.status).toBe(400)
  })
})
