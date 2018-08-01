/**
 * Library to wrap common operations with the Airtable SDK that are cumbersome
 * to repeat.
 */
import Airtable from 'airtable'
import _ from 'lodash'

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env

export const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
  AIRTABLE_BASE_ID
)

/**
 * Creates an Airtable table record and returns its JSON
 *
 * @param {Object} options
 * @param {String} options.table The Airtable table name
 * @param {String} options.fields The Airtable record fields with id
 */
export const create = ({ table, fields }) =>
  base(table)
    .create(fields)
    .then(record => ({ id: record.id, ...record.fields }))

/**
 * Updates an Airtable record and returns its JSON
 *
 * @param {Object} options
 * @param {String} options.table The Airtable table name
 * @param {String} options.fields The Airtable record fields with id
 */
export const update = ({ table, fields }) =>
  base(table)
    .update(fields.id, _.omit(fields, 'id'))
    .then(record => ({ id: record.id, ...record.fields }))

/**
 * Finds a single Airtable table record and returns its JSON
 *
 * @param {Object} options
 * @param {String} options.table The Airtable table name
 * @param {String} options.id The Airtable record id
 */
export const findOne = ({ table, id }) =>
  base(table)
    .find(id)
    .then(record => record.fields)

/**
 * Iterates through pages of an Airtable table and returns all of their JSON
 *
 * @param {Object} options
 * @param {String} options.table The Airtable table name
 * @param {String} options.filter The Airtable filter formula
 */
export const find = ({ table, filter }) =>
  new Promise((resolve, reject) => {
    let recs = []
    base(table)
      .select({
        maxRecords: 100,
        filterByFormula: filter
      })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach(rec => recs.push(rec.fields))
          fetchNextPage()
        },
        err => {
          err ? reject(err) : resolve(recs)
        }
      )
  })

/**
 * Checks is a Airtable record exists by `filter` or creates it if it doesn't
 *
 * @param {Object} options
 * @param {String} options.table The Airtable table name
 * @param {String} options.filter The Airtable filter formula
 * @param {String} options.fields The Airtable record fields with id
 */
export const findOrCreate = async ({ table, filter, fields }) => {
  const records = await find({ table, filter })
  if (records.length) return records[0]
  else return create({ table, fields })
}
