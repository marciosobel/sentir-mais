import { describe, it, expect, vitest } from 'vitest'
import { mount } from '@vue/test-utils'

import MainSidebar from './MainSidebar.vue'

describe('MainSidebar', () => {
  it('should render all buttons properly', () => {
    const mockRoute = {
      path: '/',
    }
    const mockRouter = {
      push: vitest.fn(),
    }

    const wrapper = mount(MainSidebar, {
      global: {
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
        },
      },
    })

    const sidebarButtons = wrapper.findAll('li')
    expect(sidebarButtons.length).toBe(3)
    expect(true).toBe(true)
  })
})
