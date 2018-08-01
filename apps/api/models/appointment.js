/**
 * An appointment is a date for a class, a coach call, a therapy session,
 * or any other date-bound event Octave provides. Later we can join separate
 * models for additional metadata specific to the type of appointment.
 * Currently, all appointments are stored in Cliniko.
 */
import request from 'superagent'
import _ from 'lodash'

const {
  CLINIKO_API_KEY,
  CLINIKO_API_URL,
  CLINIKO_COACH_SESSION_ID,
  CLINIKO_IMPRINT_INTERVIEW_ID,
  CLINIKO_THERAPY_SESSION_ID
} = process.env

const appointmentTypesMap = {
  COACH_SESSION: CLINIKO_COACH_SESSION_ID,
  IMPRINT_INTERVIEW: CLINIKO_IMPRINT_INTERVIEW_ID,
  THERAPY_SESSION: CLINIKO_THERAPY_SESSION_ID
}

export const schema = {
  types: `
    type Appointment {
      id: ID!
      name: String
      startAt: String
      endAt: String
    }
    enum AppointmentType {
      ${_.keys(appointmentTypesMap).join(' ')}
    }
  `
}

export const fromCliniko = appointment => ({
  name: appointment.appointment_type && appointment.appointment_type.name,
  startAt: appointment.starts_at,
  endAt: appointment.ends_at
})

export const enumToId = type => Number(appointmentTypesMap[type])

/**
 * Fetches Cliniko appointments for a patient by email and appointment type
 *
 * @param {String} type Appointment type enum e.g. 'IMPRINT_INTERVIEW'
 * @param {String} email Email address of patient
 * @return {Array} Appointments of that type for that patient
 */
export const findByTypeAndEmail = async (type, email) => {
  const { body: { patients: [patient] } } = await request
    .get(`${CLINIKO_API_URL}/patients`)
    .auth(CLINIKO_API_KEY, '')
    .set('Accept', 'application/json')
    .query({ q: `email:=${email}` })
  const { body: { appointments } } = await request
    .get(patient.appointments.links.self)
    .auth(CLINIKO_API_KEY, '')
    .set('Accept', 'application/json')
    .query({ q: `appointment_type_id:=${enumToId(type)}` })
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
