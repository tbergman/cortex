/**
 * The assessment page converts a Cliniko treatment note template into a form UI.
 * The submission of this form will submit a treatment note to Cliniko and
 * show a reminder to the client of their upcomming appointment.
 */
import React from 'react'
import _ from 'lodash'
import request from 'superagent'

export default class Assessment extends React.Component {
  static async getInitialProps ({ query: { email, type } }) {
    const apptType = type.toUpperCase().split(' ').join('_')
    const { body: { data: { treatmentNoteTemplate } } } = await request
      .post(process.env.APP_URL + '/api')
      .send({
        query: `
          query {
            treatmentNoteTemplate(appointmentType: ${apptType}) {
              name
              content {
                sections {
                  name
                  questions {
                    name
                    type
                    answers {
                      value
                    }
                  }
                }
              }
            }
          }
        `
      })
    return { treatmentNoteTemplate, email }
  }

  constructor (props) {
    super(props)
    this.state = { formData: props.treatmentNoteTemplate }
  }

  onSubmit = async event => {
    event.preventDefault()
    await request.post(process.env.APP_URL + '/api').send({
      query: `
      mutation CreateTreatmentNote($content: TreatmentNoteInputContent!) {
        createTreatmentNote(
          email: "${this.props.email}"
          content: $content
          appointmentType: IMPRINT_INTERVIEW
        ) {
          name
        }
      }
      `,
      variables: { content: this.state.formData.content }
    })
  }

  onSelectRadio = ({ sectionIndex, questionIndex, answerIndex }) => {
    const answersPath = [
      'content',
      `sections[${sectionIndex}]`,
      `questions[${questionIndex}]`,
      'answers'
    ].join('.')
    const templateAnswers = _.get(this.props.treatmentNoteTemplate, answersPath)
    const newAnswers = [
      ...templateAnswers.slice(0, answerIndex),
      { ...templateAnswers[answerIndex], selected: true },
      ...templateAnswers.slice(answerIndex + 1)
    ]
    this.setState({
      formData: _.set(
        _.cloneDeep(this.state.formData),
        answersPath,
        newAnswers
      )
    })
  }

  onSelectCheckbox = ({ sectionIndex, questionIndex, answerIndex }) => {
    const answerPath = [
      'content',
      `sections[${sectionIndex}]`,
      `questions[${questionIndex}]`,
      `answers[${answerIndex}]`
    ].join('.')
    const currentAnswer = _.get(this.state.formData, answerPath)
    const newAnswer = currentAnswer.selected
      ? _.omit(currentAnswer, 'selected')
      : { ...currentAnswer, selected: true }
    this.setState({
      formData: _.set(_.cloneDeep(this.state.formData), answerPath, newAnswer)
    })
  }

  onChangeText ({ sectionIndex, questionIndex, value }) {
    const questionPath = [
      'content',
      `sections[${sectionIndex}]`,
      `questions[${questionIndex}]`
    ].join('.')
    const newQuestion = {
      ..._.omit(_.get(this.state.formData, questionPath), 'answers'),
      answer: value
    }
    this.setState({
      formData: _.set(
        _.cloneDeep(this.state.formData),
        questionPath,
        newQuestion
      )
    })
  }

  renderText ({ sectionIndex, questionIndex }) {
    return (
      <label>
        <input
          required
          onChange={e =>
            this.onChangeText({
              sectionIndex,
              questionIndex,
              value: e.target.value
            })}
        >
          {}
        </input>
      </label>
    )
  }

  renderParagraph ({ sectionIndex, questionIndex }) {
    return (
      <label>
        <textarea
          required
          onChange={e =>
            this.onChangeText({
              sectionIndex,
              questionIndex,
              value: e.target.value
            })}
        >
          {}
        </textarea>
      </label>
    )
  }

  renderCheckboxes ({ sectionIndex, questionIndex }) {
    // prettier-ignore
    const question = this
      .props
      .treatmentNoteTemplate
      .content.sections[sectionIndex]
      .questions[questionIndex]
    return question.answers.map((_answer, answerIndex) => (
      <label key={`answer${questionIndex}${answerIndex}`}>
        <input
          type='checkbox'
          name={question.name}
          onChange={() =>
            this.onSelectCheckbox({ sectionIndex, questionIndex, answerIndex })}
        />
        {_answer.value}
        <br />
      </label>
    ))
  }

  renderRadioButtons ({ sectionIndex, questionIndex }) {
    // prettier-ignore
    const question = this
      .props
      .treatmentNoteTemplate
      .content.sections[sectionIndex]
      .questions[questionIndex]
    return question.answers.map((answer, answerIndex) => (
      <label key={`answer${questionIndex}${answerIndex}`}>
        <input
          type='radio'
          name={question.name}
          onChange={() =>
            this.onSelectRadio({ sectionIndex, questionIndex, answerIndex })}
        />
        {answer.value}
        <br />
      </label>
    ))
  }

  render () {
    return (
      <form onSubmit={this.onSubmit}>
        <h1>{this.props.treatmentNoteTemplate.name}</h1>
        {this.props.treatmentNoteTemplate.content.sections.map(
          (section, sectionIndex) => (
            <div key={`section${sectionIndex}`}>
              <h2>{section.name}</h2>
              {section.questions.map((question, questionIndex) => (
                <div key={`question${questionIndex}`}>
                  <h3>{question.name}</h3>
                  {{
                    text: () =>
                      this.renderText({ sectionIndex, questionIndex }),
                    paragraph: () =>
                      this.renderParagraph({ sectionIndex, questionIndex }),
                    checkboxes: () =>
                      this.renderCheckboxes({ sectionIndex, questionIndex }),
                    radiobuttons: () =>
                      this.renderRadioButtons({ sectionIndex, questionIndex })
                  }[question.type]()}
                </div>
              ))}
            </div>
          )
        )}
        <button type='submit'>Submit</button>
      </form>
    )
  }
}
