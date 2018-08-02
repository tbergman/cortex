import { GraphQLClient } from 'graphql-request'
import Button from 'components/button'
import Link from 'next/link'
import React from 'react'
import Router from 'next/router'

const gql = new GraphQLClient(process.env.APP_URL + '/api', { headers: {} })

export default class Signup extends React.Component {
  state = {
    step: 0
  }

  static async getInitialProps ({ query: { email, type } }) {
    const { signupWelcome, signupBilling, signupTour } = await gql.request(
      `query {
        signupWelcome: contentModule(name: "signupWelcome") {
          h1
          p
          a
          images(width: 500 height: 500) {
            url
          }
        }
        signupBilling: contentModule(name: "signupBilling") {
          h1
          p
          a
          images(width: 500 height: 500) {
            url
          }
        }
        signupTour: contentModule(name: "signupTour") {
          h1
          p
          a
          images(width: 500 height: 500) {
            url
          }
        }
      }`
    )
    return { signupWelcome, signupBilling, signupTour }
  }

  nextStep = () => {
    this.setState({ step: this.state.step + 1 })
  }

  renderNextButton (text) {
    return (
      <Button
        fullWidth
        variant='contained'
        color='primary'
        onClick={this.nextStep}
      >
        {text}
      </Button>
    )
  }

  renderStep0 () {
    return (
      <h1>
        Welcome
        {this.renderNextButton(this.props.signupWelcome.a)}
      </h1>
    )
  }

  renderStep1 () {
    return (
      <h1>
        Account
        {this.renderNextButton('Next')}
      </h1>
    )
  }

  renderStep2 () {
    return (
      <h1>
        Billing
        {this.renderNextButton(this.props.signupBilling.a)}
      </h1>
    )
  }

  renderStep3 () {
    return (
      <h1>
        Tour
        <Link href='/'>
          <Button
            fullWidth
            variant='contained'
            color='primary'
            onClick={() => Router.push('/')}
          >
            {this.props.signupTour.a}
          </Button>
        </Link>
      </h1>
    )
  }

  render () {
    return this['renderStep' + this.state.step]()
  }
}
