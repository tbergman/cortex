import * as at from '../'

jest.mock('airtable', () => {
  const base = jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eachPage: (pageCallback, done) => {
        pageCallback([{ fields: { foo: 'bar' } }], jest.fn())
        pageCallback([{ fields: { foo: 'baz' } }], jest.fn())
        done()
      }
    }),
    create: jest.fn().mockResolvedValue({
      id: 1,
      fields: {
        name: 'Karen'
      }
    })
  })
  return () => ({ base: () => base })
})

test('find fetches each page and returns all records fields', async () => {
  const records = await at.find({ table: 'test', filter: 'foo = "bar"' })
  expect(records).toEqual([{ foo: 'bar' }, { foo: 'baz' }])
})

test.skip('findOrCreate doesnt create a record if it exists by filter', async () => {
  await at.findOrCreate({ table: 'lead', filter: 'Name = "Karen"' })
})
