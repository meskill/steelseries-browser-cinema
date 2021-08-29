const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const common = require('./common');

/**
 * @type {import('webpack').Configuration}
 */
const config = {
	mode: 'production',
	plugins: [new CleanWebpackPlugin()],
};

module.exports = merge(common, config);
