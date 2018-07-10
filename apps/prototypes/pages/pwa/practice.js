import React from 'react'
import * as practices from '../../lib/practices'
import qs from 'querystring'

// This would be parsed from the JWT
const CRAIGS_EMAIL = 'craigspaeth@gmail.com'

export default class Exercise extends React.Component {
  static async getInitialProps ({ req }) {
    const name = req ? req.query.name : qs.parse(window.location.search).name
    const practice = await practices.findPractice(name)
    return { practice }
  }

  constructor () {
    super()
    this.state = { formData: {} }
  }

  async componentDidMount () {
    if ('serviceWorker' in navigator) {
      console.log('registering')
      await navigator.serviceWorker.register('/service-worker.js')
      console.log('service worker registration successful')
    }
  }

  async onSubmit (e, practiceName) {
    e.preventDefault()
    await practices.submitPractice(
      CRAIGS_EMAIL,
      practiceName,
      this.state.formData
    )
  }

  render () {
    return (
      <div>
        <a href='/practices'>back</a>
        <h1>{this.props.practice.name}</h1>
        <form onSubmit={e => this.onSubmit(e, this.props.practice.name)}>
          {this.props.practice.blocks.map(block => {
            return {
              Checkbox: (
                <label>
                  <input
                    type='Checkbox'
                    onChange={e => {
                      this.setState({
                        formData: Object.assign(this.state.formData, {
                          [block.label]: e.target.checked
                        })
                      })
                    }}
                  />
                  {block.label}
                  <br />
                </label>
              )
            }[block.type]
          })}
          <button type='submit'>Submit</button>
        </form>
      </div>
    )
  }
}
