import ImprintSchedule from '../../pages/imprint-schedule'
import { shallow } from 'enzyme'

test('renders Clinko', () => {
  const wrapper = shallow(
    <ImprintSchedule
      step0={{ h1: 'hi ', a: 'foo', images: [{ url: 'foo' }] }}
      step2={{ h1: 'hi ', images: [{ url: 'foo' }] }}
    />
  )
  wrapper.setState({ step: 2 })
  expect(wrapper.html()).toContain('cliniko.com')
})
