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
import * as Practitioner from './models/practitioner'
import * as TreatmentNote from './models/treatment-note'
import * as Client from './models/client'

const app = express()

// Image resizer endpoint
app.get('/api/image', resizer)

// Compose GraphQL types from models
const typeDefs = gql`
  ${Appointment.schema.types}
  ${Client.schema.types}
  ${ContentModule.schema.types}
  ${Lead.schema.types}
  ${Practitioner.schema.types}
  ${TreatmentNote.schema.types}
  type Mutation {
    ${Client.schema.mutations}
    ${Lead.schema.mutations}
    ${TreatmentNote.schema.mutations}
    ${Appointment.schema.mutations}
  }
  type Query {
    ${ContentModule.schema.queries}
    ${Lead.schema.queries}
    ${TreatmentNote.schema.queries}
  }
`

// Compose GraphQL resolvers from models
const resolvers = {
  Mutation: {
    ...Client.mutations,
    ...ContentModule.mutations,
    ...Lead.mutations,
    ...TreatmentNote.mutations,
    ...Appointment.mutations
  },
  Query: {
    ...Lead.queries,
    ...ContentModule.queries,
    ...TreatmentNote.queries
  }
}

// Apply server to Express instance
new ApolloServer({ typeDefs, resolvers }).applyMiddleware({ app, path: '/api' })

export default app
