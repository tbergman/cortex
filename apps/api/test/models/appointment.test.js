import * as Appointment from '../../models/appointment'
import superagent from 'superagent'

jest.mock('superagent', () => ({
  get: jest.fn().mockReturnThis(),
  auth: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  query: jest.fn().mockReturnThis()
}))

test('findByTypeAndEmail finds appointment by type and email', async () => {
  superagent.query.mockResolvedValue({
    body: {
      appointments: [
        {
          appointment_type: {
            links: { self: '/appt/type' }
          }
        }
      ],
      patients: [
        {
          appointments: {
            links: {
              self: '/me/appt'
            }
          }
        }
      ]
    }
  })
  await Appointment.findByTypeAndEmail('IMPRINT_INTERVIEW', 'karen@horney.com')
  expect(superagent.query.mock.calls[0][0].q).toEqual('email:=karen@horney.com')
  expect(superagent.query.mock.calls[1][0].q).toContain('appointment_type_id:=')
  expect(superagent.get.mock.calls[2][0]).toContain('/appt/type')
})

test('fromCliniko maps cliniko data to our data model', () => {
  const appt = Appointment.fromCliniko({
    appointment_type: { name: 'Foo' },
    starts_at: Date(),
    ends_at: Date()
  })
  expect(appt.name).toEqual('Foo')
})
