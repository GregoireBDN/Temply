import type { Meta, StoryObj } from '@storybook/react-vite'

import { Kbd, KbdGroup } from './kbd'

const meta = {
  title: 'Display/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Inline keyboard shortcut hint. Use `Kbd` for a single key and `KbdGroup` to chain keys like `Cmd + K`.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Key label.',
      table: { category: 'Content' },
    },
  },
  args: { children: 'K' },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Combos: Story = {
  parameters: { docs: { description: { story: 'Use `KbdGroup` to compose multi-key shortcuts.' } } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Kbd>K</Kbd>
      <KbdGroup>
        <Kbd>Cmd</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
    </div>
  ),
}
