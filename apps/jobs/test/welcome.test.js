import welcomeOnboarders from '../lib/welcome'

let twilioMessage, twilioBindingPhoneNum

jest.mock('airtable', () => {
  const base = jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eachPage: (pageCallback, done) => {
        const record = { fields: { 'Phone Number': '(555)-123-4567' } }
        pageCallback([record], jest.fn())
        done()
      }
    })
  })
  return () => ({ base: () => base })
})
jest.mock('bcrypt', () => ({ hash: async () => '$abc_123^' }))
jest.mock('twilio', () => () => ({
  notify: {
    services: () => ({
      bindings: {
        create: data => {
          twilioBindingPhoneNum = data.address
        }
      },
      notifications: {
        create: data => {
          twilioMessage = data
        }
      }
    })
  }
}))

test(`welcomeOnboarders sends onboarding leads a welcome SMS`, async () => {
  await welcomeOnboarders()
  expect(twilioMessage).toEqual({ identity: 'abc123' })
  expect(twilioBindingPhoneNum).toEqual('+15551234567')
})
