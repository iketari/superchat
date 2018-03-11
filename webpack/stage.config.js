const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
    plugins: [
        new webpack.NormalModuleReplacementPlugin(
            /\/config\.development\.js/,
            './config.stage.js'
        )
    ]
});