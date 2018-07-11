//
// Appointments "model" wrapping Cliniko calls and business logic.
//
import request from 'superagent'
import moment from 'moment'
import marked from 'marked'
import cheerio from 'cheerio'
import _ from 'lodash'

const { CLINIKO_API_KEY } = process.env
const IMPRINT_APPOINTMENT_TYPE_ID = '293633' // e.g. Imprint interview
const BUSINESS_ID = '64529' // e.g. Mindset SoHo
const PRACTICIONER_ID = '99676' // e.g. Kristen

const sleep = t => new Promise(resolve => setTimeout(resolve, t))

const fetcher = method => async (path, data = {}) => {
  const url =
    'http://localhost:3000' + path.replace('https://api.cliniko.com', '')
  const req = request
    [method](url)
    .auth(CLINIKO_API_KEY, '')
    .set('Accept', 'application/json')
  const { body } = await (method === 'get' ? req.query(data) : req.send(data))
  return body
}
const get = fetcher('get')
const post = fetcher('post')
const del = fetcher('del')
const put = fetcher('put')

export const setupImprintInterviewFor = async patientId => {
  const res = await post('/v1/individual_appointments', {
    patient_id: patientId,
    business_id: BUSINESS_ID,
    IMPRINT_appointment_type_id: IMPRINT_APPOINTMENT_TYPE_ID,
    practitioner_id: PRACTICIONER_ID,
    starts_at: moment().add(1, 'hour'),
    end_at: moment().add(2, 'hours')
  })
  return res
}

export const pollForImprintInterviewer = async patientId => {
  const res = await get('/v1/individual_appointments', {
    patient_id: patientId,
    IMPRINT_appointment_type_id: IMPRINT_APPOINTMENT_TYPE_ID
  })
  const appts = res.body.individual_appointments
  if (appts.length === 0) {
    await sleep(1000)
    return pollForImprintInterviewer(patientId)
  }
  const r = await fetch(appts[0].practitioner.links.self)
  if (!r.body.display_name) {
    await sleep(1000)
    return pollForImprintInterviewer(patientId)
  }
  return r.body.display_name
}

export const findClasses = async () => {
  const { group_appointments: appts } = await get('/v1/group_appointments')
  const apptTypes = await Promise.all(
    appts.map(appt => get(appt.appointment_type.links.self))
  )
  const classes = await appts.map((appt, i) => {
    const apptType = apptTypes[i]
    const $ = cheerio.load(marked(apptType.description))
    const img =
      $('img').attr('src') ||
      'https://contour-diamonds.com/wp-content/uploads/2016/01/BUILDING_FPO.jpg'
    const text = $('p').text()
    return {
      id: appt.id,
      name: apptTypes[i].name,
      img,
      text,
      startAtLabel: moment(appt.starts_at).format('MMMM Do YYYY, h:mm a'),
      patientIds: appt.patient_ids
    }
  })
  return classes
}

export const patientsAndOtherClasses = (patientId, classes) => {
  const patient = classes.filter(_class =>
    _.includes(_class.patientIds, patientId)
  )
  const other = classes.filter(
    _class => !_.includes(_class.patientIds, patientId)
  )
  return { other, patient }
}

export const addPatientToClass = async (patientId, classId) => {
  const attendee = await post(`/v1/attendees`, {
    booking_id: classId,
    patient_id: patientId
  })
  return attendee
}

export const removePatientFromClass = async (patientId, classId) => {
  const { attendees } = await get('/v1/attendees', { patient_id: patientId })
  await Promise.all(
    attendees.map(async attendee => {
      const booking = await get(attendee.booking.links.self)
      if (booking.id === classId) await del(`/v1/attendees/${attendee.id}`)
    })
  )
}
