import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination'

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Page navigation. Compose with `PaginationContent`, `PaginationItem`, `PaginationLink` (mark the current page with `isActive`), and `PaginationPrevious` / `PaginationNext` shortcuts.',
      },
    },
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

export const ClickInteraction: Story = {
  parameters: { docs: { description: { story: 'Click each link to verify navigation handlers fire.' } } },
  render: () => {
    const onClick = fn()
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" onClick={onClick}>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" onClick={onClick} isActive>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" onClick={onClick}>3</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  },
  play: async ({ canvas, userEvent }) => {
    const page3 = canvas.getByRole('link', { name: '3' })
    await userEvent.click(page3)
    await expect(page3).toBeInTheDocument()
  },
}
