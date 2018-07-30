/**
 * Library to wrap common operations with the Airtable SDK that are cumbersome
 * to repeat.
 */
import Airtable from 'airtable'

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env

export const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
  AIRTABLE_BASE_ID
)

/**
 * Finds a single Airtable table and returns its JSON
 *
 * @param {Object} options
 * @param {String} options.table The Airtable table name
 * @param {String} options.id The Airtable record id
 */
export const find = ({ table, id }) =>
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
export const findAll = ({ table, filter }) =>
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
