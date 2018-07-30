/**
 * A lead is a person before they become and Octave user.
 * These are collected by lead gen web forms and are stored in Airtable.
 */
import * as at from 'at'
import * as Appointment from './appointment'

export const schema = {
  types: `
    type Lead {
      id: ID
      name: String
      email: String
      phone: String
      appointments(
        type: AppointmentType!
      ): [Appointment]
    }
  `,
  queries: `
    lead(id: ID!): Lead
  `,
  mutations: `
    createLead(
      name: String!
      email: String!
      phone: String!
    ): Lead
  `
}

export const toAirtable = args => ({
  id: args.id,
  Name: args.name,
  'Email Address': args.email,
  'Phone Number': args.phone
})

export const fromAirtable = record => ({
  ide: record.id,
  name: record.Name,
  email: record['Email Address'],
  phone: record['Phone Number']
})

export const createLead = async (_root, args) => {
  await at.base('leads').create(toAirtable(args))
  return args
}

export const appointments = lead => () =>
  Appointment.findByTypeAndEmail('IMPRINT_INTERVIEW', lead.email)

export const lead = async (_root, args) => {
  const record = await at.find({ table: 'leads', id: args.id })
  const lead = fromAirtable(record)
  return { ...lead, appointments: appointments(lead) }
}

export const queries = {
  lead
}

export const mutations = {
  createLead
}
