import * as Lead from '../../models/lead'
import airtable from 'airtable'

jest.mock('airtable')

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
  const create = jest.fn()
  const base = jest.fn().mockReturnValue({ create })
  airtable.mockImplementation(() => ({ base: () => base }))
  await Lead.createLead(null, {
    name: 'Karen Horney',
    email: 'karen@horney.com'
  })
  expect(create).toHaveBeenCalled()
})
