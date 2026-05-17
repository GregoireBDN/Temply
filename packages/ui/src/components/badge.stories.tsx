import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from './badge'

const meta = {
  title: 'Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Compact pill used to label or categorise. Supports semantic intent variants and an outline visual style.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info'],
      description: 'Semantic intent driving the color.',
      table: { category: 'Appearance', defaultValue: { summary: 'primary' } },
    },
    outline: {
      control: 'boolean',
      description: 'Outline visual style (border + transparent background).',
      table: { category: 'Appearance' },
    },
    asChild: {
      control: 'boolean',
      description: 'Render as the immediate child (via Radix `Slot`).',
      table: { category: 'Advanced' },
    },
    children: {
      control: 'text',
      table: { category: 'Content' },
    },
  },
  args: { children: 'Badge', variant: 'primary' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Solid: Story = {
  parameters: { docs: { description: { story: 'All six semantic variants in the default solid style.' } } },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
}

export const Outline: Story = {
  parameters: { docs: { description: { story: 'Outline visual style — border with transparent background.' } } },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary" outline>Primary</Badge>
      <Badge variant="secondary" outline>Secondary</Badge>
      <Badge variant="success" outline>Success</Badge>
      <Badge variant="warning" outline>Warning</Badge>
      <Badge variant="danger" outline>Danger</Badge>
      <Badge variant="info" outline>Info</Badge>
    </div>
  ),
}
