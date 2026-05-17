import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Textarea } from './textarea'

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Auto-resizing multi-line text input. Uses `field-sizing: content` so the height follows the content. Supports the standard `disabled` / `aria-invalid` styling.',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text', table: { category: 'Content' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    rows: { control: { type: 'number', min: 1, max: 20 }, table: { category: 'Layout' } },
    onChange: { table: { category: 'Events' } },
  },
  args: { placeholder: 'Write your message here…', onChange: fn() },
  render: (args) => (
    <div className="w-80">
      <Textarea {...args} />
    </div>
  ),
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Disabled textarea' },
}

export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'oops' },
}

export const TypingFiresOnChange: Story = {
  args: { placeholder: 'Type a note' },
  play: async ({ args, canvas, userEvent }) => {
    const ta = canvas.getByPlaceholderText(/type a note/i)
    await userEvent.type(ta, 'hi')
    await expect(args.onChange).toHaveBeenCalled()
    await expect(ta).toHaveValue('hi')
  },
}
