import * as Appointment from '../appointment'

jest.mock('graphql-request', () => ({
  GraphQLClient: () => ({
    request: jest.fn().mockResolvedValue({
      lead: { appointments: [{ name: 'Consult FooBar' }] }
    })
  })
}))

test('pollForAdded polls a graphql endpoint for an type of appointment', async () => {
  const appt = await Appointment.pollForAdded({
    leadId: 'karen',
    type: 'CONSULT_INTERVIEW'
  })
  expect(appt.name).toEqual('Consult FooBar')
})
