import * as Lead from '../../models/lead'
import Appointment from '../../models/appointment'

let createCalled = false

jest.mock('at', () => ({
  base: jest.fn().mockReturnValue({ create: () => (createCalled = true) })
}))
jest.mock('../../models/appointment', () => ({
  findByTypeAndEmail: jest.fn()
}))

test('toAirtable transforms args to an airtable schema', () => {
  const lead = Lead.toAirtable({
    name: 'Karen Horney',
    email: 'karen@horney.com'
  })
  expect(lead).toEqual({
    Name: 'Karen Horney',
    'Email Address': 'karen@horney.com'
  })
})

test('fromAirtable transforms args to an airtable schema', () => {
  const lead = Lead.fromAirtable({
    Name: 'Karen Horney',
    'Email Address': 'karen@horney.com'
  })
  expect(lead).toEqual({
    name: 'Karen Horney',
    email: 'karen@horney.com'
  })
})

test('createLead adds a lead to Airtable', async () => {
  await Lead.createLead(null, {
    name: 'Karen Horney',
    email: 'karen@horney.com'
  })
  expect(createCalled).toEqual(true)
})

test('appointments finds appointments by type for a lead', async () => {
  await Lead.appointments({ email: 'karen@horney.com' })()
  const args = Appointment.findByTypeAndEmail.mock.calls[0]
  expect(args[0]).toEqual('IMPRINT_INTERVIEW')
  expect(args[1]).toEqual('karen@horney.com')
})
