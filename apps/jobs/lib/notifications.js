/**
 * Lib used to wrap commong operations between Twilio, Mailgun, and Airtable for
 * sending notifications.
 */

import twilio from 'twilio'
import bcrypt from 'bcrypt'
import * as at from 'at'
import mailgun from 'mailgun-js'
import marked from 'marked'

const {
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

const notificationContent = async notificationName => {
  const records = await at.findAll({
    table: 'notifications',
    filter: `name = '${notificationName}'`
  })
  return {
    sms: records[0].sms,
    subject: records[0].emailSubject,
    body: records[0].emailBody
  }
}

const sendSMS = async (notificationName, phoneNum) => {
  const identity = (await bcrypt.hash(phoneNum, TWILIO_BCRYPT_SALT)).replace(
    /[\W_]+/g,
    ''
  )
  const { sms: body } = await notificationContent(notificationName)
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

const sendEmail = async (notificationName, email) => {
  const { subject, body } = await notificationContent(notificationName)
  await mgun.messages().send({
    from: EMAIL_FROM_ADDRESS,
    to: email,
    subject,
    html: marked.parse(body || '')
  })
}

/**
 * Finds leads in Airtable and sends them an SMS + email notification from
 * the copy also managed in Airtable.
 *
 * @param {String} signupStage signupStage value in Airtable
 * @param {String} [notificationName=signupStage] Name in Airtable
 */
export const sendToleads = async (
  signupStage,
  notificationName = signupStage
) => {
  const leads = await at.findAll({
    table: 'leads',
    filter: `{Signup Stage} = '${signupStage}'`
  })
  const phoneNums = await Promise.all(
    leads.map(async lead => {
      const phoneNum = '+1' + lead['Phone Number'].replace(/[\W_]+/g, '')
      await Promise.all([
        sendSMS(notificationName, phoneNum),
        sendEmail(notificationName, lead['Email Address'])
      ])
      return phoneNum
    })
  )
  console.log(
    `📬  "${signupStage}" notifications sent to ${phoneNums.join(', ')}!`
  )
}
