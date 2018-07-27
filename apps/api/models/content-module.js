/**
 * Content modules are app copy and images managed in Airtable. There are two
 * columns in Airtable `copy` and `images`. `copy` is a markdown longtext that
 * gets parsed into more structured JSON data for GraphQL. This will parse
 * the first level of markdown tags into arrays of strings with keys by tag name.
 *
 * For instance, the following markdown in Airtable...
 *
 *   ```
 *   # Welcome to Octave
 *   Let's get started
 *   # Step 1
 *   [Breath in]()
 *   ```
 *
 * Can be queried from GraphQL via...
 *
 *   ```
 *   query {
 *     contentModule(name: "welcome_page") {
 *       h1
 *       p
 *       a
 *       images
 *     }
 *   }
 *   ```

 * and will return...
 *
 *   ```
 *   {
 *     h1: ["Welcome to Octave", "Step 1"],
 *     p: ["Let's get started"],
 *     a: ["Breath in"],
 *     images: ["placekitten.com/100/200"]
 *   }
 *   ```
 *
 */
import * as at from 'at'
import cheerio from 'cheerio'
import marked from 'marked'
import qs from 'querystring'

const { APP_URL } = process.env

const tags = [
  'a',
  'blockquote',
  'code',
  'del',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ol',
  'p',
  'strong',
  'ul'
]

export const airtableToModel = record => {
  const $ = cheerio.load(marked.parse(record.copy))
  const rootEls = $('body > *:not(p)')
    .map((i, el) => {
      return { tag: $(el).get(0).tagName, text: $(el).text() }
    })
    .get()
  const pWrappedEls = $('body > p > *')
    .map((i, el) => {
      return { tag: $(el).get(0).tagName, text: $(el).text() }
    })
    .get()
  const pEls = $('body > p')
    .map((i, el) => {
      const text = $(el)
        .clone()
        .children()
        .remove()
        .end()
        .text()
      return { tag: $(el).get(0).tagName, text }
    })
    .get()
  const els = [...rootEls, ...pWrappedEls, ...pEls]
  const copy = els.reduce((acc, { tag, text }) => {
    return { ...acc, [tag]: [...(acc[tag] || []), text] }
  }, {})
  const images = args => {
    return record.images.map(image => ({
      url:
        `${APP_URL}/api/image?` +
        qs.stringify({
          url: image.url,
          width: args.width,
          height: args.height
        })
    }))
  }
  return { name: record.name, ...copy, images }
}

export const contentModules = async (_root, args) => {
  const records = await at.findAll({
    table: 'contentModules',
    filter: `name = '${args.name}'`
  })
  return records.map(airtableToModel, args)
}

export const contentModule = async (_root, args) =>
  (await contentModules(_root, args))[0]

export const schema = {
  types: `
    type Image {
      url: String
    }
    type ContentModule {
      name: String
      ${tags.map(name => `${name}: [String]`)}
      images(
        width: Int
        height: Int
      ): [Image]
    }
  `,
  mutations: ``,
  queries: `
    contentModule(
      name: String
    ): ContentModule
    contentModules(
      name: String
    ): [ContentModule]
`
}

export const mutations = {}

export const queries = {
  contentModule,
  contentModules
}
