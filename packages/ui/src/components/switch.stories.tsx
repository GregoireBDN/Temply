import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Label } from './label'
import { Switch } from './switch'

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Toggle switch built on Radix `Switch`. Two sizes (`sm`, `default`) and the standard checked / disabled / invalid states.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'default'],
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    defaultChecked: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    onCheckedChange: { table: { category: 'Events' } },
  },
  args: { size: 'default', onCheckedChange: fn() },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="pg" {...args} />
      <Label htmlFor="pg">Enable feature</Label>
    </div>
  ),
}

export const Variants: Story = {
  parameters: { docs: { description: { story: 'Sizes and states.' } } },
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Switch id="sw1" />
        <Label htmlFor="sw1">Default switch</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sw2" size="sm" />
        <Label htmlFor="sw2">Small switch</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sw3" defaultChecked />
        <Label htmlFor="sw3">Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sw4" disabled />
        <Label htmlFor="sw4">Disabled</Label>
      </div>
    </div>
  ),
}

export const ToggleInteraction: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="toggle" {...args} />
      <Label htmlFor="toggle">Toggle me</Label>
    </div>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const sw = canvas.getByRole('switch', { name: /toggle me/i })
    await userEvent.click(sw)
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true)
    await userEvent.click(sw)
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false)
  },
}
