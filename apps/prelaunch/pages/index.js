import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from 'components/button'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Checkbox from '@material-ui/core/Checkbox'
import request from 'superagent'

export default class Body extends React.Component {
  state = {
    formData: {},
    therapyCheck: true,
    coachingCheck: true,
    classesCheck: true
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

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked })
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
            <h4>Be the first to know about events and launch dates.</h4>
            <form id='landingLeadGen' onSubmit={this.onSubmit}>
              <TextField
                {...this.inputProps('name')}
                fullWidth
                label='Full Name'
                margin='normal'
                required
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
              <TextField
                {...this.inputProps('zipcode')}
                fullWidth
                label='Zip Code'
                margin='normal'
                required
              />
              <br />
              <br />
              <FormLabel component='legend'>
                What services are you interested in?
              </FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.therapyCheck}
                      onChange={this.handleChange('therapyCheck')}
                      color='primary'
                      value='therapyCheck'
                    />
                  }
                  label='Therapy'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.coachingCheck}
                      onChange={this.handleChange('coachingCheck')}
                      color='primary'
                      value='coachingCheck'
                    />
                  }
                  label='Coaching'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.classesCheck}
                      onChange={this.handleChange('classesCheck')}
                      color='primary'
                      value='classesCheck'
                    />
                  }
                  label='Classes'
                />
              </FormGroup>
              <FormHelperText>Select all that apply</FormHelperText>
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
