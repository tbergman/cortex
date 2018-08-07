import React from 'react'
import { GraphQLClient } from 'graphql-request'
import { type, margins } from 'styles'
import Button from 'components/button'
import Router from 'next/router'
import * as Appointment from '../lib/appointment'

const gql = new GraphQLClient(process.env.APP_URL + '/api', { headers: {} })

export default class ConsultSchedule extends React.Component {
  state = {
    step: 0
  }

  static async getInitialProps ({ query }) {
    const data = await gql.request(
      `query {
        lead(id: "${query.leadId}") {
          name
        }
        step0: contentModule(name: "consultScheduleStep1") {
          a
          h1
          p
          images(width: 480 height: 270) {
            url
          }
        }
        step1: contentModule(name: "consultScheduleStep2") {
          a
          images(width: 480 height: 270) {
            url
          }
          p
        }
        step2: contentModule(name: "consultScheduleStep3") {
          h1
        }
        step3: contentModule(name: "consultScheduleStep4") {
          h1
          p
          a
          images(width: 480 height: 270) {
            url
          }
        }
      }`
    )
    return { ...data, leadId: query.leadId }
  }

  componentDidMount () {
    this.pollForConsultInterviewAdded()
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
    this.setState({ step: 3 })
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
        <h1>{this.props.step0.h1}</h1>
        <img src={this.props.step0.images[0].url} />
        <p>{this.props.step0.p}</p>
        {this.renderNextButton(this.props.step0.a)}
        <style jsx>{`
          h1 {
            ${type.estebanL} margin-bottom: ${margins.m}px;
          }
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
        <img src={this.props.step1.images[0].url} />
        <p>{this.props.step1.p}</p>
        {this.renderNextButton(this.props.step1.a)}
        <style jsx>{`
          p {
            ${type.apercuM} margin: ${margins.m}px 0;
          }
        `}</style>
      </div>
    )
  }

  renderStep2 () {
    return (
      <div>
        <h1>{this.props.step2.h1}</h1>
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

  renderStep3 () {
    return (
      <div>
        <h1>{this.props.step3.h1}</h1>
        <img src={this.props.step3.images[0].url} />
        <p>{this.props.step3.p}</p>
        <Button
          fullWidth
          variant='contained'
          color='primary'
          onClick={() => Router.push('/')}
        >
          {this.props.step3.a}
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
