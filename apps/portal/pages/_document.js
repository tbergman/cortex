import Document, { Head, Main, NextScript } from 'next/document'
import React from 'react'
import * as nextMui from 'next-mui'
import { colors, reset, margins, navHeight, type } from 'styles'
import Nav from 'components/nav'

export default class Doc extends Document {
  static async getInitialProps (ctx) {
    const muiProps = nextMui.initialProps(ctx)
    const docProps = await Document.getInitialProps(ctx)
    return { ...docProps, ...muiProps }
  }

  componentDidMount () {
    nextMui.onComponentDidMount()
  }

  render () {
    return (
      <html>
        <Head>
          <title>Octave | Wellness and Therapy</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <style>{reset}</style>
          <style>
            {`
              body {
                background: ${colors.dustyRose};
              }
              #container {
                max-width: 375px;
                margin: auto;
                padding: ${navHeight + margins.m}px 0 100px 0;
              }
              iframe {
                height: calc(100vh - 200px);
                width: 100%;
              }
              h1 {
                ${type.estebanL}
                margin-bottom: ${margins.m}px;
              }
              p {
                ${type.apercuM}
                margin: ${margins.m}px 0;
              }
              img {
                margin-bottom: ${margins.m}px;
              }
            `}
          </style>
        </Head>
        <body>
          <div id='container'>
            <Nav />
            <Main />
            <NextScript />
          </div>
        </body>
      </html>
    )
  }
}
