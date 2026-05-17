import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from 'lucide-react'

import { ToggleGroup, ToggleGroupItem } from './toggle-group'

const meta = {
  title: 'Forms/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Group of related toggles built on Radix `ToggleGroup`. `type="single"` for radio-like exclusive selection (segmented control), `type="multiple"` to allow several items. `spacing` adds gap between items.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
      table: { category: 'Behaviour' },
    },
    variant: {
      control: 'inline-radio',
      options: ['default', 'outline'],
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    spacing: { control: { type: 'number', min: 0 }, table: { category: 'Layout' } },
    onValueChange: { table: { category: 'Events' } },
  },
  args: { variant: 'outline', onValueChange: fn() },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const SingleSelection: Story = {
  args: { type: 'single' },
  render: (args) => (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">Single selection (segmented)</p>
      <ToggleGroup {...args}>
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
}

export const MultipleWithSpacing: Story = {
  args: { type: 'multiple', spacing: 2 },
  render: (args) => (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">Multiple selection with spacing</p>
      <ToggleGroup {...args}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
}

export const SingleSelectionInteraction: Story = {
  args: { type: 'single' as const },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeftIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenterIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRightIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('radio', { name: /align center/i }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith('center')
  },
}
