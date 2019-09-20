//load Gulp ... of course
const { src, dest, task, watch, series, parallel } = require('gulp');

//load Watch related plugins
const browserSync = require('browser-sync').create();

//load CSS related plugins
const postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
cssvars = require('postcss-simple-vars'),
nested = require('postcss-nested'),
cssImport = require('postcss-import'),
mixins = require('postcss-mixins');

//load Sprite related plugins
const svgSprite = require('gulp-svg-sprite'),
rename = require('gulp-rename'),
del = require('del');

const config = {
    mode: {
        css:{ 
            sprite: 'sprite.svg',
            render: {
                css:{
                    template:'./gulp/templates/sprite.css'
                }
            }
        }
    }
};

//Load webpack related plugins
const webpack = require('webpack');



//functions
function styles() {
	//1. where is my scss file
    return src('./app/assets/styles/styles.css')
    //2. pass that file through the compiler
    .pipe(postcss([cssImport, mixins, cssvars, nested, autoprefixer]))
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
  watch('./app/assets/scripts/**/*.js', series(scripts, browserSync.reload));
};


function createSprite() {
    return src('./app/assets/images/icons/**/*.svg')
    .pipe(svgSprite(config))
    .pipe(dest('./app/temp/sprite/'));
};

function copySpriteCSS() {
    return src('./app/temp/sprite/css/*.css')
    .pipe(rename('_sprite.css'))
    .pipe(dest('./app/assets/styles/modules'));
};

function copySpriteGraphic() {
    return src('./app/temp/sprite/css/**/*.svg')
    .pipe(dest('./app/assets/images/sprites'));
};

function beginClean() {
    return del(['./app/temp/sprite', './app/assets/images/sprites']);
};

function endClean() {
    return del('./app/temp/sprite');
};

//le lien webpack.config.js ne fonctionne pas
function scripts(callback) {
    webpack(require('../../webpack.config.js'), function(err, stats) {
        if (err) {
            console.log(err.toString());
        }
        console.log(stats.toString);
        callback();
    });
};


exports.styles = styles;
exports.watch = watch_files;
exports.createSprite = createSprite;
exports.copySpriteCSS = copySpriteCSS;
exports.icons = series(beginClean, createSprite, copySpriteGraphic, copySpriteCSS, endClean);
exports.scripts = scripts;