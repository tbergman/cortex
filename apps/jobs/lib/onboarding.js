/**
 * After a lead completes preboarding or class scheduling where we poll Airtable
 * to find `onboarded` Signup Stage and invite them to signup to the app.
 */
import twilio from 'twilio'
import bcrypt from 'bcrypt'
import Airtable from 'airtable'

const {
  AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID,
  SMS_ONBOARDING,
  TWILIO_ACCOUNT_SID,
  TWILIO_BCRYPT_SALT,
  TWILIO_SERVICE_SID,
  TWILIO_TOKEN
} = process.env
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_TOKEN)

const sendWelcomeSMS = async phoneNum => {
  const identity = (await bcrypt.hash(phoneNum, TWILIO_BCRYPT_SALT)).replace(
    /[\W_]+/g,
    ''
  )
  await client.notify.services(TWILIO_SERVICE_SID).bindings.create({
    identity,
    bindingType: 'sms',
    address: phoneNum
  })
  await client.notify.services(TWILIO_SERVICE_SID).notifications.create({
    body: SMS_ONBOARDING,
    identity
  })
}

const findOnboardingLeads = async () => {
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID)
  const records = await new Promise((resolve, reject) => {
    let recs = []
    base('Leads')
      .select({
        maxRecords: 10,
        filterByFormula: "{Signup Stage} = 'onboarding'"
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
  const leads = await findOnboardingLeads()
  await Promise.all(
    leads.map(async lead => {
      const phoneNum = '+1' + lead['Phone Number'].replace(/[\W_]+/g, '')
      await sendWelcomeSMS(phoneNum)
    })
  )
  console.log('📬 Welcome notifications sent!')
}
