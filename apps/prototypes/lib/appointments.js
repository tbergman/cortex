//
// Appointments "model" wrapping Cliniko calls and business logic.
//
const request = require('superagent')
const moment = require('moment')

const { CLINIKO_API_KEY } = process.env
const APPOINTMENT_TYPE_ID = '293633' // e.g. Imprint interview
const BUSINESS_ID = '64529' // e.g. Mindset SoHo
const PRACTICIONER_ID = '99676' // e.g. Kristen

const sleep = t => new Promise(resolve => setTimeout(resolve, t))

export const setupImprintInterviewFor = async patientId => {
  const res = await request
    .post('/v1/individual_appointments')
    .auth(CLINIKO_API_KEY, '')
    .set('Accept', 'application/json')
    .send({
      patient_id: patientId,
      business_id: BUSINESS_ID,
      appointment_type_id: APPOINTMENT_TYPE_ID,
      practitioner_id: PRACTICIONER_ID,
      starts_at: moment().add(1, 'hour'),
      end_at: moment().add(2, 'hours')
    })
  return res
}

export const pollForImprintInterviewer = async patientId => {
  const res = await request
    .get('/v1/individual_appointments')
    .auth(CLINIKO_API_KEY, '')
    .set('Accept', 'application/json')
    .query({
      patient_id: patientId,
      appointment_type_id: APPOINTMENT_TYPE_ID
    })
  const appts = res.body.individual_appointments
  if (appts.length === 0) {
    await sleep(1000)
    return pollForImprintInterviewer(patientId)
  }
  const practitionerLink = appts[0].practitioner.links.self.replace(
    'https://api.cliniko.com',
    ''
  )
  const r = await request
    .get(practitionerLink)
    .auth(CLINIKO_API_KEY, '')
    .set('Accept', 'application/json')
  if (!r.body.display_name) {
    await sleep(1000)
    return pollForImprintInterviewer(patientId)
  }
  return r.body.display_name
}
