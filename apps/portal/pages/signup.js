import { GraphQLClient } from 'graphql-request'
import Button from 'components/button'
import Link from 'next/link'
import React from 'react'
import Router from 'next/router'

const gql = new GraphQLClient(process.env.APP_URL + '/api', { headers: {} })

export default class Signup extends React.Component {
  state = {
    step: 0,
    tourStep: 0
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
      <div>
        <img src={this.props.signupWelcome.images[0].url} />
        <h1>{this.props.signupWelcome.h1}</h1>
        <p>{this.props.signupWelcome.p}</p>
        {this.renderNextButton(this.props.signupWelcome.a)}
      </div>
    )
  }

  renderStep1 () {
    return (
      <h1>
        Auth0 goes here
        {this.renderNextButton('Next')}
      </h1>
    )
  }

  renderStep2 () {
    return (
      <h1>
        <img src={this.props.signupBilling.images[0].url} />
        <h1>{this.props.signupBilling.h1}</h1>
        <p>{this.props.signupBilling.p}</p>
        {this.renderNextButton(this.props.signupBilling.a)}
      </h1>
    )
  }

  renderStep3 () {
    return (
      <h1>
        <div>
          <Button
            onClick={() => this.setState({ tourStep: this.state.tourStep + 1 })}
          >
            Next
          </Button>
          <img src={this.props.signupTour.images[this.state.tourStep].url} />
          <h1>{this.props.signupTour.h1[this.state.tourStep]}</h1>
          <p>{this.props.signupTour.p[this.state.tourStep]}</p>
        </div>
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
