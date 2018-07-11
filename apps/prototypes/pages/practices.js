import React from 'react'
import * as practices from '../lib/practices'

export default class Index extends React.Component {
  static async getInitialProps ({ req }) {
    const pracs = await practices.findAll()
    console.log(pracs)
    return { pracs }
  }

  render () {
    return (
      <div>
        <h1>Practices</h1>
        {this.props.pracs.map(prac => (
          <li>
            <a href={prac.href}>
              <img src={prac.img} />
              <h3>{prac.title}</h3>
            </a>
          </li>
        ))}
        <style jsx>
          {`
          img {
            max-width: 200px;
          }
        `}
        </style>
      </div>
    )
  }
}
