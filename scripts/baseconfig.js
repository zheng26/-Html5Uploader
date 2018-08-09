const webpack = require('webpack');
const path = require('path');

const config = {
    context: path.resolve(__dirname, '../'),
    entry: {
        upload: './src/upload.js'
    },
    output: {
        libraryTarget: "umd",
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist')
    },
    resolve: {
        modules: [path.join(__dirname, '../node_modules')]
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: '/node_modules/',
                use: {
                    loader: 'babel-loader?cacheDirectory',
                    options: {
                        presets: ['env'],
                        plugins: ['transform-runtime']
                    }
                }
            }
        ]
    }
};

module.exports = config;