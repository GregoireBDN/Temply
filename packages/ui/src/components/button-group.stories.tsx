import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button'
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from './button-group'

const meta = {
  title: 'Forms/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Visually groups several `Button`s together. Use `orientation` for vertical stacks, `ButtonGroupSeparator` for inline dividers, and `ButtonGroupText` for static label segments.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { category: 'Layout', defaultValue: { summary: 'horizontal' } },
    },
  },
  args: { orientation: 'horizontal' as const },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ButtonGroup>
        <Button outline>Left</Button>
        <Button outline>Center</Button>
        <Button outline>Right</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="secondary" outline>Copy</Button>
        <ButtonGroupSeparator />
        <Button variant="secondary" outline>Paste</Button>
        <ButtonGroupSeparator />
        <Button variant="secondary" outline>Cut</Button>
      </ButtonGroup>

      <ButtonGroup>
        <ButtonGroupText>Label</ButtonGroupText>
        <Button outline>Action</Button>
      </ButtonGroup>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button outline>Top</Button>
      <Button outline>Middle</Button>
      <Button outline>Bottom</Button>
    </ButtonGroup>
  ),
}
