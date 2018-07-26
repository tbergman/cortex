import React from 'react'

export default class Body extends React.Component {
  state = {
    step: 0
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
        <h1>Welcome to Octave</h1>
        <img src='http://placekitten.com/500/300' />
        <p>Octave is great</p>
        {this.renderNextButton('Get Started')}
      </div>
    )
  }

  renderStep1 () {
    return (
      <div>
        <p>Octave puts relationships first, so first we'll start by</p>
        {this.renderNextButton('Schedule coaching')}
      </div>
    )
  }

  renderStep2 () {
    return (
      <div>
        <h1>Book through our partner Cliniko</h1>
        <iframe
          src='https://octave.cliniko.com/bookings?business_id=65555&practitioner_id=103104&appointment_type_id=302766&embedded=true'
          frameborder='0'
          scrolling='auto'
          width='500'
          height='500'
        />
        <br />
        {this.renderNextButton('Im all done booking')}
      </div>
    )
  }

  renderStep3 () {
    return (
      <div>
        <h1>You're all set</h1>
        <a href='/'>Done</a>
      </div>
    )
  }

  render () {
    return this['renderStep' + this.state.step]()
  }
}
