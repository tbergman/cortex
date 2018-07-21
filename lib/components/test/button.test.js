import Button from '../button'
import { shallow } from 'enzyme'

test('renders children', () => {
  const wrapper = shallow(<Button>Hello World</Button>)
  expect(wrapper.text()).toContain('Hello World')
})
