import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import * as Lead from './models/lead'

const app = express()

// Compose GraphQL types from models
const typeDefs = gql`
${Lead.schema.types}
  type Mutation {
    ${Lead.schema.mutations}
  }
  type Query {
    ping: String
    ${Lead.schema.queries}
  }
`

// Compose GraphQL resolvers from models
const resolvers = {
  Mutation: {
    ...Lead.mutations
  },
  Query: {
    ping: () => 'pong',
    ...Lead.queries
  }
}

new ApolloServer({ typeDefs, resolvers }).applyMiddleware({ app, path: '/api' })

export default app
