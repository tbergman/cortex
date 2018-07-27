/**
 * A lead is a person before they become and Octave user.
 * These are collected from referral or web form.
 */
import Airtable from 'airtable'

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env

export const toAirtableRecord = args => ({
  Name: args.name,
  'Email Address': args.email,
  'Phone Number': args.phone
})

export const createLead = async (_root, args) => {
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID)
  await base('Leads').create(toAirtableRecord(args))
  return args
}

export const schema = {
  types: `
    type Lead {
      name: String
      email: String
      phone: String
    }
  `,
  mutations: `
    createLead(
      name: String!
      email: String!
      phone: String!
    ): Lead
  `,
  queries: ``
}

export const mutations = {
  createLead
}

export const queries = {}
