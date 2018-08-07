/**
 * A lead is a person before they become an Octave user.
 * These are collected by lead gen web forms and are stored in Airtable.
 */
import * as at from 'at'
import * as cliniko from 'cliniko'
import * as Appointment from './appointment'
import _ from 'lodash'

const fields = (method = 'read') =>
  `
  email: String${method === 'create' ? '!' : ''}
  ${{ create: '', read: 'id: ID', update: 'id: ID!' }[method]}
  name: String${method === 'create' ? '!' : ''}
  phone: String${method === 'create' ? '!' : ''}
  signupStage: LeadSignupStage
`

const signupStageMap = {
  referral: 'REFERRAL',
  consulting: 'CONSULTING',
  schedulingCoaching: 'SCHEDULING_COACHING',
  schedulingTherapy: 'SCHEDULING_THERAPY',
  schedulingBoth: 'SCHEDULING_BOTH',
  onboarding: 'ONBOARDING',
  onboarded: 'ONBOARDED'
}

export const schema = {
  types: `
    enum LeadSignupStage {
      ${_.values(signupStageMap).join(' ')}
    }
    type Lead {
      ${fields('read')}
      appointments: [Appointment]
    }
  `,
  queries: `
    lead(id: ID!): Lead
  `,
  mutations: `
    createLead(${fields('create')}): Lead
    updateLead(${fields('update')}): Lead
  `
}

export const toAirtable = args => ({
  id: args.id,
  Name: args.name,
  'Email Address': args.email,
  'Phone Number': args.phone,
  'Signup Stage': _.invert(signupStageMap)[args.signupStage]
})

export const fromAirtable = record => ({
  ide: record.id,
  name: record.Name,
  email: record['Email Address'],
  phone: record['Phone Number'],
  signupStage: signupStageMap[record['Signup Stage']]
})

export const toCliniko = args => ({
  first_name: args.name.split(' ')[0],
  last_name: args.name.split(' ')[1],
  email: args.email
})

export const appointments = lead => args => Appointment.findForEmail(lead.email)

export const lead = async (_root, args) => {
  const record = await at.findOne({ table: 'leads', id: args.id })
  const lead = fromAirtable(record)
  return { ...lead, appointments: appointments(lead) }
}

export const createLead = async (_root, args) => {
  const record = await at.findOrCreate({
    table: 'leads',
    filter: `{Email Address} = '${args.email}'`,
    fields: toAirtable(args)
  })
  await cliniko.findOrCreate({
    resource: 'patients',
    q: `email:=${args.email}`,
    data: toCliniko(args)
  })
  return fromAirtable(record)
}

export const updateLead = async (_root, args) => {
  const record = await at.update({ table: 'leads', fields: toAirtable(args) })
  return fromAirtable(record)
}

export const queries = {
  lead
}

export const mutations = {
  createLead,
  updateLead
}
