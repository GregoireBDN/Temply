import type { Meta, StoryObj } from '@storybook/react-vite'

import { Skeleton } from './skeleton'

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pulse-animated placeholder used while content loads. Shape and size are controlled via Tailwind utilities on `className`.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Tailwind utilities controlling shape and size (`h-4 w-48`, `rounded-full size-10`…).',
      table: { category: 'Appearance' },
    },
  },
  args: { className: 'h-4 w-48' },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ProfilePlaceholder: Story = {
  parameters: { docs: { description: { story: 'Avatar + name + body placeholder pattern.' } } },
  render: () => (
    <div className="w-80 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
    </div>
  ),
}
