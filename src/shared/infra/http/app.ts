import dotenv from 'dotenv'
import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import 'reflect-metadata'
import swaggerUi from 'swagger-ui-express'

import { AppError } from '@shared/errors/AppError'

import '@shared/container'

import swaggerFile from '../../../swagger.json'
import { router } from './routes'

const app = express()
dotenv.config()

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(router)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    })
  }

  return next(
    res.status(500).json({
      status: 'error',
      message: `Internal server error - ${err.message}`,
    })
  )
})

export { app }
