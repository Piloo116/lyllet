//load CSS related plugins
const postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
cssvars = require('postcss-simple-vars'),
nested = require('postcss-nested'),
cssImport = require('postcss-import');


//load Gulp ... of course
const { src, dest, task, watch, series, parallel } = require('gulp');


//load urls
var jsWatch = './src/js/**/*.js';
var imgWatch = './src/images/**/*.*';
var fontsWatch = './src/fonts/**/*.*';
var htmlWatch = './src/**/*.html';
var stylesWatch = './app/assets/styles/**/*.css';

//functions
function hooray(cb) {
  console.log("Hooray - you created a Gulp task.");
  cb();
};

function html(cb) {
  console.log("Imagine something useful being done to your HTML here.");
cb();
};

function styles() {
	//1. where is my scss file
  return src('./app/assets/styles/styles.css')
    //2. pass that file through the compiler
    .pipe(postcss([cssImport, cssvars, nested, autoprefixer]))
    //3. where do I save the compiled css
    .pipe(dest('./app/temp/styles'));

};

function watch_files() {
  watch(stylesWatch, styles);
};


//Tasks
task("styles", styles);
task("html", html);
task("hooray",hooray);
task("watch",watch_files);

task("default", parallel(styles, html, hooray));
