import React from 'react'
import * as practices from '../../lib/practices'

// This would be parsed from the JWT
const CRAIGS_EMAIL = 'craigspaeth@gmail.com'

export default class Index extends React.Component {
  static async getInitialProps ({ req }) {
    const practiceCategories = await practices.findPracticeCategoriesForClient(
      CRAIGS_EMAIL
    )
    return { practiceCategories }
  }

  async componentDidMount () {
    if ('serviceWorker' in navigator) {
      console.log('registering')
      await navigator.serviceWorker.register('/service-worker.js')
      console.log('service worker registration successful')
    }
  }

  render () {
    return (
      <div>
        <h1>Practices</h1>
        {this.props.practiceCategories.map(category => (
          <div>
            <h2>{category.title}</h2>
            {category.practices.map(practice => (
              <a href={practice.href}>
                <img src={practice.thumbnail} />
                <h3>{practice.name}</h3>
              </a>
            ))}
          </div>
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
