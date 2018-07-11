import React from 'react'
import Head from 'next/head'
import _ from 'lodash'
import * as chat from '../lib/chat'

// This would be parsed from the JWT
const CRAIGS_NAME = 'Craigers'
const CRAIGS_EMAIL = 'craigspaeth+2@gmail.com'

const sleep = t => new Promise(r => setTimeout(r, t))

export default class Article extends React.Component {
  constructor () {
    super()
    this.state = { src: null }
    typeof window !== 'undefined' &&
      (window.afterZopimLoad = this.afterZopimLoad)
  }

  afterZopimLoad = _.once(async () => {
    const num = _.random(1, 100)
    window.$zopim.livechat.setName(CRAIGS_NAME + num)
    window.$zopim.livechat.setEmail(CRAIGS_EMAIL)
    window.$zopim.livechat.say('Starting chat' + num)
    await sleep(30000)
    const id = await chat.findVisitorID(CRAIGS_EMAIL)
    const src = `https://dashboard.zopim.com/#visitors/visitor_list/state#!${id.replace('.', '-')}`
    this.setState({ src })
  })

  render () {
    return (
      <div>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
        window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
        d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
        _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute("charset","utf-8");
        $.src="https://v2.zopim.com/?5nEAXepFJPZxiNvrdOaXAGKhNOEhZKIH";z.t=+new Date;$.
        type="text/javascript";e.parentNode.insertBefore($,e)})(document,"script");
        `
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `$zopim(() => setTimeout(() => window.afterZopimLoad(), 1000))`
            }}
          />
        </Head>
        <div>
          {this.state.src
            ? <a target='_blank' href={this.state.src}>
                Give {CRAIGS_NAME} some help
              </a>
            : 'Waiting for chat link....'}
        </div>
      </div>
    )
  }
}
