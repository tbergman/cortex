import * as at from '../'

jest.mock('airtable', () => {
  const base = jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eachPage: (pageCallback, done) => {
        pageCallback([{ fields: { foo: 'bar' } }], jest.fn())
        pageCallback([{ fields: { foo: 'baz' } }], jest.fn())
        done()
      }
    })
  })
  return () => ({ base: () => base })
})

test('find fetches each page and returns all records fields', async () => {
  const records = await at.find({ table: 'test', filter: 'foo = "bar"' })
  expect(records).toEqual([{ foo: 'bar' }, { foo: 'baz' }])
})
