var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/app/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: [
        'webpack-dev-server/client?https://0.0.0.0:8080',
        'webpack/hot/only-dev-server',
        './app/index.js'
    ],
    output: {
        path: __dirname +'/dist',
        // FileName for the entry point
        filename: 'js/[name].[hash].js',
        // Fine name for non-entry points
        chunkFilename: 'js/[name].[hash].js',
        // File name for the sourcemaps
        sourceMapFilename: "[name].[hash].map.js",
    },
    module:{
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader:'babel-loader'
            },
            {
                test: /\.(scss|css)$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
            }
        ]
    },
    resolve: {
        extensions: ['','.js','.jsx']
    },
    plugins: [
        HtmlWebpackPluginConfig,
        new webpack.HotModuleReplacementPlugin(),
        // Extract css files to .css
        new ExtractTextPlugin('[name].[hash].css', {allChunks: true})
    ]
}
