import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import resizer from './lib/resizer'
import * as Lead from './models/lead'
import * as ContentModule from './models/content-module'

const app = express()

// Image resizer endpoint
app.get('/api/image', resizer)

// Compose GraphQL types from models
const typeDefs = gql`
${Lead.schema.types}
${ContentModule.schema.types}
  type Mutation {
    ${Lead.schema.mutations}
    ${ContentModule.schema.mutations}
  }
  type Query {
    ping: String
    ${ContentModule.schema.queries}
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

new ApolloServer({ typeDefs, resolvers }).applyMiddleware({ app, path: '/api' })

export default app
