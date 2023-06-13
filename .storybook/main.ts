import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
const config: StorybookConfig = {
	viteFinal: (config) => {
		return mergeConfig(config, {
			resolve: {
				alias: {
					'react-gantt': '../src/index.tsx',
				},
			},
		})
	},
	stories: ['../**/*.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
}
export default config
