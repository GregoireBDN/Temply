import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable'

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'Layout/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Drag-to-resize panel layouts powered by `react-resizable-panels`. Compose `ResizablePanelGroup` (direction `horizontal` / `vertical`) with `ResizablePanel`s and `ResizableHandle` separators. Use `withHandle` to show a visible grip.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ResizablePanelGroup>

const Group = ResizablePanelGroup as unknown as React.FC<
  React.ComponentProps<typeof ResizablePanelGroup> & { direction: 'horizontal' | 'vertical' }
>

export const Horizontal: Story = {
  render: () => (
    <Group direction="horizontal" className="h-64 w-[600px] rounded-md border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <Group direction="vertical">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </Group>
      </ResizablePanel>
    </Group>
  ),
}
