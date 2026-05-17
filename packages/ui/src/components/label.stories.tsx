import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from './input'
import { Label } from './label'

const meta = {
  title: 'Forms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Form label built on Radix `Label`. Automatically associates with a form control via `htmlFor` and reflects the control disabled state via `peer-disabled` styles.',
      },
    },
  },
  argTypes: {
    htmlFor: {
      control: 'text',
      description: 'Id of the form control this label is associated with.',
      table: { category: 'Accessibility' },
    },
    children: {
      control: 'text',
      description: 'Label text.',
      table: { category: 'Content' },
    },
  },
  args: { children: 'Label text' },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const PairedWithInput: Story = {
  parameters: { docs: { description: { story: 'Clicking the label focuses the input thanks to `htmlFor`.' } } },
  render: () => (
    <div className="w-72 space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
}
