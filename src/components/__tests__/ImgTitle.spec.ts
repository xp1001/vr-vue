import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ImgTitle from '../ImgTitle.vue'

describe('ImgTitle', () => {
  it('renders properly', () => {
    const wrapper = mount(ImgTitle, { props: { title: 'Hello Vitest', imgPath: '' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
