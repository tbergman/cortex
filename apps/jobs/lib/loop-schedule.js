/**
 * A first channel of onboarding where we find new referral leads in Airtable
 * and invite them to schedule a consult.
 */
import * as notifications from './notifications'

const { APP_URL } = process.env

const filter =
  'OR(' +
  [
    "{Signup Stage} = 'schedulingBoth'",
    "{Signup Stage} = 'schedulingCoaching'",
    "{Signup Stage} = 'schedulingTherapy'"
  ].join(', ') +
  ')'

export default () =>
  notifications.sendToleads({
    notificationName: 'loopSchedule',
    filter,
    variables: lead => ({
      scheduleLoopUrl: `${APP_URL}/loop-schedule?leadId=${lead.id}`
    })
  })
