import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

export default class Body extends React.Component {
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
              <button>Stay Connected</button>
            </a>
          </div>
        </header>

        <section className='about'>

          <div className='container'>

            <h2>Our Mission</h2>
            <div className='part1'>
              <div className='illustration accessimg' />
              <p>
                Octave envisions a society that is as emotionally resilient as it is fitness focused. We will support this by offering
                frictionless access to high quality care.
              </p>
            </div>

            <h2>Our Approach</h2>
            <div className='part2'>
              <div className='illustration approachimg' />
              <ul>
                <li>
                  Designed by thought leaders who have written 70+ books on psychology.
                </li>
                <li>Led by clinicians with 30+ years of experience.</li>
                <li>
                  Composed solely of practitioners who passed rigorous quality screens.
                </li>
                <li>
                  Delivered with a thoughtful approach to your experience with us.
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
                  Our team collectively addresses a wide variety of circumstances. We help you identify the best clinician based on your
                  needs. Our sessions are in person at our calming and thoughtful Octave Studio.
                </p>
              </div>
            </div>

            <div className='vpcoach'>
              <div className='illustration coachimg' />
              <div className='vpcopyblock' id='coachingheader'>
                <h2>Coaching</h2>
                <p>
                  Coaching focuses on giving you the skills to manage your own challenges. Our certified coaches have been trained in
                  mindfulness, cognitive behavioral, and positive psychology skills to help you build habits that make you more productive
                  and resilient.
                </p>
              </div>
            </div>

            <div className='vpclasses'>
              <div className='illustration classesimg' />
              <div className='vpcopyblock' id='classesheader'>
                <h2>Classes</h2>
                <p>
                  Join a class at the Octave Studio on a growing number of topics, including mindfulness techniques and sleep. All of
                  our classes are based on curriculum curated for proven effectiveness.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className='form'>
          <div className='container'>
            <div className='airtable' id='leads'>
              <iframe
                className='airtable-embed airtable-dynamic-height'
                src='https://airtable.com/embed/shr13Mne0It2ltmH0?backgroundColor=purple'
                frameBorder='0'
                width='100%'
                height='1066'
              />
            </div>
            <div>
              <TextField
                required
                id='firstName'
                label='Required'
                defaultValue='First Name'
                margin='normal'
              />

              <TextField
                required
                id='lastName'
                label='Required'
                defaultValue='Last Name'
                margin='normal'
              />

              <TextField
                required
                id='emailAddress'
                label='Required'
                defaultValue='example@email.com'
                margin='normal'
              />

              <TextField
                required
                id='zipCode'
                label='Number'
                defaultValue='10017'
                type='number'
                margin='normal'
              />

              <Button variant='raised' color='primary'>
                Submit!
              </Button>
            </div>
            <div className='copyright'>
              <h3>© 2018</h3>
            </div>
          </div>
        </section>
      </div>
    )
  }
}
