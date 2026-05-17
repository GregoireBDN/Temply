import type { Meta, StoryObj } from '@storybook/react-vite'

import { Spinner } from './spinner'

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Animated loading indicator built on Lucide `Loader2Icon`. Comes with `role="status"` and `aria-label="Loading"` for accessibility — size and color are controlled via `className` (Tailwind).',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Tailwind utilities for sizing (`size-6`), color (`text-primary`), etc.',
      table: { category: 'Appearance' },
    },
  },
  args: { className: 'size-6 text-primary' },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  parameters: { docs: { description: { story: 'Same component, different size utilities.' } } },
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  ),
}
