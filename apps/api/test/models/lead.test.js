import * as Lead from '../../models/lead'

let createCalled = false

jest.mock('at', () => ({
  base: jest.fn().mockReturnValue({ create: () => (createCalled = true) })
}))

test('toAirtableRecord transforms args to an airtable schema', () => {
  const lead = Lead.toAirtableRecord({
    name: 'Karen Horney',
    email: 'karen@horney.com'
  })
  expect(lead).toEqual({
    Name: 'Karen Horney',
    'Email Address': 'karen@horney.com'
  })
})

test('createLead adds a lead to Airtable', async () => {
  await Lead.createLead(null, {
    name: 'Karen Horney',
    email: 'karen@horney.com'
  })
  expect(createCalled).toEqual(true)
})
