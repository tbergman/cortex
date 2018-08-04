import Button from 'components/button'
import React from 'react'
import Router from 'next/router'
import * as Appointment from '../lib/appointment'
import { GraphQLClient } from 'graphql-request'

const gql = new GraphQLClient(process.env.APP_URL + '/api')

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
      }`
    )
    return { ...data, leadId: query.leadId }
  }

  async componentDidUpdate () {
    if (this.state.step === 'CoachSchedule') {
      await Appointment.pollForAdded({
        leadId: this.props.leadId,
        type: 'COACHING'
      })
      this.setState({
        step:
          this.props.lead.signupStage === 'SCHEDULING_COACHING'
            ? 'Billing'
            : 'TherapySchedule'
      })
    } else if (this.state.step === 'TherapySchedule') {
      await Appointment.pollForAdded({
        leadId: this.props.leadId,
        type: 'THERAPY'
      })
      this.setState({ step: 'TherapyConfirm' })
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
        Init
        {this.renderNextButton(
          'Next',
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
          src={process.env.CLINIKO_COACHING_CALENDAR_URL}
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

  renderCoachConfirm () {
    return (
      <div>
        Coach Confirm
        {this.renderNextButton('Next', 'TherapySchedule')}
      </div>
    )
  }

  renderTherapySchedule () {
    return (
      <div>
        <iframe
          src={process.env.CLINIKO_THERAPY_CALENDAR_URL}
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
        Therapy Confirm
        {this.renderNextButton('Next', 'Billing')}
      </div>
    )
  }

  renderBilling () {
    return (
      <div>
        Billing
        {this.renderNextButton('Next', 'FinalConfirm')}
      </div>
    )
  }

  renderFinalConfirm () {
    return (
      <div>
        Final Confirm
        <Button
          fullWidth
          variant='contained'
          color='primary'
          onClick={() => Router.push('/')}
        >
          Okay
        </Button>
      </div>
    )
  }

  render () {
    return this['render' + this.state.step]()
  }
}
