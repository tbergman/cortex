import Document, { Head, Main, NextScript } from 'next/document'

export default class Doc extends Document {
  render () {
    return (
      <html>
        <Head>
          <title>Octave | Wellness and Therapy</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='stylesheet' href='/static/base.css' />
          <link rel='stylesheet' href='/static/style.css' />
          <link
            href='https://fonts.googleapis.com/css?family=Esteban|Roboto|Work+Sans'
            rel='stylesheet'
          />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500'
          />

          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='https://goligorsky.neocities.org/Octave_LP_07082018/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='96x96'
            href='https://goligorsky.neocities.org/Octave_LP_07082018/favicon-96x96.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='https://goligorsky.neocities.org/Octave_LP_07082018/favicon-16x16.png'
          />
        </Head>
        <body>
          <Main />
          <script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js' />
          <script src='https://static.airtable.com/js/embed/embed_snippet_v1.js' />
          <script src='/static/scrolling.js' />
          <NextScript />
        </body>
      </html>
    )
  }
}
