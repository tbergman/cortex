//
// Zendesk wrapper lib
//
import request from 'superagent'
import _ from 'lodash'

export const findVisitorID = async email => {
  const { body: chats } = await request
    .get('/api/v2/chats/search')
    .query({ q: `visitor_email:${email}` })
    .auth(process.env.ZENDESK_EMAIL, process.env.ZENDESK_PASSWORD)
  const { body: chat } = await request
    .get(_.first(chats.results).url.replace('https://www.zopim.com/', ''))
    .auth(process.env.ZENDESK_EMAIL, process.env.ZENDESK_PASSWORD)
  return chat.visitor.id
}
