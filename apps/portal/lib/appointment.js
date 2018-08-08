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
 * @param {String} category Enum category for appointment e.g. 'CONSULT'
 */
export const pollForAdded = async ({ leadId, category }) => {
  const res = await gql.request(
    `query {
      lead(id: "${leadId}") {
        name
        appointments {
          id
          startAt
          practitioner {
            name
            description
          }
          type {
            category
            name
            rate {
              amount
            }
          }
        }
      }
    }`
  )
  const { lead: { appointments } } = res
  const [appointment] = appointments.filter(
    appt => appt.type.category === category
  )
  if (appointment) {
    return appointment
  } else {
    await sleep(Number(process.env.CLINIKO_POLL_INTERVAL))
    return pollForAdded({ leadId, category })
  }
}
