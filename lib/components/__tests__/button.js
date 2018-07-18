import Button from '../button'
import { shallow } from 'enzyme'

test('adds 1 + 2 to equal 3', () => {
  const wrapper = shallow(<Button>Hello World</Button>)
  expect(wrapper.text()).toContain('Hello World')
})
