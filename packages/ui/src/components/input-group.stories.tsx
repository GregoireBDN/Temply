import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { MailIcon, SearchIcon } from 'lucide-react'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from './input-group'

const meta = {
  title: 'Forms/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Input bundled with leading or trailing decorations (icons, prefixes, suffixes). Use `InputGroupAddon` with `align="inline-start" | "inline-end"` to position the slot.',
      },
    },
  },
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const WithSearchIcon: Story = {
  render: () => (
    <InputGroup className="w-72">
      <InputGroupAddon align="inline-start">
        <InputGroupText>
          <SearchIcon />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="Search…" />
    </InputGroup>
  ),
}

export const WithEndIcon: Story = {
  render: () => (
    <InputGroup className="w-72">
      <InputGroupInput placeholder="Email" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>
          <MailIcon />
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithPrefix: Story = {
  render: () => (
    <InputGroup className="w-72">
      <InputGroupAddon align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  ),
}

export const TypingFiresOnChange: Story = {
  render: () => {
    const onChange = fn()
    return (
      <InputGroup className="w-72">
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <SearchIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Search…" onChange={onChange} />
      </InputGroup>
    )
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByPlaceholderText(/search…/i)
    await userEvent.type(input, 'abc')
    await expect(input).toHaveValue('abc')
  },
}
