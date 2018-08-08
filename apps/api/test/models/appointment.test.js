import * as Appointment from '../../models/appointment'
import cliniko from 'cliniko'

jest.mock('cliniko', () => ({
  destroy: jest.fn()
}))

jest.mock('superagent', () => ({
  get: jest.fn().mockReturnThis(),
  auth: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  query: jest.fn().mockReturnThis()
}))

test('fromCliniko maps cliniko data to our data model', () => {
  const d = Date(1, 2, 3)
  const appt = Appointment.fromCliniko({
    starts_at: d,
    ends_at: Date()
  })
  expect(appt.startAt).toEqual(d)
})

test('deleteAppointment deletes an appointment by id', () => {
  Appointment.deleteAppointment({}, { id: 'foo' })
  expect(cliniko.destroy.mock.calls[0][0].resource).toContain('appointments')
  expect(cliniko.destroy.mock.calls[0][0].id).toEqual('foo')
})
