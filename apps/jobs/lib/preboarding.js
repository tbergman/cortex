/**
 * The first part of preboarding where we find new leads in Airtable
 * we've invited to take an imprint interview then send them a welcome
 * notification linking to the coach schedule flow.
 */
import * as notifications from './notifications'

export default async () => notifications.sendToleads('preboarding')
