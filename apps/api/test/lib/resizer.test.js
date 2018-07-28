import resizer from '../../lib/resizer'

let sharpArgs

jest.mock('sharp', () => () => ({
  resize: (width, height) => (sharpArgs = { width, height })
}))

jest.mock('superagent', () => ({
  get () {
    return this
  },
  pipe (stream) {
    return this
  }
}))

test('resizer uses sharp on images', () => {
  const req = { url: 'foo', query: { width: 100, height: 200 } }
  const res = {}
  resizer(req, res)
  expect(sharpArgs.width).toEqual(100)
  expect(sharpArgs.height).toEqual(200)
})
