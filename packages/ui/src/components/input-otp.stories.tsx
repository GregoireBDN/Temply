import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from './input-otp'

const meta: Meta<typeof InputOTP> = {
  title: 'Forms/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'One-Time Password input built on the `input-otp` library. Compose with `InputOTPGroup` / `InputOTPSlot` / `InputOTPSeparator`. Paste, arrow keys, and `maxLength` cap are handled automatically.',
      },
    },
  },
  argTypes: {
    maxLength: { control: { type: 'number', min: 1, max: 10 }, table: { category: 'Behaviour' } },
    onChange: { table: { category: 'Events' } },
  },
  args: { maxLength: 6, onChange: fn() },
}

export default meta
type Story = StoryObj<typeof InputOTP>

export const Playground: Story = {
  render: (args) => (
    <InputOTP maxLength={args.maxLength ?? 6} onChange={args.onChange}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
}

export const TypingFiresOnChange: Story = {
  render: (args) => (
    <InputOTP maxLength={args.maxLength ?? 6} onChange={args.onChange} aria-label="otp">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByLabelText(/otp/i)
    await userEvent.type(input, '123456')
    await expect(args.onChange).toHaveBeenLastCalledWith('123456')
  },
}
