import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Checkbox } from './checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from './field'
import { Input } from './input'
import { Switch } from './switch'

const meta = {
  title: 'Forms/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Form layout primitives. `FieldSet` + `FieldLegend` + `FieldGroup` group related inputs; `Field` wraps an input with its `FieldLabel`, `FieldDescription`, and `FieldError`. The `orientation` prop on `Field` flips between vertical, horizontal, and responsive layouts.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal', 'responsive'],
      description: 'Layout of label vs. control.',
      table: { category: 'Layout', defaultValue: { summary: 'vertical' } },
    },
  },
  args: { orientation: 'vertical' },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <Field {...args} className="w-96">
      <FieldLabel htmlFor="pg-input">Display name</FieldLabel>
      <Input id="pg-input" placeholder="Jane" />
      <FieldDescription>Shown on your public profile.</FieldDescription>
    </Field>
  ),
}

export const FormLayout: Story = {
  parameters: { docs: { description: { story: 'Full form pattern with legend, description, and an error.' } } },
  render: () => (
    <FieldSet className="w-96">
      <FieldLegend>Account Information</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fname">First Name</FieldLabel>
          <Input id="fname" placeholder="John" />
        </Field>
        <Field>
          <FieldLabel htmlFor="femail">Email</FieldLabel>
          <FieldDescription>We&apos;ll never share your email.</FieldDescription>
          <Input id="femail" type="email" placeholder="john@example.com" />
        </Field>
        <Field>
          <FieldLabel htmlFor="ferror">With Error</FieldLabel>
          <Input id="ferror" aria-invalid="true" defaultValue="bad" />
          <FieldError>This field is required.</FieldError>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}

export const Horizontal: Story = {
  parameters: { docs: { description: { story: 'Horizontal layout — checkbox / switch alongside the label.' } } },
  render: () => (
    <FieldGroup className="w-96">
      <Field orientation="horizontal">
        <Checkbox id="hcheck" />
        <FieldLabel htmlFor="hcheck">I agree to the terms of service</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch id="hswitch" />
        <FieldLabel htmlFor="hswitch">Enable notifications</FieldLabel>
      </Field>
    </FieldGroup>
  ),
}

export const ErrorRendersMessage: Story = {
  parameters: { docs: { description: { story: 'FieldError displays the first message of the `errors` array.' } } },
  render: () => (
    <Field className="w-72">
      <FieldLabel htmlFor="err">Username</FieldLabel>
      <Input id="err" aria-invalid="true" defaultValue="" />
      <FieldError errors={[{ message: 'Username is required.' }]} />
    </Field>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/username is required/i)).toBeVisible()
  },
}
