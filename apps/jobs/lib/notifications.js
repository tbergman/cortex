/**
 * Lib used to wrap commong operations between Twilio, Mailgun, and Airtable for
 * sending notifications.
 */

import twilio from 'twilio'
import bcrypt from 'bcrypt'
import * as at from 'at'
import mailgun from 'mailgun-js'
import marked from 'marked'
import _ from 'lodash'

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
  const records = await at.find({
    table: 'notifications',
    filter: `name = '${notificationName}'`
  })
  return {
    sms: records[0].sms,
    subject: records[0].emailSubject,
    body: records[0].emailBody
  }
}

const replaceVariables = (copy, variables) =>
  _.reduce(
    variables,
    (copy, val, key) => copy.replace(new RegExp(`{{${key}}}`, 'g'), val),
    copy
  )

const sendSMS = async ({ notificationName, phoneNum, variables }) => {
  const identity = (await bcrypt.hash(phoneNum, TWILIO_BCRYPT_SALT)).replace(
    /[\W_]+/g,
    ''
  )
  const { sms } = await notificationContent(notificationName)
  const body = replaceVariables(sms, variables)
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

const sendEmail = async ({ notificationName, email, variables }) => {
  const { subject, body } = await notificationContent(notificationName)
  const html = replaceVariables(marked.parse(body || ''), variables)
  await mgun.messages().send({
    from: EMAIL_FROM_ADDRESS,
    to: email,
    subject,
    html
  })
}

/**
 * Finds leads in Airtable and sends them an SMS + email notification from
 * the copy also managed in Airtable.
 *
 * @param {Object} options
 * @param {String} options.filter Airtable filter formula
 * @param {String} options.notificationName Notification name in Airtable
 * @param {Function} options.variables Function that returns map of mustache variables to inject
 */
export const sendToleads = async ({
  notificationName,
  filter,
  variables = () => {}
}) => {
  const leads = await at.find({
    table: 'leads',
    filter
  })
  const phoneNums = await Promise.all(
    leads.map(async lead => {
      const phoneNum = '+1' + lead['Phone Number'].replace(/[\W_]+/g, '')
      await Promise.all([
        sendSMS({ notificationName, phoneNum, variables: variables(lead) }),
        sendEmail({
          notificationName,
          email: lead['Email Address'],
          variables: variables(lead)
        })
      ])
      return phoneNum
    })
  )
  console.log(`📬  Notifications sent to ${phoneNums.join(', ')}!`)
}
