import _ from 'lodash'
import jsforce from 'jsforce'
import cheerio from 'cheerio'

const salesforce = new jsforce.Connection({
  proxyUrl: 'http://localhost:3000/sfproxy/'
})

// WARNING: This would be very insecure code for production, as it'll expose
// a login/password in plain sight. We'd wrap this code in our own authenticated
// GraphQL layer anyways, but worth noting. Also "SOQL injection"!? 😵
const login = () =>
  salesforce.login(
    process.env.SALESFORCE_LOGIN_URL,
    process.env.SALESFORCE_PASSWORD
  )

export const findAll = async () => {
  await login()
  const article = await salesforce.query(
    'SELECT Name, content__c FROM practice_article__c'
  )
  const practice = await salesforce.query(
    'SELECT Name, thumbnail__c, object_name__c FROM practices__c'
  )
  return article.records
    .map(rec => {
      const $ = cheerio.load(rec.content__c)
      return {
        title: rec.Name,
        img: $('img').attr('src'),
        href: '/article?name=' + rec.Name
      }
    })
    .concat(
      practice.records.map(rec => {
        return {
          title: rec.Name,
          img: rec.thumbnail__c,
          href: '/exercise?objName=' + rec.object_name__c
        }
      })
    )
}

export const findArticle = async name => {
  await login()
  const res = await salesforce.query(
    `SELECT Name, content__c FROM practice_article__c WHERE Name = '${name}'`
  )
  const article = res.records[0]
  return {
    title: article.Name,
    html: article.content__c
  }
}

export const findExercise = async objName => {
  await login()
  const res = await salesforce.metadata.read('CustomObject', [objName])
  const blocks = res.fields.filter(f => f.fullName.match(/^block_/)).map(f => ({
    label: f.label,
    type: f.type,
    key: f.fullName
  }))
  const res2 = await salesforce.query(
    `SELECT Name FROM practices__c WHERE object_name__c = '${objName}'`
  )
  const title = res2.records[0].Name
  return {
    title,
    objName,
    blocks
  }
}

export const submitExercise = async (objName, data) => {
  await login()
  console.log('sending..')
  const res = await salesforce.sobject(objName).create(data)
  console.log(res)
  return res
}
