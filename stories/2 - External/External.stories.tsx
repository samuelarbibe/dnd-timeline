import '../index.css'

import { he } from 'date-fns/locale'
import { setDefaultOptions } from 'date-fns'

import ExternalWrapper from '.'

setDefaultOptions({ locale: he })

import { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof ExternalWrapper> = {
  title: 'External',
  component: ExternalWrapper,
}

export default meta

type Story = StoryObj<typeof ExternalWrapper>

export const Basic: Story = {
  args: {
    itemCount: 5,
    listItemCount: 5,
    rowCount: 5,
  },
}
