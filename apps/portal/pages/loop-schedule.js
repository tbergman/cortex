import { GraphQLClient } from 'graphql-request'
import * as Appointment from '../lib/appointment'
import Button from 'components/button'
import moment from 'moment'
import React from 'react'
import Router from 'next/router'
import StripeCheckout from 'react-stripe-checkout'

// TODO: Contribute to babel plugin to support destructuring
const APP_URL = process.env.APP_URL
const STRIPE_PUBLISHABLE = process.env.STRIPE_PUBLISHABLE
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
          images(width: 500 height: 400) {
            url
          }
        }
        halfway: contentModule(name: "loopScheduleHalfway") {
          h1
          a
          images(width: 500 height: 400) {
            url
          }
        }
        billing: contentModule(name: "loopScheduleBilling") {
          h1
          h2
          p
          a
          images(width: 500 height: 400) {
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
        confirmed: contentModule(name: "loopScheduleConfirmed") {
          images(width: 500 height: 400) {
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

  onStripeToken = async token => {
    await gql.request(
      `
      mutation {
        createClientFromLead(
          leadId: "${this.props.leadId}"
          stripeSource: "${token.id}"
        ) {
        name
        }
      }
    `
    )
    this.setState({ step: 'Final' })
  }

  cancelConfirmedAppointment = async () => {
    this.setState({ step: this.state.step.replace('Confirm', 'Schedule') })
    await gql.request(
      `mutation {
        deleteAppointment(id: "${this.state.confirmedAppointment.id}") {
          id
        }
      }`
    )
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
        <h1>{this.props.intro.h1}</h1>
        <img src={this.props.intro.images[0].url} />
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
    const i = this.state.step === 'CoachConfirm' ? 0 : 1
    const src = this.props.confirmed.images[i].url
    return (
      <div>
        <small>Confirmed for:</small>
        <h1>
          {this.state.confirmedAppointment.type.name}&nbsp;
        </h1>
        <img src={src} />
        <h3>
          💰 ${this.state.confirmedAppointment.type.rate.amount}/session<br />
          📅
          {' '}
          {moment(this.state.confirmedAppointment.startAt).format('MMMM D')}
          <br />
          💼 {this.state.confirmedAppointment.practitioner.name}<br />
          {this.state.confirmedAppointment.practitioner.description}
        </h3>
        <br />
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
        <Button onClick={this.cancelConfirmedAppointment}>Cancel</Button>
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
        <Button onClick={this.cancelConfirmedAppointment}>Cancel</Button>
      </div>
    )
  }

  renderBilling () {
    return (
      <div>
        <h1>{this.props.billing.h1}</h1>
        <h2>{this.props.billing.h2}</h2><br />
        <img src={this.props.billing.images[0].url} />
        <p>{this.props.billing.p}</p>
        <StripeCheckout
          token={this.onStripeToken}
          stripeKey={STRIPE_PUBLISHABLE}
        />
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
