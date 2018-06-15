import React from 'react'
import * as appointments from '../lib/appointments'

// This would be parsed from the JWT
// Does Auth0 integrate Cliniko/Salesforce 🤔
const CRAIGS_ID = '49628460'

export default class Index extends React.Component {
  constructor () {
    super()
    this.state = { step: 0 }
  }
  // Example using the API to schedule an appointment
  setupIntake = () => {
    appointments.setupImprintInterviewFor(CRAIGS_ID)
  }

  startScheduling = async () => {
    this.setState({ step: 2 })
    const coachName = await appointments.pollForImprintInterviewer(CRAIGS_ID)
    this.setState({ step: 3, coachName })
  }

  render () {
    return (
      <div style={{ width: '800px' }}>
        {
          [
            <div>
              <h1>Welcome to Mindset</h1>
              <img src='https://img.freepik.com/free-vector/busines-man-meditating_23-2147622145.jpg?size=338&ext=jpg' />
              <br />
              <button onClick={() => this.setState({ step: 1 })}>
                Get started
              </button>
            </div>,
            <div>
              <img src='https://cosmopolitan.fetcha.co.za/wp-content/uploads/2017/08/The-Best-Advice-My-Therapist-Ever-Gave-Me.jpg' />
              <h1>
                Mindset puts relationships first, we'll get started by scheduling a coaching appointment
              </h1>
              <br />
              <button onClick={this.startScheduling}>
                Schedule appt.
              </button>
            </div>,
            <div>
              <iframe
                src='https://mindset.cliniko.com/bookings?embedded=true'
                frameborder='0'
                scrolling='auto'
                width='100%'
                height='1000'
              />
            </div>,
            <div>
              <h3>All set!</h3>
              <h1>Meet your coach {this.state.coachName}</h1>
              <p>
                We look forward to seeing you blah blah, check out the app in the meantime.
              </p>
              <button>To the app</button>
              <br />
              <a><small>No thanks</small></a>
            </div>
          ][this.state.step]
        }
      </div>
    )
  }
}
