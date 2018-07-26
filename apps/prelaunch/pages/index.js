import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import request from 'superagent'

export default class Body extends React.Component {
  state = {
    formData: {}
  }

  onSubmit = async event => {
    event.preventDefault()
    const name = this.state.formData.name
    const email = this.state.formData.email
    const phone = this.state.formData.phone
    await request.post('/api').send({
      query: `mutation {
        createLead(
          name: "${name}"
          email: "${email}"
          phone: "${phone}"
        ) { name } }`
    })
  }

  onChange = fieldName => event => {
    this.setState({
      formData: { ...this.state.formData, [fieldName]: event.target.value }
    })
  }

  inputProps = fieldName => {
    return { id: fieldName, onChange: this.onChange(fieldName) }
  }

  render () {
    return (
      <div>
        <section className='shapes' />

        <header>
          <div className='logoblock'>
            <img src='/static/images/octave_logo_white.svg' />
            <h1>Therapy, Coaching & Classes</h1>
          </div>
          <div className='ctablock'>
            <p>A transformative approach to wellness.</p>
            <p>Starting in New York City, Fall 2018</p>
            <a href='#leads' className='scroll'>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
              >
                Stay Connected
              </Button>
            </a>
          </div>
        </header>

        <section className='about'>
          <div className='container'>
            <h2>Our Mission</h2>
            <div className='part1'>
              <div className='illustration accessimg' />
              <p>
                Octave envisions a society that is as emotionally resilient as
                it is fitness focused. We will support this by offering
                frictionless access to high quality care.
              </p>
            </div>

            <h2>Our Approach</h2>
            <div className='part2'>
              <div className='illustration approachimg' />
              <ul>
                <li>
                  Designed by thought leaders who have written 70+ books on
                  psychology.
                </li>
                <li>Led by clinicians with 30+ years of experience.</li>
                <li>
                  Composed solely of practitioners who passed rigorous quality
                  screens.
                </li>
                <li>
                  Delivered with a thoughtful approach to your experience with
                  us.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className='valueprops'>
          <div className='container'>
            <div className='vptherapy'>
              <div className='illustration therapyimg' />
              <div className='vpcopyblock' id='therapyheader'>
                <h2>Therapy</h2>
                <p>
                  Our team collectively addresses a wide variety of
                  circumstances. We help you identify the best clinician based
                  on your needs. Our sessions are in person at our calming and
                  thoughtful Octave Studio.
                </p>
              </div>
            </div>

            <div className='vpcoach'>
              <div className='illustration coachimg' />
              <div className='vpcopyblock' id='coachingheader'>
                <h2>Coaching</h2>
                <p>
                  Coaching focuses on giving you the skills to manage your own
                  challenges. Our certified coaches have been trained in
                  mindfulness, cognitive behavioral, and positive psychology
                  skills to help you build habits that make you more productive
                  and resilient.
                </p>
              </div>
            </div>

            <div className='vpclasses'>
              <div className='illustration classesimg' />
              <div className='vpcopyblock' id='classesheader'>
                <h2>Classes</h2>
                <p>
                  Join a class at the Octave Studio on a growing number of
                  topics, including mindfulness techniques and sleep. All of our
                  classes are based on curriculum curated for proven
                  effectiveness.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className='form'>
          <div className='container'>
            <h4>
              Get Started Today<br />Book a Free Consult
            </h4>
            <form id='referrals' onSubmit={this.onSubmit}>
              <h3>Patient/Client Information</h3>
              <TextField
                {...this.inputProps('name')}
                fullWidth
                label='Full Name'
                margin='normal'
                required
              />
              <br />
              <TextField
                {...this.inputProps('patientBirthdate')}
                fullWidth
                label='Birthdate'
                type='date'
                defaultValue='2000-01-01'
                margin='normal'
                InputLabelProps={{
                  shrink: true
                }}
              />
              <br />
              <TextField
                {...this.inputProps('email')}
                fullWidth
                label='Email Address'
                margin='normal'
                required
              />
              <br />
              <TextField
                {...this.inputProps('phone')}
                fullWidth
                label='Phone Number'
                margin='normal'
                required
              />
              <br />
              <br />

              <h3>Referring Provider</h3>
              <TextField
                {...this.inputProps('providerName')}
                fullWidth
                label='Full Name'
                margin='normal'
              />
              <br />
              <TextField
                {...this.inputProps('providerEmail')}
                fullWidth
                label='Email Address'
                margin='normal'
              />
              <br />
              <TextField
                {...this.inputProps('providerPhone')}
                fullWidth
                label='Phone Number'
                margin='normal'
              />
              <br />
              <br />

              <h3>How can Octave help?</h3>
              <TextField
                fullWidth
                label='Any notes?'
                multiline
                rowsMax='4'
                margin='normal'
              />
              <br />
              <br />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
              >
                Submit
              </Button>
            </form>

            <div className='copyright'>
              <h3>© 2018</h3>
            </div>
          </div>
        </section>
      </div>
    )
  }
}
