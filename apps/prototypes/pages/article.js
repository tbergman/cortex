import React from 'react'
import * as practices from '../lib/practices'
import qs from 'querystring'

export default class Article extends React.Component {
  static async getInitialProps ({ req }) {
    const name = req ? req.query.name : qs.parse(window.location.search).name
    const article = await practices.findArticle(name)
    return { article }
  }

  render () {
    return (
      <div>
        <a href='/practices'>back</a>
        <h1>{this.props.article.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: this.props.article.html }} />
      </div>
    )
  }
}
