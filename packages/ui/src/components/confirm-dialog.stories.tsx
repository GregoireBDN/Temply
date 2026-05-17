import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, within } from 'storybook/test'

import { Button } from './button'
import { ConfirmDialog } from './confirm-dialog'

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Overlays/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pre-built confirmation modal. Pass `open` / `onOpenChange` / `onConfirm`, customise the labels and the confirm button `variant` (`primary`, `danger`, `warning`, `success`).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'danger', 'warning', 'success'],
      table: { category: 'Appearance', defaultValue: { summary: 'primary' } },
    },
    title: { control: 'text', table: { category: 'Content' } },
    description: { control: 'text', table: { category: 'Content' } },
    confirmLabel: { control: 'text', table: { category: 'Content' } },
    cancelLabel: { control: 'text', table: { category: 'Content' } },
    loading: { control: 'boolean', table: { category: 'State' } },
    onConfirm: { table: { category: 'Events' } },
  },
}

export default meta
type Story = StoryObj<typeof ConfirmDialog>

export const DangerDelete: Story = {
  args: {
    title: 'Supprimer ce fichier ?',
    description: 'Cette action est définitive et ne peut pas être annulée.',
    variant: 'danger',
    confirmLabel: 'Supprimer',
  },
  render: (args) => {
    const [open, setOpen] = React.useState(false)
    return (
      <ConfirmDialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => setOpen(false)}
        trigger={<Button variant="danger" outline>Supprimer</Button>}
      />
    )
  },
}

export const Warning: Story = {
  args: {
    title: 'Quitter sans sauvegarder ?',
    description: 'Vos modifications seront perdues.',
    variant: 'warning',
    confirmLabel: 'Quitter',
  },
  render: (args) => {
    const [open, setOpen] = React.useState(false)
    return (
      <ConfirmDialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => setOpen(false)}
        trigger={<Button variant="warning" outline>Quitter</Button>}
      />
    )
  },
}

export const ConfirmFiresCallback: Story = {
  args: {
    title: 'Confirm action?',
    description: 'Run the operation now.',
    confirmLabel: 'Run it',
    cancelLabel: 'Cancel',
    variant: 'primary',
    onConfirm: fn(),
  },
  render: (args) => {
    const [open, setOpen] = React.useState(false)
    return (
      <ConfirmDialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        trigger={<Button>Open confirm</Button>}
      />
    )
  },
  play: async ({ args, canvasElement, userEvent, step }) => {
    const canvas = within(canvasElement)
    await step('Open the confirm dialog', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /open confirm/i }))
      await expect(await screen.findByRole('dialog')).toBeVisible()
    })
    await step('Click confirm fires onConfirm', async () => {
      await userEvent.click(screen.getByRole('button', { name: /run it/i }))
      await expect(args.onConfirm).toHaveBeenCalledOnce()
    })
  },
}
