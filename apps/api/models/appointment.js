/**
 * An appointment is a booked date for a class, a coach call, a therapy session,
 * or any other date-bound event Octave provides. Later we can join separate
 * models for additional meta data specific to the type of appointment.
 */
export const schema = {
  types: `
    type Appointment {
      name: String
      date: String
    }
  `,
  mutations: ``,
  queries: ``,
  subscriptions: `
    appointmentAdded: Appointment
  `
}

export const mutations = {}

export const subscriptions = {}

export const queries = {}
