import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Input } from './input'

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Styled native `<input>` — supports every native type (text, email, password, number…). Includes focus, invalid (`aria-invalid`) and disabled states out of the box.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
      description: 'HTML input type.',
      table: { category: 'Behaviour', defaultValue: { summary: 'text' } },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when empty.',
      table: { category: 'Content' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable interaction.',
      table: { category: 'State' },
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Triggers the invalid visual style + ring.',
      table: { category: 'State' },
    },
    onChange: { table: { category: 'Events' } },
  },
  args: {
    placeholder: 'Type here…',
    type: 'text',
    onChange: fn(),
  },
  render: (args) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Types: Story = {
  parameters: { docs: { description: { story: 'Native types — text, email, password.' } } },
  render: () => (
    <div className="w-72 space-y-3">
      <Input placeholder="Default input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
    </div>
  ),
}

export const States: Story = {
  parameters: { docs: { description: { story: 'Disabled and invalid (`aria-invalid`) visual states.' } } },
  render: () => (
    <div className="w-72 space-y-3">
      <Input placeholder="Disabled input" disabled />
      <Input placeholder="Invalid input" aria-invalid="true" />
    </div>
  ),
}

export const TypingFiresOnChange: Story = {
  args: { placeholder: 'Type "hello"' },
  play: async ({ args, canvas, userEvent, step }) => {
    const input = canvas.getByPlaceholderText(/type "hello"/i)
    await step('Type into the input', async () => {
      await userEvent.type(input, 'hello')
    })
    await step('onChange fires once per keystroke', async () => {
      await expect(args.onChange).toHaveBeenCalledTimes(5)
      await expect(input).toHaveValue('hello')
    })
  },
}
