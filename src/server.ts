import express from 'express'
import swaggerUi from 'swagger-ui-express'

import { createConnection } from './database/data-source'
import './shared/container'
import { router } from './routes'
import swaggerFile from './swagger.json'

createConnection('database_rentx')

const app = express()

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(router)

app.listen(3333, () => {
  console.log('Live long and prosper! 🚀')
})
