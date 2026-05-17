import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLarge,
  TypographyLead,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from './typography'

const meta: Meta = {
  title: 'Typography',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Semantic typography primitives — headings, body, lead, blockquote, inline code, large/small/muted helpers. Use them to keep the type scale consistent across the app.',
      },
    },
  },
}

export default meta
type Story = StoryObj

export const AllVariants: Story = {
  parameters: { docs: { description: { story: 'Every typography primitive at a glance.' } } },
  render: () => (
    <div className="max-w-prose space-y-4">
      <TypographyH1>Heading 1</TypographyH1>
      <TypographyH2>Heading 2</TypographyH2>
      <TypographyH3>Heading 3</TypographyH3>
      <TypographyH4>Heading 4</TypographyH4>
      <TypographyLead>This is a lead paragraph, used for introductions.</TypographyLead>
      <TypographyP>
        This is a regular paragraph with{' '}
        <TypographyInlineCode>inline code</TypographyInlineCode> inside it.
      </TypographyP>
      <TypographyLarge>Large text for emphasis</TypographyLarge>
      <TypographySmall>Small text for captions</TypographySmall>
      <TypographyMuted>Muted text for secondary info</TypographyMuted>
      <TypographyBlockquote>This is a blockquote for quoted content.</TypographyBlockquote>
    </div>
  ),
}

export const Headings: Story = {
  render: () => (
    <div className="space-y-2">
      <TypographyH1>Heading 1</TypographyH1>
      <TypographyH2>Heading 2</TypographyH2>
      <TypographyH3>Heading 3</TypographyH3>
      <TypographyH4>Heading 4</TypographyH4>
    </div>
  ),
}

export const Body: Story = {
  render: () => (
    <div className="max-w-prose space-y-2">
      <TypographyLead>Lead paragraph for intros.</TypographyLead>
      <TypographyP>A regular paragraph. Lorem ipsum dolor sit amet.</TypographyP>
      <TypographyMuted>Muted secondary text.</TypographyMuted>
    </div>
  ),
}
