//load Gulp ... of course
const { src, dest, task, watch, series, parallel } = require('gulp');

//load Watch related plugins
const browserSync = require('browser-sync').create();

//load CSS related plugins
const postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
cssvars = require('postcss-simple-vars'),
nested = require('postcss-nested'),
cssImport = require('postcss-import');


//functions
function styles() {
	//1. where is my scss file
    return src('./app/assets/styles/styles.css')
    //2. pass that file through the compiler
    .pipe(postcss([cssImport, cssvars, nested, autoprefixer]))
    //3. keep the compiler running even if an error occures but display the error
    .on('error', function(errorInfo) {
      console.log(errorInfo.toString());
      this.emit('end');
    })
    //4. where do I save the compiled css
    .pipe(dest('./app/temp/styles'))
    .pipe(browserSync.stream());
};


function watch_files() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "app"
    }
  });
  watch('./app/assets/styles/**/*.css',styles);
  watch('./app/index.html').on('change', browserSync.reload);
};


exports.styles = styles;
exports.watch_files = watch_files;