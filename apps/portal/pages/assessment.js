/**
 * The assessment page converts a Cliniko treatment note template into a form UI.
 * The submission of this form will submit a treatment note to Cliniko and
 * show a reminder to the client of their upcomming appointment.
 */
import React from 'react'
import _ from 'lodash'
import { GraphQLClient } from 'graphql-request'
import { type, margins, colors } from 'styles'
import Button from 'components/button'
import Router from 'next/router'

const gql = new GraphQLClient(process.env.APP_URL + '/api', { headers: {} })

export default class Assessment extends React.Component {
  static async getInitialProps ({ query: { email, type } }) {
    const apptType = type
      .toUpperCase()
      .split(' ')
      .join('_')
    const { treatmentNoteTemplate, confirmationContent } = await gql.request(
      `query {
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
        confirmationContent: contentModule(name: "assessmentConfirmation") {
          h1
          p
          a
          images(width: 500 height: 500) {
            url
          }
        }
      }`
    )
    return { treatmentNoteTemplate, confirmationContent, email }
  }

  constructor (props) {
    super(props)
    this.state = { formData: props.treatmentNoteTemplate, confirmed: false }
  }

  onSubmit = async event => {
    event.preventDefault()
    await gql.request(
      `mutation CreateTreatmentNote($content: TreatmentNoteInputContent!) {
        createTreatmentNote(
          email: "${this.props.email}"
          content: $content
          appointmentType: IMPRINT_INTERVIEW
        ) {
          name
        }
      }`,
      { content: this.state.formData.content }
    )
    this.setState({ confirmed: true })
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
      formData: _.set(_.cloneDeep(this.state.formData), answersPath, newAnswers)
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
            })
          }
        >
          {}
        </input>
        <style jsx>{`
          label {
            ${type.apercuS} width: 100%;
          }
          input {
            ${type.apercuS} border: 0;
            background-color: ${colors.coffee};
            width: 100%;
            padding: ${margins.xs}px;
          }
        `}</style>
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
            })
          }
        >
          {}
        </textarea>
        <style jsx>{`
          label {
            ${type.apercuS} width: 100%;
          }
          textarea {
            ${type.apercuS} border: 0;
            background-color: ${colors.coffee};
            width: 100%;
            padding: ${margins.xs}px;
          }
        `}</style>
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
            this.onSelectCheckbox({ sectionIndex, questionIndex, answerIndex })
          }
        />
        {_answer.value}
        <style jsx>{`
          label {
            ${type.apercuS} display: block;
          }
          input {
            margin-right: ${margins.xs}px;
          }
        `}</style>
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
            this.onSelectRadio({ sectionIndex, questionIndex, answerIndex })
          }
        />
        {answer.value}
        <style jsx>{`
          label {
            ${type.apercuS} display: block;
          }
          input {
            margin-right: ${margins.xs}px;
            background-color: ${colors.coffee};
          }
        `}</style>
      </label>
    ))
  }

  renderForm () {
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
        <br />
        <Button
          fullWidth
          variant='contained'
          color='primary'
          onClick={this.nextStep}
          type='submit'
          className='btn'
        >
          Submit
        </Button>
        <style jsx>
          {`
            h1 {
              ${type.estebanL} margin-bottom: ${margins.m}px;
            }
            h2 {
              ${type.estebanM} margin: ${margins.m}px 0 ${margins.xs}px;
            }
            h3 {
              ${type.apercuS} margin: ${margins.xs}px 0;
            }
          `}
        </style>
      </form>
    )
  }

  renderConfirmation () {
    return (
      <div>
        <img src={this.props.confirmationContent.images[0].url} />
        <h1>{this.props.confirmationContent.h1}</h1>
        <p>{this.props.confirmationContent.p}</p>
        <Button
          fullWidth
          variant='contained'
          color='primary'
          onClick={() => Router.push('/')}
        >
          {this.props.confirmationContent.a}
        </Button>
        <style jsx>
          {`
            h1 {
              ${type.estebanL} margin: ${margins.m}px 0;
            }
            p {
              ${type.apercuM} margin: ${margins.m}px 0;
            }
          `}
        </style>
      </div>
    )
  }

  render () {
    return this.state.confirmed ? this.renderConfirmation() : this.renderForm()
  }
}
