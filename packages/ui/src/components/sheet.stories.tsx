import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, within } from 'storybook/test'

import { Button } from './button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet'

const meta = {
  title: 'Overlays/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Side panel ("drawer") built on Radix `Dialog`. Slide-in from `top`, `right`, `bottom`, or `left` via `side` on `SheetContent`.',
      },
    },
  },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" outline>Right Sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>This is a sheet sliding from the right.</SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Sheet content goes here. You can put forms, navigation, or any content.
          </p>
        </div>
        <SheetFooter>
          <Button fullWidth>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" outline>Left Sheet</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Browse sections.</SheetDescription>
        </SheetHeader>
        <div className="space-y-2 p-4">
          <Button ghost fullWidth className="justify-start">Home</Button>
          <Button ghost fullWidth className="justify-start">Settings</Button>
          <Button ghost fullWidth className="justify-start">Profile</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
}

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" outline>Bottom Sheet</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Bottom Sheet</SheetTitle>
          <SheetDescription>Content slides up from the bottom.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}

export const OpenCloseInteraction: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Side panel</SheetTitle>
          <SheetDescription>Press Escape to close.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement, userEvent, step }) => {
    const canvas = within(canvasElement)
    await step('Open the sheet', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /open sheet/i }))
      await expect(await screen.findByText(/side panel/i)).toBeVisible()
    })
    await step('Escape closes the sheet', async () => {
      await userEvent.keyboard('{Escape}')
      await expect(screen.queryByText(/side panel/i)).toBeNull()
    })
  },
}
