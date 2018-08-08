import ImprintSchedule from '../../pages/consult-schedule'
import { shallow } from 'enzyme'

test('renders Clinko', () => {
  const wrapper = shallow(
    <ImprintSchedule
      welcome={{ h1: 'hi ', a: 'foo', images: [{ url: 'foo' }] }}
      calendar={{ h1: 'hi ', images: [{ url: 'foo' }] }}
    />
  )
  wrapper.setState({ step: 1 })
  expect(wrapper.html()).toContain('cliniko.com')
})
