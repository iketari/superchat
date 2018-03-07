const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./base.config.js');
const path = require('path');


module.exports = merge(baseConfig, {
    devtool: 'eval-source-map',

    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    devServer: {
        contentBase: path.resolve(__dirname, './..'),
        compress: true,
        port: 9000,
        historyApiFallback: true
    },
    plugins: []
});