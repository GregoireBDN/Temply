import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, within } from 'storybook/test'

import { Button } from './button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Floating hint shown on hover or focus. Built on Radix `Tooltip`. Always wrap your app (or the story) in a single `TooltipProvider`.',
      },
    },
  },
  decorators: [(Story) => <TooltipProvider><Story /></TooltipProvider>],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Sides: Story = {
  parameters: { docs: { description: { story: 'Place the tooltip on `top`, `bottom`, `left`, or `right`.' } } },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button outline>Hover me (top)</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button outline>Hover me (bottom)</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button outline>Hover me (right)</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}

export const FocusOpensTooltip: Story = {
  render: () => (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button outline>Focus me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Tooltip content</p>
      </TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement, userEvent, step }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /focus me/i })
    await step('Tab focuses trigger and shows tooltip', async () => {
      trigger.focus()
      await userEvent.tab()
      trigger.focus()
      const tooltip = await screen.findAllByText(/tooltip content/i)
      await expect(tooltip[0]).toBeVisible()
    })
  },
}
