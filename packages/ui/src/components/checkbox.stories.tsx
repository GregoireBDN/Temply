import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Checkbox } from './checkbox'
import { Label } from './label'

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessible checkbox built on Radix `Checkbox`. Supports controlled (`checked`) and uncontrolled (`defaultChecked`) usage and the standard disabled / invalid states.',
      },
    },
  },
  argTypes: {
    defaultChecked: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    onCheckedChange: { table: { category: 'Events' } },
  },
  args: { onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="pg" {...args} />
      <Label htmlFor="pg">Accept terms</Label>
    </div>
  ),
}

export const WithLabel: Story = {
  parameters: { docs: { description: { story: 'Different combinations of checked / unchecked / disabled.' } } },
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="checked" defaultChecked />
        <Label htmlFor="checked">Already checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled">Disabled</Label>
      </div>
    </div>
  ),
}

export const ToggleInteraction: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="toggle" {...args} />
      <Label htmlFor="toggle">Toggle me</Label>
    </div>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    const cb = canvas.getByRole('checkbox', { name: /toggle me/i })
    await step('Click checks the box', async () => {
      await userEvent.click(cb)
      await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true)
    })
    await step('Click again unchecks it', async () => {
      await userEvent.click(cb)
      await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false)
    })
  },
}
