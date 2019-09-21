var path = require('path');

module.export = {
	entry: "./app.assets/scripts/App.js",
	output: {
		path: path.resolve(__dirname, "./app/temp/scripts"),
		filename: "App.js"
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
