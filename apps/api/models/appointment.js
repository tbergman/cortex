/**
 * An appointment is a date for a class, a coach call, a therapy session,
 * or any other date-bound event Octave provides. Later we can join separate
 * models for additional metadata specific to the type of appointment.
 * Currently, all appointments are stored in Cliniko.
 */
import _ from 'lodash'
import * as cliniko from 'cliniko'

const {
  CLINIKO_COACHING_ID,
  CLINIKO_CONSULT_INTERVIEW_ID,
  CLINIKO_THERAPY_ID
} = process.env

const appointmentTypesMap = {
  COACHING: CLINIKO_COACHING_ID,
  CONSULT_INTERVIEW: CLINIKO_CONSULT_INTERVIEW_ID,
  THERAPY: CLINIKO_THERAPY_ID
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
 * @param {String} type Appointment type enum e.g. 'CONSULT_INTERVIEW'
 * @param {String} email Email address of patient
 * @return {Array} Appointments of that type for that patient
 */
export const findByTypeAndEmail = async (type, email) => {
  const [patient] = await cliniko.find({
    resource: 'patients',
    q: `email:=${email}`
  })
  const { appointments } = await cliniko.find({
    url: patient.appointments.links.self,
    q: `appointment_type_id:=${enumToId(type)}`
  })
  const appts = await Promise.all(
    appointments.map(async appt => {
      const appType = await cliniko.find({
        url: appt.appointment_type.links.self,
        q: `appointment_type_id:=${enumToId(type)}`
      })
      return fromCliniko({ ...appt, appointment_type: appType })
    })
  )
  return appts
}
