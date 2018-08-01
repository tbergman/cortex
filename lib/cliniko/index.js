/**
 * Library to wrap common operations with the Cliniko API that are cumbersome
 * to repeat.
 *
 * https://github.com/redguava/cliniko-api
 */
import request from 'superagent'

const { CLINIKO_API_KEY, CLINIKO_API_URL } = process.env

/**
 * Sends a POST to create a Cliniko resource
 *
 * @param {Object} options
 * @param {String} options.resource The Cliniko resource name e.g. 'patients'
 * @param {Object} options.data POST data to send in request
 */
export const create = async ({ resource, data }) => {
  const res = await request
    .post(`${CLINIKO_API_URL}/${resource}`)
    .auth(CLINIKO_API_KEY, '')
    .set('Accept', 'application/json')
    .send(data)
  return res.body
}

/**
 * Finds a resource exists by `options.q` filter
 * https://github.com/redguava/cliniko-api#filtering-results
 *
 * @param {Object} options
 * @param {String} options.resource The Cliniko resource name e.g. 'patients'
 * @param {String} options.q The Cliniko filter
 */
export const find = async ({ resource, q }) => {
  const res = await request
    .get(`${CLINIKO_API_URL}/${resource}`)
    .auth(CLINIKO_API_KEY, '')
    .set('Accept', 'application/json')
    .query({ q })
  return res.body
}

/**
 * Checks is a resource exists by `options.q` filter or creates it if it doesn't
 * https://github.com/redguava/cliniko-api#filtering-results
 *
 * @param {Object} options
 * @param {String} options.resource The Cliniko resource name e.g. 'patients'
 * @param {String} options.q The Cliniko filter
 * @param {Object} options.data POST data to send in request
 */
export const findOrCreate = async ({ q, resource, data }) => {
  const { [resource]: records } = await find({ resource, q })
  if (records.length) return records[0]
  else return create({ resource, data })
}
