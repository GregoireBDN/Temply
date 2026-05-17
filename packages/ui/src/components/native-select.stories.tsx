import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { NativeSelect, NativeSelectOption } from './native-select'

const meta = {
  title: 'Forms/NativeSelect',
  component: NativeSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Styled native `<select>` — the OS-rendered dropdown is preserved for great mobile UX. Add a chevron icon via the wrapper. Use `NativeSelectOption` / `NativeSelectOptGroup` for items.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'default'],
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    onChange: { table: { category: 'Events' } },
  },
  args: { size: 'default', onChange: fn() },
} satisfies Meta<typeof NativeSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <NativeSelect {...args}>
      <NativeSelectOption value="">Select an option</NativeSelectOption>
      <NativeSelectOption value="1">Option 1</NativeSelectOption>
      <NativeSelectOption value="2">Option 2</NativeSelectOption>
      <NativeSelectOption value="3">Option 3</NativeSelectOption>
    </NativeSelect>
  ),
}

export const Small: Story = {
  args: { size: 'sm' },
  render: (args) => (
    <NativeSelect {...args}>
      <NativeSelectOption value="">Small select</NativeSelectOption>
      <NativeSelectOption value="a">Option A</NativeSelectOption>
      <NativeSelectOption value="b">Option B</NativeSelectOption>
    </NativeSelect>
  ),
}

export const SelectionFiresOnChange: Story = {
  render: (args) => (
    <NativeSelect {...args} aria-label="favourite">
      <NativeSelectOption value="">Pick one</NativeSelectOption>
      <NativeSelectOption value="cat">Cat</NativeSelectOption>
      <NativeSelectOption value="dog">Dog</NativeSelectOption>
    </NativeSelect>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const select = canvas.getByLabelText(/favourite/i)
    await userEvent.selectOptions(select, 'dog')
    await expect(select).toHaveValue('dog')
    await expect(args.onChange).toHaveBeenCalled()
  },
}
