import React from 'react'
import Input from 'components/input'
// import Button from 'components/button'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default class Referral extends React.Component {
  onSubmit = event => {
    event.preventDefault()
    console.log('Submit data to Airtable!')
  }

  render () {
    return (
      <div>

        <section className='form'>
          <div className='container'>
            <h4>Get Started Today<br />Book a Free Consult</h4>

                      <form id='referrals' onSubmit={this.onSubmit}>
                        
                        <h3>Patient/Client Information</h3>
                          <TextField
                            required
                            id="patientName"
                            label="Full Name"
                            // className={classes.textField}
                            // onChange={this.handleChange('name')}
                            margin="normal"
                          />
                          <br />
                          <TextField
                              required
                              id="patientBirthdate"
                              label="Birthdate"
                              type="date"
                              defaultValue="2000-01-01"
                              // className={classes.textField}
                              InputLabelProps={{
                              shrink: true,
                              }}
                          />
                        <br />
                        <TextField
                            required
                            id="patientEmail"
                            label="Email Address"
                            // className={classes.textField}
                            // onChange={this.handleChange('name')}
                            margin="normal"
                          />
                          <br />
                          <TextField
                            required
                            id="patientPhone"
                            label="Phone Number"
                            // className={classes.textField}
                            // onChange={this.handleChange('name')}
                            margin="normal"
                          />
                          <br /><br />

                        <h3>Referring Provider</h3>
                        <TextField
                            required
                            id="providerName"
                            label="Full Name"
                            // className={classes.textField}
                            // onChange={this.handleChange('name')}
                            margin="normal"
                          />
                          <br />
                        <TextField
                            required
                            id="providerEmail"
                            label="Email Address"
                            // className={classes.textField}
                            // onChange={this.handleChange('name')}
                            margin="normal"
                          />
                          <br />
                          <TextField
                            required
                            id="providerPhone"
                            label="Phone Number"
                            // className={classes.textField}
                            // onChange={this.handleChange('name')}
                            margin="normal"
                          />
                          <br /><br />

                        <h3>How can Octave help?</h3>
                        <TextField
                        label="Any notes?"
                        multiline
                        rowsMax="4"
                        margin="normal"
                        />
                        <br /><br />
                        <Button variant="contained">Submit</Button>
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
