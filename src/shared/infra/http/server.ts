import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import swaggerUi from 'swagger-ui-express'

import { AppError } from '@shared/errors/AppError'
import { createConnection } from '@shared/infra/typeorm/data-source'

import '@shared/container'

import swaggerFile from '../../../swagger.json'
import { router } from './routes'

createConnection('database_rentx')

const app = express()

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

app.listen(3333, () => {
  console.log('Live long and prosper! 🚀')
})
