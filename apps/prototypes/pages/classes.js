import Head from 'next/head'
import React from 'react'
import * as appointments from '../lib/appointments'

// This would be parsed from the JWT
// Does Auth0 integrate Cliniko/Salesforce 🤔
const CRAIGS_ID = 49628460

export default class Index extends React.Component {
  static async getInitialProps ({ req }) {
    const classes = await appointments.findClasses()
    return { classes }
  }

  constructor ({ classes }) {
    super()
    this.state = {
      modalOpen: false,
      bookedClass: null,
      classes,
      loading: false
    }
  }

  async bookClass (_class) {
    this.setState({ loading: true })
    await appointments.addPatientToClass(CRAIGS_ID, _class.id)
    const classes = await appointments.findClasses()
    this.setState({
      loading: false,
      modalOpen: true,
      bookedClass: _class,
      classes
    })
  }

  async cancelClass (_class) {
    this.setState({ loading: true })
    await appointments.removePatientFromClass(CRAIGS_ID, _class.id)
    const classes = await appointments.findClasses()
    this.setState({
      modalOpen: false,
      bookedClass: null,
      classes,
      loading: false
    })
  }

  classToLi (_class, booked = false) {
    return (
      <li>
        <img src={_class.img} />
        <br />
        <small>{_class.text}</small>
        <br />
        <small>{_class.startAtLabel}</small>
        <br />
        <button
          onClick={() =>
            (booked ? this.cancelClass(_class) : this.bookClass(_class))}
        >
          {booked ? 'Cancel' : 'Book'}
        </button>
      </li>
    )
  }

  render () {
    const classes = appointments.patientsAndOtherClasses(
      CRAIGS_ID,
      this.state.classes
    )
    return (
      <div>
        <div className='loading-bar-container'>
          <div className={'loading-bar ' + (this.state.loading && 'loading')} />
        </div>
        {this.state.modalOpen
          ? <div className='modal'>
            <div className='modal-inner'>
              <h1>{this.state.bookedClass.name} reserved</h1>
              <p>
                  Make sure to show up on {this.state.bookedClass.startAtLabel}
              </p>
              <br />
              <small onClick={() => this.cancelClass(this.state.bookedClass)}>
                  Oops, cancel
                </small>
                &nbsp;
              <button onClick={() => this.setState({ modalOpen: false })}>
                  Okay
                </button>
            </div>
          </div>
          : null}
        <Head>
          <link rel='stylesheet' href='/static/normalize.css' />
        </Head>
        <div className='container'>
          {classes.patient.length > 0 &&
            <div>
              <h1>Your Classes</h1>
              <ul>
                {classes.patient.map(_class => this.classToLi(_class, true))}
              </ul>
            </div>}
          <h1>Group Classes</h1>
          <ul>{classes.other.map(_class => this.classToLi(_class))}</ul>
        </div>
        <style jsx>
          {`
          .container {
            margin: 50px;
          }
          .modal {
            background: rgba(0,0,0,0.5);
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
          }
          .modal-inner {
            background: white;
            padding: 20px;
            width: 400px;
            margin: auto;
          }
          .loading-bar-container {
            height: 5px;
            width: 100%;
            background: #eee;
          }
          .loading-bar {
            height: 5px;
            background: blue;
            width: 0px;
          }
          .loading-bar.loading {
            transition: width ease-in-out 3s;
            width: 100%;
          }
        `}
        </style>
      </div>
    )
  }
}
