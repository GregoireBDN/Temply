import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react'

import { Toggle } from './toggle'

const meta = {
  title: 'Forms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Two-state pressable button built on Radix `Toggle`. Use it for in-app formatting controls (bold / italic / underline…). Manages `aria-pressed` automatically.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'outline'],
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    pressed: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    onPressedChange: { table: { category: 'Events' } },
  },
  args: { variant: 'default', size: 'default', onPressedChange: fn() },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Toggle aria-label="Bold" {...args}>
      <BoldIcon />
    </Toggle>
  ),
}

export const Variants: Story = {
  parameters: { docs: { description: { story: 'Variant + size combinations.' } } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle aria-label="Bold">
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Italic" variant="outline">
        <ItalicIcon />
      </Toggle>
      <Toggle aria-label="Underline" size="sm">
        <UnderlineIcon />
      </Toggle>
      <Toggle aria-label="Bold large" size="lg" variant="outline">
        <BoldIcon />
        Bold
      </Toggle>
    </div>
  ),
}

export const ToggleInteraction: Story = {
  render: (args) => (
    <Toggle aria-label="Press me" {...args}>
      <BoldIcon />
    </Toggle>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const btn = canvas.getByRole('button', { name: /press me/i })
    await userEvent.click(btn)
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(true)
    await expect(btn).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(btn)
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(false)
  },
}
