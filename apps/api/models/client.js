/**
 * Octave users or patients who are actively participating in Octave services
 * like coaching/therapy/etc. A client wraps a couple services that manage
 * these "authenticated" actions like Stripe, Auth0, Cliniko, etc.
 */
import * as Lead from './lead'
import stripePackage from 'stripe'
import { ManagementClient } from 'auth0'

const {
  AUTH0_DOMAIN,
  AUTH0_MANAGEMENT_CLIENT_ID,
  AUTH0_MANAGEMENT_CLIENT_SECRET,
  STRIPE_SECRET
} = process.env

const stripe = stripePackage(STRIPE_SECRET)
const auth0 = new ManagementClient({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: AUTH0_MANAGEMENT_CLIENT_SECRET,
  scope: 'create:users'
})

const fields = (method = 'read') =>
  `
  ${{ create: '', read: 'id: ID', update: 'id: ID!' }[method]}
  email: String${method === 'create' ? '!' : ''}
  name: String${method === 'create' ? '!' : ''}
  `

export const schema = {
  types: `
    type Client {
      ${fields('read')}
    }
  `,
  mutations: `
    createClientFromLead(
      leadId: String!
      stripeSource: String!
    ): Client
  `
}

export const createClientFromLead = async (_root, args) => {
  const lead = await Lead.findById(args.leadId)
  const customer = await stripe.customers.create({
    source: args.stripeSource,
    email: lead.email
  })
  const user = await auth0.createUser({
    name: lead.name,
    email: lead.email,
    connection: 'email',
    user_metadata: {
      stripeCustomerId: customer.id
    }
  })
  return { name: user.name, email: user.email }
}

export const mutations = {
  createClientFromLead
}
