import '../index.css'

import { setDefaultOptions } from 'date-fns'
import { he } from 'date-fns/locale'

setDefaultOptions({ locale: he })

import { Meta, StoryObj } from '@storybook/react'
import BasicGantt from '.'

const meta: Meta<typeof BasicGantt> = {
	title: 'Gantt',
	tags: ['autodocs'],
	argTypes: {
		itemCount: { description: 'Number of items to generate', defaultValue: 1 },
		backgroundItemCount: {
			description: 'Number of background items to generate',
			defaultValue: 1,
			type: 'number',
		},
		disabledItemCount: {
			description: 'Number of disabled items to generate',
			defaultValue: 1,
			type: 'number',
		},
		rowCount: { description: 'Number of rows to generate', defaultValue: 1 },
		disabledRowCount: {
			description: 'Number of disabled rows to generate',
			defaultValue: 1,
			type: 'number',
		},
		generateDroppableMap: {
			description: 'Generate a droppable map?',
			defaultValue: false,
			type: 'boolean',
		},
	},
	component: BasicGantt,
}

export default meta

type Story = StoryObj<typeof BasicGantt>

export const StackedItems: Story = {
	args: {
		itemCount: 2,
		rowCount: 2,
	},
}

export const BackgroundItems: Story = {
	args: {
		rowCount: 2,
		backgroundItemCount: 2,
	},
}

export const DisabledRows: Story = {
	args: {
		rowCount: 3,
		disabledRowCount: 2,
		itemCount: 4,
	},
}

export const DisabledRowsPerItem: Story = {
	args: {
		rowCount: 5,
		itemCount: 4,
		generateDroppableMap: true,
	},
}
