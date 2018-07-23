import React from 'react'

export default class Body extends React.Component {
  componentDidMount () {
    const Auth0Lock = require('auth0-lock').default
    const lock = new Auth0Lock(
      process.env.AUTH0_CLIENT_ID,
      process.env.AUTH0_DOMAIN
    )
    lock.on('authenticated', authResult => {
      console.log('here', authResult)
    })
    lock.show()
  }
  render () {
    return <h1>Hello World</h1>
  }
}
