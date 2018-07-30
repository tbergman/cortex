/**
 * The assessment page converts a Cliniko treatment note template into a form UI.
 * The submission of this form will submit a treatment note to Cliniko and
 * show a reminder to the client of their upcomming appointment.
 */
import React from 'react'
import _ from 'lodash'

// TODO: Write GraphQL treatment note model and replace this stub
const stubData = {
  data: {
    lead: {
      treatmentNote: {
        name: 'Imprint Interview',
        sections: [
          {
            name: 'Sleeping habits',
            questions: [
              {
                name: 'Do you have trouble sleeping?',
                type: 'RADIO_BUTTON',
                answers: [{ value: 'Yes' }, { value: 'No' }]
              },
              {
                name: 'How many hours per day do you sleep on average',
                type: 'RADIO_BUTTON',
                answers: [
                  { value: '3 or less' },
                  { value: '4' },
                  { value: '5' },
                  { value: '6' },
                  { value: '7' },
                  { value: '8' },
                  { value: '9' },
                  { value: '10' },
                  { value: '11 or more' }
                ]
              }
            ]
          }
        ]
      }
    }
  }
}

export default class Assessment extends React.Component {
  state = {
    formData: {
      sections: [{ questions: [] }]
    }
  }
  static async getInitialProps ({ query: { email, type } }) {
    const apptType = type
      .toUpperCase()
      .split(' ')
      .join('_')
    console.log(
      `
      query {
        lead(email: "${email}") {
          treatmentNote(appointmentType: ${apptType}) {
            sections
          }
      }
      `
    )
    const { data: { lead: { treatmentNote } } } = stubData
    return { treatmentNote }
  }

  onChange ({ sectionIndex, questionIndex, value }) {
    const path = `sections[${sectionIndex}].questions[${questionIndex}].answer`
    this.setState({
      formData: _.set(this.state.formData, path, value)
    })
  }

  onSubmit = event => {
    event.preventDefault()
    console.log(
      `
      mutation {
        createTreatmentNote(${this.state.formData}) { name }
      }
      `
    )
  }

  render () {
    return (
      <form onSubmit={this.onSubmit}>
        <h1>{this.props.treatmentNote.name} Assessment</h1>
        {this.props.treatmentNote.sections.map((section, sectionIndex) => (
          <div key={`section${sectionIndex}`}>
            <h2>{section.name}</h2>
            {section.questions.map((question, questionIndex) => (
              <div key={`question${questionIndex}`}>
                <h3>{question.name}</h3>
                {
                  {
                    RADIO_BUTTON: question.answers.map(
                      (answer, answerIndex) => (
                        <label key={`answer${questionIndex}${answerIndex}`}>
                          <input
                            type='radio'
                            name={question.name}
                            onChange={() =>
                              this.onChange({
                                sectionIndex,
                                questionIndex,
                                value: answer.value
                              })
                            }
                          />
                          {answer.value}
                          <br />
                        </label>
                      )
                    )
                  }[question.type]
                }
              </div>
            ))}
          </div>
        ))}
        <button type='submit'>Submit</button>
      </form>
    )
  }
}
