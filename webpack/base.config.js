'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
    cache: true,
    entry: path.resolve(__dirname, './../src/main.js'),
    output: {
        filename: 'bundle.js'
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
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
            DEBUG: false
        })
    ]
};
