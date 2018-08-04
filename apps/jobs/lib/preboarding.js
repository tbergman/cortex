/**
 * A first channel of onboarding where we find new referral leads in Airtable
 * and invite them to schedule a consult.
 */
import * as notifications from './notifications'

export default async () => notifications.sendToleads('preboarding')
