/**
 * Treatment notes and treatment note templates model pretty closely to
 * Cliniko's models. We use them for assessments preceding an appointment, and
 * may later replace them with a "practice" model that would be our own model
 * for form and content building.
 *
 * https://github.com/redguava/cliniko-api/blob/master/sections/treatment_notes.md
 *
 */
import request from 'superagent'
import * as Appointment from './appointment'
import _ from 'lodash'

const { CLINIKO_API_KEY, CLINIKO_API_URL } = process.env

const treamentNoteTypes = modelType => {
  const namespace = {
    template: 'TreatmentNoteTemplate',
    query: 'TreatmentNote',
    input: 'TreatmentNoteInput'
  }[modelType]
  const inputOrType = modelType === 'input' ? 'input' : 'type'
  return (
    `
    ${inputOrType} ${namespace}Answer {
      value: String
      selected: Boolean
    }
    ${inputOrType} ${namespace}Question {
      name: String
      type: String
      answers: [${namespace}Answer]
      answer: String
    }
    ${inputOrType} ${namespace}Section {
      name: String
      questions: [${namespace}Question]
    }
    ${inputOrType} ${namespace}Content {
      sections: [${namespace}Section]
    }
  ` +
    (modelType !== 'input'
      ? `${inputOrType} ${namespace} {
        name: String
        content: ${namespace}Content
      }`
      : '')
  )
}

export const schema = {
  types: `
    ${treamentNoteTypes('template')}
    ${treamentNoteTypes('query')}
    ${treamentNoteTypes('input')}
  `,
  mutations: `
    createTreatmentNote(
      email: String!
      content: TreatmentNoteInputContent!
      appointmentType: AppointmentType!
    ): TreatmentNote
  `,
  queries: `
    treatmentNoteTemplate(
      appointmentType: AppointmentType!
    ): TreatmentNoteTemplate
  `
}

const treatmentNoteTemplate = async (_root, args) => {
  const apptTypeId = Appointment.enumToId(args.appointmentType)
  const { body: apptType } = await request
    .get(`${CLINIKO_API_URL}/appointment_types/${apptTypeId}`)
    .auth(CLINIKO_API_KEY, '')
    .set('Accept', 'application/json')
  const { body: treatmentNoteTemplate } = await request
    .get(apptType.treatment_note_template.links.self)
    .auth(CLINIKO_API_KEY, '')
    .set('Accept', 'application/json')
  return treatmentNoteTemplate
}

const createTreatmentNote = async (_root, args) => {
  const title = _.capitalize(args.appointmentType.split('_').join(' '))
  const apptTypeId = Appointment.enumToId(args.appointmentType)
  const { body: { patients: [patient] } } = await request
    .get(`${CLINIKO_API_URL}/patients`)
    .auth(CLINIKO_API_KEY, '')
    .set('Accept', 'application/json')
    .query({ q: `email:=${args.email}` })
  await request
    .post(`${CLINIKO_API_URL}/treatment_notes`)
    .auth(CLINIKO_API_KEY, '')
    .set('Accept', 'application/json')
    .send({
      title,
      draft: false,
      content: args.content,
      patient_id: patient.id,
      treatment_note_template_id: apptTypeId
    })
  return { name: title, content: args.content }
}

export const queries = {
  treatmentNoteTemplate
}

export const mutations = {
  createTreatmentNote
}
