import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import expressGraphQL from 'express-graphql'

import schema from './schema'

const server = express()
const port = process.env.PORT || process.env.APP_PORT

server.use(helmet({ frameguard: { action: 'deny' } }))
server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(morgan('dev', { skip: () => process.env.NODE_ENV === 'test' }))

server.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
  })
)

server.listen(port, err => {
  if (err) throw err

  console.log(`   Server listening in "${process.env.NODE_ENV}" mode on port ${port}...`)
})

export default server
