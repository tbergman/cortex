/**
 * "View model" for common appointment related operations like polling for an
 * appointment to be added.
 */
import { GraphQLClient } from 'graphql-request'

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))
const gql = new GraphQLClient(process.env.APP_URL + '/api', { headers: {} })

/**
 * Polls until an appointment is created and returns the appointment.
 *
 * @param {String} leadId Lead ID e.g. 'rec1234'
 * @param {String} type Enum type for appointment e.g. 'CONSULT_INTERVIEW'
 */
export const pollForAdded = async ({ leadId, type }) => {
  const res = await gql.request(
    `query {
      lead(id: "${leadId}") {
        name
        email
        phone
        appointments(type: ${type}) {
          name
        }
      }
    }`
  )
  const { lead: { appointments: [appointment] } } = res
  if (appointment) {
    return appointment
  } else {
    await sleep(Number(process.env.CLINIKO_POLL_INTERVAL))
    return pollForAdded({ leadId, type })
  }
}
