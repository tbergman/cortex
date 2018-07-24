import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export default class Referral extends React.Component {
  onSubmit = event => {
    event.preventDefault()
    console.log('Submit data to Airtable!')
  }

  render () {
    return (
      <div>
        <div className='container'>
          <section className='referralHeader'>
          <img src='/static/images/octave_logo_white.svg' />
          <h3>Refer your patients to Octave</h3>
          <div className='referralHeaderCopy'>
            <div className='referralHeaderCopyMain'>
              <p>
                Octave has world-class licensed practitioners in New York City. Physicians, therapists and clinics are encouraged to refer patients to Octave for evidence-based care with fast and easy patient intake. 
              </p>
              <p>
                Fill out the secure form below to refer a patient or client. If you have questions or would like help setting up an appointment, email referrals@findoctave.com or call (123) 456 - 7890. Referrals can also be faxed to (234) 567 - 8901.
              </p>
            </div>
            <ul>
              <li>A therapy practice designed by a team of practitioners with over 70 published psychology books</li>
              <li>Clinicians with over 30 years experience</li>
              <li>Next day appointments</li>
              <li>Multi-specialty evidence-based care</li>
            </ul>  
          </div>
          </section>
        </div>
        <div>
          <section className='form'>
            <div className='container'>
              <h4>
                Complete this secure referral form and we will follow up with your patient or client.
              </h4>

              <form id='referrals' onSubmit={this.onSubmit}>
                <h3>Patient/Client Information</h3>
                <TextField
                  fullWidth
                  required
                  id='patientName'
                  label='Full Name'
                  // className={classes.textField}
                  // onChange={this.handleChange('name')}
                  margin='normal'
                />
                <br />
                <TextField
                  fullWidth
                  required
                  id='patientBirthdate'
                  label='Birthdate'
                  type='date'
                  defaultValue='2000-01-01'
                  // className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin='normal'
                />
                <br />
                <TextField
                  fullWidth
                  required
                  id='patientEmail'
                  label='Email Address'
                  // className={classes.textField}
                  // onChange={this.handleChange('name')}
                  margin='normal'
                />
                <br />
                <TextField
                  fullWidth
                  required
                  id='patientPhone'
                  label='Phone Number'
                  // className={classes.textField}
                  // onChange={this.handleChange('name')}
                  margin='normal'
                />
                <br />
                <br />

                <h3>Referring Provider</h3>
                <TextField
                  fullWidth
                  required
                  id='providerName'
                  label='Full Name'
                  // className={classes.textField}
                  // onChange={this.handleChange('name')}
                  margin='normal'
                />
                <br />
                <TextField
                  fullWidth
                  required
                  id='providerEmail'
                  label='Email Address'
                  // className={classes.textField}
                  // onChange={this.handleChange('name')}
                  margin='normal'
                />
                <br />
                <TextField
                  fullWidth
                  required
                  id='providerPhone'
                  label='Phone Number'
                  // className={classes.textField}
                  // onChange={this.handleChange('name')}
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
                <Button variant='contained' fullWidth color="primary">Submit</Button>
              </form>

              <div className='copyright'>
                <h3>© 2018</h3>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }
}
