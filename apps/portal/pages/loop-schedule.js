import Button from 'components/button'
import React from 'react'
import Router from 'next/router'

export default class LoopSchedule extends React.Component {
  state = {
    step: 'Init'
  }

  renderNextButton (text, step) {
    return (
      <Button
        fullWidth
        variant='contained'
        color='primary'
        onClick={() => this.setState({ step })}
      >
        {text}
      </Button>
    )
  }

  renderInit () {
    return (
      <div>
        Init
        {this.renderNextButton('Next', 'CoachSchedule')}
      </div>
    )
  }

  renderCoachSchedule () {
    return (
      <div>
        Coach Scheduling
        {this.renderNextButton('Next', 'CoachConfirm')}
      </div>
    )
  }

  renderCoachConfirm () {
    return (
      <div>
        Coach Confirm
        {this.renderNextButton('Next', 'TherapySchedule')}
      </div>
    )
  }

  renderTherapySchedule () {
    return (
      <div>
        Therapy Schedule
        {this.renderNextButton('Next', 'TherapyConfirm')}
      </div>
    )
  }

  renderTherapyConfirm () {
    return (
      <div>
        Therapy Confirm
        {this.renderNextButton('Next', 'Billing')}
      </div>
    )
  }

  renderBilling () {
    return (
      <div>
        Billing
        {this.renderNextButton('Next', 'FinalConfirm')}
      </div>
    )
  }

  renderFinalConfirm () {
    return (
      <div>
        Final Confirm
        <Button
          fullWidth
          variant='contained'
          color='primary'
          onClick={() => Router.push('/')}
        >
          Okay
        </Button>
      </div>
    )
  }

  render () {
    return this['render' + this.state.step]()
  }
}
