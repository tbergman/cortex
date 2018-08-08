/**
 * After a lead schedules a consult or books a class we invite them to signup
 * to the app.
 */
import * as notifications from './notifications'

const { APP_URL } = process.env

export default async () =>
  notifications.sendToleads({
    notificationName: 'appboarding',
    filter: "{Signup Stage} = 'appboarding'",
    variables: () => ({
      signupUrl: `${APP_URL}/signup`
    })
  })
