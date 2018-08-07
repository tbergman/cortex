import { GraphQLClient } from 'graphql-request'
import * as Appointment from '../lib/appointment'
import Button from 'components/button'
import React from 'react'
import Router from 'next/router'
import StripeCheckout from 'react-stripe-checkout'

// TODO: Contribute to babel plugin to support destructuring
const APP_URL = process.env.APP_URL
const STRIPE_PUBLISHABLE_TOKEN = process.env.STRIPE_PUBLISHABLE_TOKEN
const CLINIKO_COACHING_CALENDAR_URL = process.env.CLINIKO_COACHING_CALENDAR_URL
const CLINIKO_THERAPY_CALENDAR_URL = process.env.CLINIKO_THERAPY_CALENDAR_URL

const gql = new GraphQLClient(APP_URL + '/api')

export default class LoopSchedule extends React.Component {
  state = {
    step: 'Init'
  }

  static async getInitialProps ({ query }) {
    const data = await gql.request(
      `query {
        lead(id: "${query.leadId}") {
          name
          signupStage
        }
        intro: contentModule(name: "loopScheduleIntro") {
          h1
          p
          a
          images(width: 500 height: 500) {
            url
          }
        }
        halfway: contentModule(name: "loopScheduleHalfway") {
          h1
          a
          images(width: 500 height: 500) {
            url
          }
        }
        billing: contentModule(name: "loopScheduleBilling") {
          h1
          p
          a
          images(width: 500 height: 500) {
            url
          }
        }
        final: contentModule(name: "loopScheduleFinal") {
          h1
          p
          a
          images(width: 500 height: 500) {
            url
          }
        }
      }`
    )
    return { ...data, leadId: query.leadId }
  }

  async componentDidUpdate () {
    if (this.state.step === 'CoachSchedule') {
      const appointment = await Appointment.pollForAdded({
        leadId: this.props.leadId,
        category: 'COACHING'
      })
      this.setState({
        step: 'CoachConfirm',
        confirmedAppointment: appointment
      })
    } else if (this.state.step === 'TherapySchedule') {
      const appointment = await Appointment.pollForAdded({
        leadId: this.props.leadId,
        category: 'THERAPY'
      })
      this.setState({
        step: 'TherapyConfirm',
        confirmedAppointment: appointment
      })
    }
  }

  renderNextButton (text, step) {
    return (
      <Button
        fullWidth
        variant='contained'
        color='primary'
        onClick={() => this.setState({ step })}
      >
        {text}
      </Button>
    )
  }

  renderInit () {
    return (
      <div>
        <img src={this.props.intro.images[0].url} />
        <h1>{this.props.intro.h1}</h1>
        <p>{this.props.intro.p}</p>
        {this.renderNextButton(
          this.props.intro.a[0],
          this.props.lead.signupStage === 'SCHEDULING_THERAPY'
            ? 'TherapySchedule'
            : 'CoachSchedule'
        )}
      </div>
    )
  }

  renderCoachSchedule () {
    return (
      <div>
        <iframe
          src={CLINIKO_COACHING_CALENDAR_URL}
          frameBorder='0'
          scrolling='auto'
        />
        <style jsx>
          {`
            iframe {
              width: 100%;
              height: calc(100vh - 200px);
            }
          `}
        </style>
      </div>
    )
  }

  renderConfirmedAppoinment () {
    return (
      <div>
        <h3>Confirmed for:</h3>
        <h1>{this.state.confirmedAppointment.type.name}</h1>
        <h2>{this.state.confirmedAppointment.type.rate.amount}</h2>
        <h4>{this.state.confirmedAppointment.startAt}</h4>
        <h5>{this.state.confirmedAppointment.practitioner.name}</h5>
        <p>{this.state.confirmedAppointment.practitioner.description}</p>
      </div>
    )
  }

  renderCoachConfirm () {
    return (
      <div>
        {this.renderConfirmedAppoinment()}
        {this.renderNextButton(
          'Next',
          this.props.lead.signupStage === 'SCHEDULING_COACHING'
            ? 'Billing'
            : 'Halfway'
        )}
      </div>
    )
  }

  renderHalfway () {
    return (
      <div>
        <img src={this.props.halfway.images[0].url} />
        <h1>{this.props.halfway.h1}</h1>
        {this.renderNextButton('Next', 'TherapySchedule')}
      </div>
    )
  }

  renderTherapySchedule () {
    return (
      <div>
        <iframe
          src={CLINIKO_THERAPY_CALENDAR_URL}
          frameBorder='0'
          scrolling='auto'
        />
        Therapy Schedule
        <style jsx>
          {`
            iframe {
              width: 100%;
              height: calc(100vh - 200px);
            }
          `}
        </style>
      </div>
    )
  }

  renderTherapyConfirm () {
    return (
      <div>
        {this.renderConfirmedAppoinment()}
        {this.renderNextButton('Next', 'Billing')}
      </div>
    )
  }

  renderBilling () {
    return (
      <div>
        <h1>{this.props.billing.h1}</h1>
        <StripeCheckout
          token={console.log.bind(console)}
          stripeKey={STRIPE_PUBLISHABLE_TOKEN}
        />
        <img src={this.props.billing.images[0].url} />
        <p>{this.props.billing.p}</p>
        {this.renderNextButton(this.props.billing.a[0], 'Final')}
      </div>
    )
  }

  renderFinal () {
    return (
      <div>
        <h1>{this.props.final.h1}</h1>
        <img src={this.props.final.images[0].url} />
        <p>{this.props.final.p}</p>
        <Button
          fullWidth
          variant='contained'
          color='primary'
          onClick={() => Router.push('/')}
        >
          {this.props.final.a}
        </Button>
      </div>
    )
  }

  render () {
    return this['render' + this.state.step]()
  }
}
