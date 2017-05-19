var webpack = require('webpack');
var path = require('path');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlStringReplacePlugin = require('html-string-replace-webpack-plugin');

var domain = 'http://182.254.129.209:8080';
var bigVersion = '1.0';
var publicResourcePath = 'http://182.254.129.209:8080/plant_web';
var publicImagePath = 'http://182.254.129.209:8080/images';

var imageLoaders = ['file?name=/img/[name].[ext]'];

module.exports = {
	entry: {
		'map': './src/web/js/entry/map.js',
		'index': './src/web/js/entry/index.js'
	},
	output: {
		path: './build/web/' + bigVersion,
		filename: 'js/[name].js',
		publicPath: publicResourcePath
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
			},
			{
				test: /\.(jpe?g|png|gif|svg|jpg)$/i,
				loaders: imageLoaders
			},
			{
				test: /\.js$/,
				loader: 'string-replace',
				query: {
					multiple: [
						{search: '{%domain}', replace: domain, flags: 'g'},
						{search: '{%resource}', replace: publicResourcePath, flags: 'g'}
					]
				}
			},
			{
				test: /\.xtpl$/,
				loader: "xtpl"
			}
		]
	},
	// 插件项
    plugins : [
        new webpack.ProvidePlugin({ // 将$/jQuery变量指向jquery，用于加载第三方模块
	    	$: 'jquery',
	    	jQuery: 'jquery'
	    }),
	    new CopyWebpackPlugin([
			{context: 'src/server', from: '!(node_modules)/**', to: path.join(__dirname, 'build/server/bin/'), dot: true},
			{context: 'src/server', from: '*.*', to: path.join(__dirname, 'build/server/bin/')},
			{context: 'src/web/tpl/widget', from: '*.*', to: path.join(__dirname, 'build/server/bin/public/tpl/widget')},
		]),
        new HtmlWebpackPlugin({
			template: 'src/web/tpl/map.html',
			chunks: ['map'],
			filename: path.join(__dirname, 'build/server/bin/public/tpl/map.xtpl'),	// tpl ext must be .xtpl
			inject: false
		}),
		new HtmlWebpackPlugin({
			template: 'src/web/tpl/index.html',
			chunks: ['index'],
			filename: path.join(__dirname, 'build/server/bin/public/tpl/index.xtpl'),	// tpl ext must be .xtpl
			inject: false
		}),
        new ExtractTextPlugin('css/[name].css'),
        new HtmlStringReplacePlugin({
			enable: true,
			patterns: [
				{
					match: /\{%domain\}/g,
					replacement: domain
				},
				{
					match: /\{%resource\}/g,
					replacement: publicResourcePath
				},
				{
					match: /\{%image\}/g,
					replacement: publicImagePath
				}
			]
		})
    ]	
}