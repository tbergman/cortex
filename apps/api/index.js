/**
 * GraphQL API and associated endpoints like an image resizer under the /api
 * namespace powered by Apollo Server
 */
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import resizer from './lib/resizer'
import * as Lead from './models/lead'
import * as ContentModule from './models/content-module'
import * as Appointment from './models/appointment'

const app = express()

// Image resizer endpoint
app.get('/api/image', resizer)

// Compose GraphQL types from models
const typeDefs = gql`
${Lead.schema.types}
${ContentModule.schema.types}
${Appointment.schema.types}
  type Mutation {
    ${Lead.schema.mutations}
  }
  type Query {
    ping: String
    ${ContentModule.schema.queries}
    ${Lead.schema.queries}
  }
`

// Compose GraphQL resolvers from models
const resolvers = {
  Mutation: {
    ...Lead.mutations,
    ...ContentModule.mutations
  },
  Query: {
    ping: () => 'pong',
    ...Lead.queries,
    ...ContentModule.queries
  }
}

// Apply server to Express instance
new ApolloServer({ typeDefs, resolvers }).applyMiddleware({ app, path: '/api' })

export default app
