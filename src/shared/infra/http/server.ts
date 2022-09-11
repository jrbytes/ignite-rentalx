import { createConnection } from '@shared/infra/typeorm/data-source'

import { app } from './app'

createConnection()

const port = 3333

app.listen(port, () => {
  console.log(`Live long and prosper! 🚀\nServer running on port ${port}`)
})
