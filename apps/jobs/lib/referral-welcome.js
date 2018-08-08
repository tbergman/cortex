/**
 * If a PCP referral is added as a lead to Airtable either via our secret web
 * form or converted from eFax, we invite them to schedule a consult.
 */
import * as notifications from './notifications'

const { APP_URL } = process.env

export default async () =>
  notifications.sendToleads({
    notificationName: 'referralWelcome',
    filter: "{Signup Stage} = 'referral'",
    variables: lead => ({
      scheduleConsultUrl: `${APP_URL}/consult-schedule?leadId=${lead.id}`
    })
  })
