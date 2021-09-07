const { merge } = require('webpack-merge');
const common = require('./common');

/**
 * @type {import('webpack').Configuration}
 */
const config = {
	mode: 'production',
};

module.exports = merge(common, config);
