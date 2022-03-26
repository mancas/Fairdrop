import React from 'react'

import Text from './Text'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Text',
  component: Text,
  decorators: [
    (Story) => (
      <div style={{ background: '#eee', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Text {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  // variant: 'green',
  children: 'Text',
}
