//load Gulp ... of course
const { src, dest, task, watch, series, parallel } = require('gulp');



//load Watch related plugins
browserSync = require('browser-sync').create();



//functions
function watch_files() {
  
  browserSync.init({
    notify: false,
    server: {
      baseDir: "app"
    }
  });

  watch('./app/index.html').on('change', browserSync.reload);
  watch('./app/assets/styles/**/*.css').on('change',styles);
};


function ccsInject(cb) {
  return src('./app/temp/styles/styles.css')
    .pipe(browserSync.stream());
    cb();
};

exports.watch = series(watch_files, ccsInject);