import React from 'react'
import request from 'superagent'

export default class Body extends React.Component {
  state = {
    step: 0
  }

  static async getInitialProps () {
    const res = await request.post(process.env.APP_URL + '/api').send({
      query: `query {
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
    })
    return { ...res.body.data }
  }

  renderNextButton (text) {
    return (
      <button onClick={() => this.setState({ step: this.state.step + 1 })}>
        {text}
      </button>
    )
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
          src='https://octave.cliniko.com/bookings?business_id=65555&practitioner_id=103104&appointment_type_id=302766&embedded=true'
          frameborder='0'
          scrolling='auto'
          width='500'
          height='500'
        />
        <br />
        {this.renderNextButton('Next (TODO: Remove this for polling)')}
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
