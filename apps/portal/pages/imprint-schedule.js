import React from 'react'
import { GraphQLClient } from 'graphql-request'

const gql = new GraphQLClient(process.env.APP_URL + '/api', { headers: {} })
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))

export default class ImprintSchedule extends React.Component {
  state = {
    step: 0
  }

  static async getInitialProps ({ query }) {
    if (!query.leadId) throw new Error('Missing lead ID')
    const data = await gql.request(
      `query {
        step0: contentModule(name: "imprint_schedule_step_1") {
          a
          h1
          p
          images(width: 480 height: 270) {
            url
          }
        }
        step1: contentModule(name: "imprint_schedule_step_2") {
          a
          images(width: 480 height: 270) {
            url
          }
          p
        }
        step2: contentModule(name: "imprint_schedule_step_3") {
          h1
        }
        step3: contentModule(name: "imprint_schedule_step_4") {
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
    this.pollForImprintInterviewAdded()
  }

  pollForImprintInterviewAdded = async () => {
    const res = await gql.request(
      `query {
        lead(id: "${this.props.leadId}") {
          name
          email
          phone
          appointments(type: IMPRINT_INTERVIEW) {
            name
          }
        }
      }`
    )
    const { lead: { appointments: [appointment] } } = res
    if (appointment) {
      await gql.request(
        `mutation {
          updateLead(
            id: "${this.props.leadId}"
            signupStage: IMPRINTING
          ) { name }
        }`
      )
      this.setState({ step: 3 })
    } else {
      await sleep(Number(process.env.CLINIKO_POLL_INTERVAL))
      return this.pollForImprintInterviewAdded()
    }
  }

  nextStep = () => {
    this.setState({ step: this.state.step + 1 })
  }

  renderNextButton (text) {
    return <button onClick={this.nextStep}>{text}</button>
  }

  renderStep0 () {
    return (
      <div>
        <h1>{this.props.step0.h1}</h1>
        <img src={this.props.step0.images[0].url} />
        <p>{this.props.step0.p}</p>
        {this.renderNextButton(this.props.step0.a)}
      </div>
    )
  }

  renderStep1 () {
    return (
      <div>
        <img src={this.props.step1.images[0].url} />
        <p>{this.props.step1.p}</p>
        {this.renderNextButton(this.props.step1.a)}
      </div>
    )
  }

  renderStep2 () {
    return (
      <div>
        <h1>{this.props.step2.h1}</h1>
        <iframe
          src={process.env.CLINIKO_IMPRINT_CALENDAR_URL}
          frameBorder='0'
          scrolling='auto'
          width='500'
          height='500'
        />
      </div>
    )
  }

  renderStep3 () {
    return (
      <div>
        <h1>{this.props.step3.h1}</h1>
        <img src={this.props.step3.images[0].url} />
        <br />
        <a href='/'>{this.props.step0.a}</a>
      </div>
    )
  }

  render () {
    return this['renderStep' + this.state.step]()
  }
}
