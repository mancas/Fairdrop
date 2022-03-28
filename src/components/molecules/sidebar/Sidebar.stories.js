import React from 'react'
import { Sidebar } from './Sidebar'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Sidebar',
  component: Sidebar,
  args: {
    count: 0,
    href: '/fake-path',
  },
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Sidebar {...args} />

export const Sample = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Sample.args = {
  headline: 'Headline',
}
