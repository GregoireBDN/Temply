import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Label } from './label'
import { Slider } from './slider'

const meta = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Range input slider built on Radix `Slider`. Supports a single value or a range (two thumbs) — just pass an array. Horizontal or vertical via `orientation`.',
      },
    },
  },
  argTypes: {
    min: { control: { type: 'number' }, table: { category: 'Range', defaultValue: { summary: '0' } } },
    max: { control: { type: 'number' }, table: { category: 'Range', defaultValue: { summary: '100' } } },
    step: { control: { type: 'number', min: 0.1 }, table: { category: 'Range', defaultValue: { summary: '1' } } },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { category: 'Layout', defaultValue: { summary: 'horizontal' } },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    onValueChange: { table: { category: 'Events' } },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [40],
    orientation: 'horizontal',
    onValueChange: fn(),
  },
  render: (args) => (
    <div className="w-80">
      <Slider {...args} />
    </div>
  ),
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const SingleValue: Story = {
  render: () => {
    const [value, setValue] = React.useState([40])
    return (
      <div className="w-80 space-y-2">
        <Label>Value: {value[0]}</Label>
        <Slider value={value} onValueChange={setValue} max={100} step={1} />
      </div>
    )
  },
}

export const RangeValue: Story = {
  parameters: { docs: { description: { story: 'Pass an array with two values for a two-thumb range slider.' } } },
  render: () => {
    const [range, setRange] = React.useState([20, 80])
    return (
      <div className="w-80 space-y-2">
        <Label>
          Range: {range[0]} - {range[1]}
        </Label>
        <Slider value={range} onValueChange={setRange} max={100} step={1} />
      </div>
    )
  },
}

export const KeyboardChangesValue: Story = {
  args: { defaultValue: [50] },
  play: async ({ args, canvas, userEvent }) => {
    const thumb = canvas.getByRole('slider')
    thumb.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}')
    await expect(args.onValueChange).toHaveBeenCalled()
    await expect(args.onValueChange).toHaveBeenLastCalledWith([53])
  },
}
