import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, within } from 'storybook/test'
import { toast } from 'sonner'

import { Button } from './button'
import { Toaster } from './sonner'

const meta = {
  title: 'Feedback/Toast (Sonner)',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Toast notifications powered by [sonner](https://sonner.emilkowal.ski). Mount a single `<Toaster />` at the root, then call `toast()`, `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`, or `toast.promise()` from anywhere.',
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast('Event has been created', { description: 'Sunday, December 03, 2023 at 9:00 AM' })}>
        Default Toast
      </Button>
      <Button variant="success" onClick={() => toast.success('Operation completed successfully!')}>
        Success Toast
      </Button>
      <Button variant="danger" onClick={() => toast.error('Something went wrong. Please try again.')}>
        Error Toast
      </Button>
      <Button variant="warning" onClick={() => toast.warning('Be careful, this action is irreversible.')}>
        Warning Toast
      </Button>
      <Button variant="info" onClick={() => toast.info('A new version is available.')}>
        Info Toast
      </Button>
      <Button
        variant="secondary"
        outline
        onClick={() => {
          const promise = new Promise((resolve) => setTimeout(resolve, 2000))
          toast.promise(promise, {
            loading: 'Loading data…',
            success: 'Data loaded!',
            error: 'Failed to load.',
          })
        }}
      >
        Promise Toast
      </Button>
    </div>
  ),
}

export const ClickShowsToast: Story = {
  render: () => (
    <Button onClick={() => toast.success('Saved!')}>Trigger toast</Button>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /trigger toast/i }))
    await expect(await screen.findByText(/saved!/i)).toBeVisible()
  },
}
