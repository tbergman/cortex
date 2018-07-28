/**
 * After a lead completes preboarding or class scheduling where we poll Airtable
 * to find `onboarded` Signup Stage and invite them to signup to the app.
 */
import * as notifications from './notifications'

export default async () => notifications.sendToleads('onboarding')
