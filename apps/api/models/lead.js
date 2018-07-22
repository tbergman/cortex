import Airtable from 'airtable'

const { AIRTABLE_API_KEY, AIRTABLE_LEADS_BASE_ID } = process.env

export const toAirtableRecord = args => ({
  Name: args.name,
  'Email Address': args.email
})

export const createLead = async (_root, args) => {
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
    AIRTABLE_LEADS_BASE_ID
  )
  await base('Leads').create(toAirtableRecord(args))
  return args
}

export const schema = {
  types: `
    type Lead {
      name: String
      email: String
    }
  `,
  mutations: `
    createLead(
      name: String!
      email: String!
    ): Lead
  `,
  queries: ``
}

export const mutations = {
  createLead
}

export const queries = {}
