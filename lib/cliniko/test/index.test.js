import * as cliniko from '../'
import superagent from 'superagent'
import _ from 'lodash'

jest.mock('superagent', () => ({
  get: jest.fn().mockReturnThis(),
  post: jest.fn().mockReturnThis(),
  auth: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  query: jest.fn().mockReturnThis(),
  del: jest.fn().mockReturnThis()
}))

test('create sends a POST to Cliniko', async () => {
  await cliniko.create({
    resource: 'patients',
    data: { name: 'Karen' }
  })
  expect(_.last(superagent.post.mock.calls)[0]).toContain('/patients')
  expect(_.last(superagent.send.mock.calls)[0]).toEqual({ name: 'Karen' })
})

test('find sends a GET to a Cliniko resource', async () => {
  await cliniko.find({
    resource: 'patients',
    q: 'foo:=bar'
  })
  expect(_.last(superagent.get.mock.calls)[0]).toContain('/patients')
  expect(_.last(superagent.query.mock.calls)[0].q).toEqual('foo:=bar')
})

test('find pulls the resource out of its namespace', async () => {
  superagent.query.mockResolvedValue({
    body: { patients: [{ name: 'Karen' }] }
  })
  const patients = await cliniko.find({
    resource: 'patients',
    q: 'foo:=bar'
  })
  expect(patients[0].name).toEqual('Karen')
})

test('find sends a GET to a Cliniko url', async () => {
  await cliniko.find({
    url: 'http://foo.bar/a/b/c',
    q: 'foo:=bar'
  })
  expect(_.last(superagent.get.mock.calls)[0]).toContain('http://foo.bar/a/b/c')
  expect(_.last(superagent.query.mock.calls)[0].q).toEqual('foo:=bar')
})

test('findOrCreate doesnt create a record if found', async () => {
  superagent.post = jest.fn().mockReturnThis()
  superagent.query.mockResolvedValue({
    body: { patients: [{ name: 'Karen' }] }
  })
  await cliniko.findOrCreate({
    resource: 'patients',
    q: 'foo:=bar',
    data: {}
  })
  expect(superagent.post).not.toBeCalled()
})

test('findOrCreate creates a record if not found', async () => {
  superagent.query.mockResolvedValue({
    body: { patients: [] }
  })
  await cliniko.findOrCreate({
    resource: 'patients',
    q: 'foo:=bar',
    data: { name: 'Karen Horney' }
  })
  expect(_.last(superagent.send.mock.calls)[0].name).toEqual('Karen Horney')
})

test('destroy deletes a record', async () => {
  await cliniko.destroy({
    resource: 'patients',
    id: 'foo'
  })
  expect(_.last(superagent.del.mock.calls)[0]).toContain('patients/foo')
})
