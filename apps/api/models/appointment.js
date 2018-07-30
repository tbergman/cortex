/**
 * An appointment is a date for a class, a coach call, a therapy session,
 * or any other date-bound event Octave provides. Later we can join separate
 * models for additional metadata specific to the type of appointment.
 * Currently, all appointments are stored in Cliniko.
 */
import request from 'superagent'

const {
  CLINIKO_API_KEY,
  CLINIKO_API_URL,
  CLINIKO_IMPRINT_APPOINTMENT_TYPE_ID
} = process.env

export const schema = {
  types: `
    type Appointment {
      id: ID!
      name: String
      startAt: String
      endAt: String
    }
    enum AppointmentType {
      IMPRINT_INTERVIEW
    }
  `
}

export const fromCliniko = appointment => ({
  name: appointment.appointment_type && appointment.appointment_type.name,
  startAt: appointment.starts_at,
  endAt: appointment.ends_at
})

/**
 * Fetches Cliniko appointments for a patient by email and appointment type
 *
 * @param {String} type Appointment type enum e.g. 'IMPRINT_INTERVIEW'
 * @param {String} email Email address of patient
 * @return {Array} Appointments of that type for that patient
 */
export const findByTypeAndEmail = async (type, email) => {
  const typeId = {
    IMPRINT_INTERVIEW: CLINIKO_IMPRINT_APPOINTMENT_TYPE_ID
  }[type]
  const { body: { patients: [patient] } } = await request
    .get(`${CLINIKO_API_URL}/patients`)
    .auth(CLINIKO_API_KEY, '')
    .set('Accept', 'application/json')
    .query({ q: `email:=${email}` })
  const { body: { appointments } } = await request
    .get(patient.appointments.links.self)
    .auth(CLINIKO_API_KEY, '')
    .set('Accept', 'application/json')
    .query({ q: `appointment_type_id:=${typeId}` })
  const appts = await Promise.all(
    appointments.map(async appt => {
      const { body: appType } = await request
        .get(appt.appointment_type.links.self)
        .auth(CLINIKO_API_KEY, '')
        .set('Accept', 'application/json')
      return fromCliniko({ ...appt, appointment_type: appType })
    })
  )
  return appts
}
