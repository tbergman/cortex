/**
 * A practitioner is someone on the Octave team who can have appointments with
 * clients. They can be a coach, therapist, guide, or teacher. The data
 * is mainly managed in Cliniko, but could join profile data from Airtable
 * or elsewhere.
 */

export const schema = {
  types: `
    type Practitioner {
      name: String
      description: String
    }
  `
}

export const fromCliniko = practitioner => ({
  name: practitioner.first_name + ' ' + practitioner.last_name,
  description: practitioner.description
})
