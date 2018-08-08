import React from 'react'
import { GraphQLClient } from 'graphql-request'
import { type, margins } from 'styles'
import Button from 'components/button'
import Router from 'next/router'
import * as Appointment from '../lib/appointment'

const gql = new GraphQLClient(process.env.APP_URL + '/api', { headers: {} })

export default class ConsultSchedule extends React.Component {
  state = {
    step: 0,
    disabledNext: false,
    consentedNum: 0
  }

  static async getInitialProps ({ query }) {
    const data = await gql.request(
      `query {
        lead(id: "${query.leadId}") {
          name
        }
        welcome: contentModule(name: "consultScheduleWelcome") {
          a
          images(width: 480 height: 270) {
            url
          }
          p
        }
        calendar: contentModule(name: "consultScheduleCalendar") {
          h1
        }
        confirmation: contentModule(name: "consultScheduleConfirmation") {
          h1
          p
          a
          images(width: 480 height: 270) {
            url
          }
        }
        consent: contentModule(name: "consultScheduleConsent") {
          li
          h1
          p
        }
      }`
    )
    return { ...data, leadId: query.leadId }
  }

  componentDidUpdate () {
    if (this.state.step === 1) this.pollForConsultInterviewAdded()
  }

  pollForConsultInterviewAdded = async () => {
    await Appointment.pollForAdded({
      leadId: this.props.leadId,
      category: 'CONSULT'
    })
    await gql.request(
      `mutation {
        updateLead(
          id: "${this.props.leadId}"
          signupStage: CONSULTING
        ) { name }
      }`
    )
    this.nextStep()
  }

  nextStep = () => {
    this.setState({
      step: this.state.step + 1,
      disabledNext: this.state.step === 1
    })
  }

  renderNextButton (text) {
    return (
      <Button
        fullWidth
        variant='contained'
        color='primary'
        onClick={this.nextStep}
        disabled={
          this.state.disabledNext &&
            this.state.consentedNum <= this.props.consent.li.length - 1
        }
      >
        {text}
      </Button>
    )
  }

  renderStep0 () {
    return (
      <div>
        <img src={this.props.welcome.images[0].url} />
        <p>{this.props.welcome.p}</p>
        {this.renderNextButton(this.props.welcome.a)}
        <style jsx>{`
          p {
            ${type.apercuM} margin: ${margins.m}px 0;
          }
        `}</style>
      </div>
    )
  }

  renderStep1 () {
    return (
      <div>
        <h1>{this.props.calendar.h1}</h1>
        <iframe
          src={process.env.CLINIKO_CONSULT_CALENDAR_URL}
          frameBorder='0'
          scrolling='auto'
        />
        <style jsx>{`
          iframe {
            height: calc(100vh - 200px);
            width: 100%;
          }
          h1 {
            ${type.estebanM} margin-bottom: ${margins.m}px;
          }
        `}</style>
      </div>
    )
  }

  renderStep2 () {
    const onCheck = e => {
      const dir = e.target.checked ? 1 : -1
      this.setState({ consentedNum: this.state.consentedNum + dir })
    }
    return (
      <div>
        <h1>{this.props.consent.h1}</h1>
        <p>{this.props.consent.p}</p>
        <ul>
          {this.props.consent.li.map(text => (
            <li key={text}>
              {text}<input onChange={onCheck} type='checkbox' />
            </li>
          ))}
        </ul>
        {this.renderNextButton('Next')}
      </div>
    )
  }

  renderStep3 () {
    return (
      <div>
        <h1>Quick Assessment</h1>
        {this.renderNextButton('Next')}
      </div>
    )
  }

  renderStep4 () {
    return (
      <div>
        <h1>{this.props.confirmation.h1}</h1>
        <img src={this.props.confirmation.images[0].url} />
        <p>{this.props.confirmation.p}</p>
        <Button
          fullWidth
          variant='contained'
          color='primary'
          onClick={() => Router.push('/')}
        >
          {this.props.confirmation.a}
        </Button>
        <style jsx>{`
          h1 {
            ${type.estebanL} margin-bottom: ${margins.m}px;
          }
          p {
            ${type.apercuM} margin: ${margins.m}px 0;
          }
          img {
            margin-bottom: ${margins.m}px;
          }
        `}</style>
      </div>
    )
  }

  render () {
    return this['renderStep' + this.state.step]()
  }
}
