import React from 'react'
import * as practices from '../lib/practices'
import qs from 'querystring'

export default class Exercise extends React.Component {
  static async getInitialProps ({ req }) {
    const objName = req
      ? req.query.objName
      : qs.parse(window.location.search).objName
    const exercise = await practices.findExercise(objName)
    return { exercise }
  }

  constructor () {
    super()
    this.state = { formData: {} }
  }

  async onSubmit (e, objName) {
    e.preventDefault()
    await practices.submitExercise(objName, this.state.formData)
  }

  render () {
    return (
      <div>
        <a href='/practices'>back</a>
        <h1>{this.props.exercise.title}</h1>
        <form onSubmit={e => this.onSubmit(e, this.props.exercise.objName)}>
          {this.props.exercise.blocks.map(block => {
            return {
              Checkbox: (
                <label>
                  <input
                    type='Checkbox'
                    onChange={e => {
                      this.setState({
                        formData: Object.assign(this.state.formData, {
                          [block.key]: e.target.checked
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
