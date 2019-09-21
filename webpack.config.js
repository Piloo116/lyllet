var path = require('path');

module.export = {
	entry: {
		App: "./app.assets/scripts/App.js",
		Vendor: "./app.assets/scripts/Vendor.js"
	},
	output: {
		path: "./app/temp/scripts",
		filename: "[name].js"
	},
	module: {
		loaders: [
		{
			loader:'babel-loader',
			query: {
				preset: ['es2015']
			},
			test: /\.js$/,
			exclude: /node_modules/
		}]
	}
}
//es7 2016
