import * as ContentModule from '../../models/content-module'

jest.mock('at', () => ({
  base: jest.fn().mockReturnValue({ create: () => {} })
}))

test('airtableToModel transforms markdown copy in airtable to json', () => {
  const conentModule = ContentModule.airtableToModel({ copy: '# Hello World' })
  expect(conentModule.h1).toEqual(['Hello World'])
})

test('airtableToModel transforms complex markdown copy', () => {
  const contentModule = ContentModule.airtableToModel({ copy: 'Foo\n[Bar]()' })
  expect(contentModule.p).toEqual(['Foo'])
  expect(contentModule.a).toEqual(['Bar'])
})

test('airtableToModel prepares image urls', () => {
  const contentModule = ContentModule.airtableToModel({
    copy: '',
    images: [{ url: 'foo.img/bar' }]
  })
  expect(contentModule.images({ width: 100, height: 100 })[0].url).toContain(
    '/api/image?url=foo.img%2Fbar&width=100&height=100'
  )
})
