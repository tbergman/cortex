import React from 'react'
import Cookie from 'js-cookie'

export default class Body extends React.Component {
  state = {
    user: null
  }

  async componentDidMount () {
    const user = await this.maybeSignupAndGetUser()
    this.setState({ user })
  }

  async maybeSignupAndGetUser () {
    if (Cookie.get('jwt')) return JSON.parse(Cookie.get('jwt'))
    const Auth0Lock = require('auth0-lock').default
    const lock = new Auth0Lock(
      process.env.AUTH0_CLIENT_ID,
      process.env.AUTH0_DOMAIN
    )
    await new Promise((resolve, reject) => {
      lock.on('authenticated', authResult => {
        lock.getUserInfo(authResult.accessToken, (err, jwt) => {
          if (err) reject(err)
          else {
            Cookie.set('jwt', JSON.stringify(jwt))
            resolve(jwt)
          }
        })
      })
      lock.show({ initialScreen: 'signUp' })
    })
  }
  render () {
    return this.state.user ? (
      <h1>Welcome {this.state.user.name}</h1>
    ) : (
      <p>Loading...</p>
    )
  }
}
