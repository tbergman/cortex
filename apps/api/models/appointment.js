/**
 * An appointment is a date for a class, a coach call, a therapy session,
 * or any other date-bound event Octave provides. Later we can join separate
 * models for additional metadata specific to the type of appointment.
 * Currently, all appointments are stored in Cliniko.
 */
import * as cliniko from 'cliniko'
import * as Practitioner from './practitioner'

export const schema = {
  types: `
    type AppointmentTypeRate {
      amount: Float
    }
    type AppointmentType {
      id: ID!
      name: String
      category: AppointmentTypeCategory
      rate: AppointmentTypeRate
    }
    type Appointment {
      endAt: String
      id: ID!
      startAt: String
      type: AppointmentType
      practitioner: Practitioner
    }
    enum AppointmentTypeCategory {
      COACHING
      CONSULT
      THERAPY
    }
  `
}

export const fromCliniko = appt => ({
  endAt: appt.ends_at,
  startAt: appt.starts_at,
  type: async () => {
    const apptType = await cliniko.find({
      url: appt.appointment_type.links.self
    })
    return {
      name: apptType.name,
      category: apptType.category.toUpperCase(),
      rate: async () => {
        const item = await cliniko.find({
          url: apptType.billable_item.links.self
        })
        return { amount: item.price }
      }
    }
  },
  practitioner: async () => {
    return Practitioner.fromCliniko(
      await cliniko.find({ url: appt.practitioner.links.self })
    )
  }
})

/**
 * Fetches Cliniko appointments for a patient by email and appointment type
 *
 * @param {String} email Email address of patient
 * @return {Array} Appointments of that type for that patient
 */
export const findForEmail = async email => {
  const [patient] = await cliniko.find({
    resource: 'patients',
    q: `email:=${email}`
  })
  const { appointments } = await cliniko.find({
    url: patient.appointments.links.self
  })
  return appointments.map(fromCliniko)
}
