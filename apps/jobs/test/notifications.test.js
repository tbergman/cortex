import { sendToleads } from '../lib/notifications'

let twilioMsg, twilioBindingPhoneNum, mailgunMsg

jest.mock('airtable', () => {
  const base = jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eachPage: (pageCallback, done) => {
        const record = {
          fields: {
            sms: 'Yo! World',
            emailSubject: 'Hello World',
            emailBody: 'Well hello there {{world}}, how are you today',
            'Email Address': 'karen@horney.com',
            'Phone Number': '(555)-123-4567'
          }
        }
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
          twilioMsg = data
        }
      }
    })
  }
}))
jest.mock('mailgun-js', () => () => ({
  messages: () => ({
    send: data => (mailgunMsg = data)
  })
}))

test(`sendToleads sends onboarding leads a welcome SMS`, async () => {
  await sendToleads({})
  expect(twilioMsg).toMatchObject({ identity: 'abc123', body: 'Yo! World' })
  expect(twilioBindingPhoneNum).toEqual('+15551234567')
})

test(`sendToleads sends onboarding leads a welcome email`, async () => {
  await sendToleads({})
  expect(mailgunMsg.html).toMatch(
    '<p>Well hello there {{world}}, how are you today</p>'
  )
  expect(mailgunMsg.to).toEqual('karen@horney.com')
})

test(`sendToleads replaces variables in copy`, async () => {
  await sendToleads({ variables: () => ({ world: 'Earth' }) })
  expect(mailgunMsg.html).toMatch(
    '<p>Well hello there Earth, how are you today</p>'
  )
  expect(mailgunMsg.to).toEqual('karen@horney.com')
})
