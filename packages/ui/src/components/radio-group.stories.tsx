import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Label } from './label'
import { RadioGroup, RadioGroupItem } from './radio-group'

const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Mutually-exclusive choice list built on Radix `RadioGroup`. Compose with `RadioGroupItem` + `Label`.',
      },
    },
  },
  argTypes: {
    defaultValue: { control: 'text', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    onValueChange: { table: { category: 'Events' } },
  },
  args: { defaultValue: 'option-1', onValueChange: fn() },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      {['option-1', 'option-2', 'option-3'].map((v, i) => (
        <div key={v} className="flex items-center gap-2">
          <RadioGroupItem value={v} id={`r${i}`} />
          <Label htmlFor={`r${i}`}>Option {i + 1}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
}

export const SelectionInteraction: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      {['cat', 'dog', 'fish'].map((v) => (
        <div key={v} className="flex items-center gap-2">
          <RadioGroupItem value={v} id={`p-${v}`} />
          <Label htmlFor={`p-${v}`}>{v}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
  args: { defaultValue: 'cat' },
  play: async ({ args, canvas, userEvent }) => {
    const dog = canvas.getByRole('radio', { name: /dog/i })
    await userEvent.click(dog)
    await expect(args.onValueChange).toHaveBeenCalledWith('dog')
    await expect(dog).toBeChecked()
  },
}
