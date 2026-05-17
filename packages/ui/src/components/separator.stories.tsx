import type { Meta, StoryObj } from '@storybook/react-vite'

import { Separator } from './separator'

const meta = {
  title: 'Layout/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Thin divider built on Radix `Separator`. Use `orientation="vertical"` inside a flex row. `decorative` controls whether the element is exposed to assistive tech.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Layout direction.',
      table: { category: 'Layout', defaultValue: { summary: 'horizontal' } },
    },
    decorative: {
      control: 'boolean',
      description: 'When true, the separator is hidden from screen readers.',
      table: { category: 'Accessibility', defaultValue: { summary: 'true' } },
    },
  },
  args: { orientation: 'horizontal', decorative: true },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <div className="w-80">
      <p className="text-sm text-muted-foreground">Above</p>
      <Separator {...args} className="my-2" />
      <p className="text-sm text-muted-foreground">Below</p>
    </div>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <div className="w-80">
      <p className="text-sm text-muted-foreground">Above</p>
      <Separator className="my-2" />
      <p className="text-sm text-muted-foreground">Below</p>
    </div>
  ),
}

export const Vertical: Story = {
  parameters: { docs: { description: { story: 'Vertical separator inside a flex row.' } } },
  render: () => (
    <div className="flex h-8 items-center gap-4">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Middle</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  ),
}
