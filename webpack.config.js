'use strict';

const path = require('path');

module.exports = {
	cache: true,
	entry: path.resolve(__dirname, './src/main.js'),
	output: {
		filename: 'bundle.js'
	},
	devtool: 'inline-source-map',
	watch: false,
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000
	},
	devServer: {
		contentBase: __dirname,
		compress: true,
		port: 9000,
		historyApiFallback: true
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: 'pug-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
					options: {
						babelrc: false,       // брать настройки из options
						cacheDirectory: true, // включить кширование (node_modules/.cache/babel-loader)
						presets: [
							[
								'env',
								{
									targets: {
										browsers: ['last 2 versions'],
										chrome: 49,
										safari: 9,
									},
									debug: true
								}
							]
						]
					},
				}],
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	}
};
