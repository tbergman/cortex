import * as Appointment from '../appointment'

jest.mock('graphql-request', () => ({
  GraphQLClient: () => ({
    request: jest.fn().mockResolvedValue({
      lead: {
        appointments: [
          { type: { name: 'Consult FooBar', category: 'CONSULT' } }
        ]
      }
    })
  })
}))

test('pollForAdded polls a graphql endpoint for a category of appointment', async () => {
  const appt = await Appointment.pollForAdded({
    leadId: 'karen',
    category: 'CONSULT'
  })
  expect(appt.type.name).toEqual('Consult FooBar')
})
