import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, within } from 'storybook/test'

import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover'

const meta = {
  title: 'Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Non-modal floating panel built on Radix `Popover`. Use it for menus, settings, mini-forms, etc. Compose with `PopoverTrigger`, `PopoverContent`, `PopoverHeader`, `PopoverTitle`, `PopoverDescription`.',
      },
    },
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Dimensions: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button outline>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-2">
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="width">Width</Label>
            <Input id="width" defaultValue="100%" className="col-span-2" />
          </div>
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="height">Height</Label>
            <Input id="height" defaultValue="25px" className="col-span-2" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const OpenCloseInteraction: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button outline>Toggle popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Hello there</PopoverTitle>
          <PopoverDescription>I open on click and close on Escape.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvasElement, userEvent, step }) => {
    const canvas = within(canvasElement)
    await step('Click opens the popover', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /toggle popover/i }))
      await expect(await screen.findByText(/hello there/i)).toBeVisible()
    })
    await step('Escape closes it', async () => {
      await userEvent.keyboard('{Escape}')
      await expect(screen.queryByText(/hello there/i)).toBeNull()
    })
  },
}
