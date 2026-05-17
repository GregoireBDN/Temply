import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, within } from 'storybook/test'

import { Button } from './button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Input } from './input'
import { Label } from './label'

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Modal dialog built on Radix `Dialog`. Compose with `DialogTrigger`, `DialogContent` (portaled), `DialogHeader`, `DialogTitle`, `DialogDescription`, and `DialogFooter`. Closes on Escape and overlay click.',
      },
    },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const EditProfile: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="dname">Name</Label>
            <Input id="dname" defaultValue="John Doe" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="demail">Email</Label>
            <Input id="demail" defaultValue="john@example.com" />
          </div>
        </div>
        <DialogFooter showCloseButton>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const DangerConfirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="danger" outline>Delete account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button variant="danger">Delete Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const OpenCloseInteraction: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Show dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Greetings</DialogTitle>
          <DialogDescription>Press Escape to close.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement, userEvent, step }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    await step('Click trigger', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /show dialog/i }))
    })
    await step('Dialog appears', async () => {
      const dialog = await screen.findByRole('dialog')
      await expect(dialog).toBeVisible()
      await expect(body.getByText(/greetings/i)).toBeVisible()
    })
    await step('Escape closes it', async () => {
      await userEvent.keyboard('{Escape}')
      await expect(screen.queryByRole('dialog')).toBeNull()
    })
  },
}
