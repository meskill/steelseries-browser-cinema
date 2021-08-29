const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

/**
 * @type {import('webpack').Configuration}
 */
const config = {
	entry: {
		background: './src/background.ts',
		handler: './src/handler.ts',
	},
	output: {
		path: path.resolve(__dirname, '..', '..', '..', 'dist'),
		filename: '[name].js',
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: 'src/manifest.json' }, { from: 'src/readAddress.js' }],
		}),
	],
	module: {
		rules: [
			{
				test: /\.ts(x)?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
};

module.exports = config;
