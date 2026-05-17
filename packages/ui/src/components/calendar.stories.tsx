import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Calendar } from './calendar'

const meta = {
  title: 'Forms/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Date picker built on `react-day-picker`. Supports `single`, `multiple`, and `range` selection modes, plus an optional `dropdown` caption for fast year/month navigation.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['single', 'multiple', 'range'],
      table: { category: 'Behaviour', defaultValue: { summary: 'single' } },
    },
    captionLayout: {
      control: 'inline-radio',
      options: ['label', 'dropdown'],
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const SingleDate: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return <Calendar mode="single" selected={date} onSelect={setDate} />
  },
}

export const WithDropdownNav: Story = {
  parameters: { docs: { description: { story: 'Use `captionLayout="dropdown"` for quick year/month jumps.' } } },
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
      />
    )
  },
}
