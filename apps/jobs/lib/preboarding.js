/**
 * The first part of preboarding where we poll Airtable to find new leads
 * we've invited to enroll in coaching then send them a welcome notification
 * linking to the coach schedule flow.
 */
import twilio from 'twilio'
import bcrypt from 'bcrypt'
import Airtable from 'airtable'
import mailgun from 'mailgun-js'
import marked from 'marked'

const {
  AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID,
  EMAIL_FROM_ADDRESS,
  MAILGUN_DOMAIN,
  MAILGUN_KEY,
  TWILIO_ACCOUNT_SID,
  TWILIO_BCRYPT_SALT,
  TWILIO_SERVICE_SID,
  TWILIO_TOKEN
} = process.env

const twil = twilio(TWILIO_ACCOUNT_SID, TWILIO_TOKEN)
const mgun = mailgun({
  apiKey: MAILGUN_KEY,
  domain: MAILGUN_DOMAIN
})

const notificationContent = async () => {
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID)
  const records = await new Promise((resolve, reject) => {
    let recs = []
    base('notifications')
      .select({
        maxRecords: 10,
        filterByFormula: `name = 'preboarding'`
      })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach(rec => recs.push(rec.fields))
          fetchNextPage()
        },
        err => {
          err ? reject(err) : resolve(recs)
        }
      )
  })
  return {
    sms: records[0].sms,
    subject: records[0].email_subject,
    body: records[0].email_body
  }
}

const sendSMS = async phoneNum => {
  const identity = (await bcrypt.hash(phoneNum, TWILIO_BCRYPT_SALT)).replace(
    /[\W_]+/g,
    ''
  )
  const { sms: body } = await notificationContent()
  await twil.notify.services(TWILIO_SERVICE_SID).bindings.create({
    identity,
    bindingType: 'sms',
    address: phoneNum
  })
  await twil.notify.services(TWILIO_SERVICE_SID).notifications.create({
    body,
    identity
  })
}

const sendEmail = async email => {
  const { subject, body } = await notificationContent()
  await mgun.messages().send({
    from: EMAIL_FROM_ADDRESS,
    to: email,
    subject,
    html: marked.parse(body)
  })
}

const findPreboardingLeads = async () => {
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID)
  const records = await new Promise((resolve, reject) => {
    let recs = []
    base('Leads')
      .select({
        maxRecords: 10,
        filterByFormula: "{Signup Stage} = 'preboarding'"
      })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach(rec => recs.push(rec.fields))
          fetchNextPage()
        },
        err => {
          err ? reject(err) : resolve(recs)
        }
      )
  })
  return records
}

export default async () => {
  const leads = await findPreboardingLeads()
  const phoneNums = await Promise.all(
    leads.map(async lead => {
      const phoneNum = '+1' + lead['Phone Number'].replace(/[\W_]+/g, '')
      await Promise.all([sendSMS(phoneNum), sendEmail(lead['Email Address'])])
      return phoneNum
    })
  )
  console.log(`📬 Preboarding notifications sent to ${phoneNums.join(', ')}!`)
}
