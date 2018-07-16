const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PATHS = {
    app: path.join(__dirname, 'apps', 'home', 'source', 'js'),
    app_js: path.join(__dirname, 'apps', 'home', 'source', 'js'),
    build: path.join(__dirname, 'apps', 'home', 'static', 'js')
};

module.exports = {
    devtool: 'source-map',
    entry: {
        app: PATHS.app + 'form'
    },
    output: {
        path: PATHS.build,
        filename: 'index.js'
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx']
    },
    devServer: {
        contentBase: PATHS.build,
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: PATHS.app_js,
                query: {
                    presets: ['react']
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('css/main.css'),
    ]
};


