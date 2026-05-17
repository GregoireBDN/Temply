import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { PasswordInput } from './password-input'

const meta = {
  title: 'Forms/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Password field with a built-in show/hide toggle. The eye button switches the underlying `type` between `password` and `text` while preserving focus.',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text', table: { category: 'Content' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    'aria-invalid': { control: 'boolean', table: { category: 'State' } },
    onChange: { table: { category: 'Events' } },
  },
  args: { placeholder: 'Enter password…', onChange: fn() },
  render: (args) => (
    <div className="w-72">
      <PasswordInput {...args} />
    </div>
  ),
} satisfies Meta<typeof PasswordInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'short' },
}

export const ToggleVisibility: Story = {
  args: { defaultValue: 'super-secret' },
  play: async ({ canvas, userEvent, step }) => {
    const input = canvas.getByDisplayValue('super-secret') as HTMLInputElement
    await step('Starts as password type', async () => {
      await expect(input.type).toBe('password')
    })
    await step('Click eye → switches to text', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /afficher le mot de passe/i }))
      await expect(input.type).toBe('text')
    })
    await step('Click again → back to password', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /masquer le mot de passe/i }))
      await expect(input.type).toBe('password')
    })
  },
}
