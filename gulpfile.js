// developper dans app/assets ; fusionner dans app/temp ; reduire dans docs (for github) ou dist

//load Gulp ... of course
const { src, dest, task, watch, series, parallel, start } = require('gulp');

//load Watch related plugins
const browserSync = require('browser-sync').create();

//load CSS related plugins
const postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
cssvars = require('postcss-simple-vars'),
nested = require('postcss-nested'),
cssImport = require('postcss-import'),
mixins = require('postcss-mixins'),
imagemin = require('gulp-imagemin'),
usemin = require('gulp-usemin'),
rev = require('gulp-rev'),
cssnano = require('gulp-cssnano'),
uglify = require('gulp-uglify');

//load Sprite related plugins
const svgSprite = require('gulp-svg-sprite'),
rename = require('gulp-rename'),
del = require('del'),
svg2png = require('gulp-svg2png');

const config = {
    shape: {
        spacing: {
            padding: 1
        }
    },
    mode: {
        css:{ 
            variables: {
                replaceSvgWithPng: function() {
                    return function(sprite, render) {
                        return render(sprite).split('.svg').join('.png');
                    }
                }
            },
            sprite: 'sprite.svg',
            render: {
                css:{
                    template:'./gulp/templates/sprite.css'
                }
            }
        }
    }
};

//load webpack related plugins
const webpack = require('webpack');

//load modernizr
const modernizr = require('gulp-modernizr');


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
  watch('./app/assets/scripts/**/*.js', series(modern, scripts, browserSync.reload));
};


function createSprite() {
    return src('./app/assets/images/icons/**/*.svg')
    .pipe(svgSprite(config))
    .pipe(dest('./app/temp/sprite/'));
};

function createPngCopy() {
    return src('./app/temp/sprite/css/*.svg')
    .pipe(svg2png())
    .pipe(dest('./app/temp/sprite/css'));
};

function copySpriteCSS() {
    return src('./app/temp/sprite/css/*.css')
    .pipe(rename('_sprite.css'))
    .pipe(dest('./app/assets/styles/modules'));
};

function copySpriteGraphic() {
    return src('./app/temp/sprite/css/**/*.{svg,png}')
    .pipe(dest('./app/assets/images/sprites'));
};

function beginClean() {
    return del(['./app/temp/sprite', './app/assets/images/sprites']);
};

function endClean() {
    return del('./app/temp/sprite');
};

//le lien ne marche pas
function scripts(cb) {
    webpack(require('./webpack.config.js'), function(err, stats) {
        if (err) {
            console.log(err.toString());
        }
        console.log(stats.toString);
        cb();
    });
};

function modern() {
    return src(['./app/assets/styles/**/*.css', './app/assets/scripts/**/*.js'])
    .pipe(modernizr({
        "options": [
            "setClasses"
        ]
    }))
    .pipe(dest('./app/temp/scripts/'));
};

function deleteDistFolder() {
    return del("./docs");
};

function copyGeneralFiles () {
    var pathsToCopy = [
    './app/**/*',
    '!./app/index.html',
    '!./app/assets/images/**',
    '!./app/assets/styles/**',
    '!./app/assets/scripts/**',
    '!./app/temp',
    '!./app/temp/**'
    ]
    return src(pathsToCopy)
    .pipe(dest("./docs"));
};

//ne marche pas
function optimizeImages() {
    return src(['./app/assets/images/**/*', '!./app/assets/images/icons', '!.app/assets/images/icons/**/*'])
    .pipe(imagemin({
        progressive: true,
        interlaced: true,
        multipass:true
    }))
    .pipe(dest("./docs/assets/images"));
};

function previewDist() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "docs"
    }
  });
};


function useminBuild() {
    return src("./app/index.html")
    .pipe(usemin({
        css: [function() {return rev()}, function() {return cssnano()}],
        js: [function() {return rev()}, function() {return uglify()}]
    }))
    .pipe(dest("./docs"));
};

exports.styles = styles; // Plugin de mise en forme css (inclu dans watch)
exports.watch = watch_files; // ACTION 1: "gulp watch" Surveille html, css, js
exports.createSprite = createSprite; // Transforme les multiples svg en 1 fichier unique (inclu dans icons)
exports.copySpriteCSS = copySpriteCSS; // Creer le css pour lire le fichier sprite unique (inclu dans icons)
exports.icons = series(beginClean, createSprite, createPngCopy, copySpriteGraphic, copySpriteCSS, endClean); // ACTION 2: "gulp icons" Met à jour le sprite (inclu dans build)
exports.scripts = scripts; // fusionne les fichiers js en 1 fichier unique (inclu dans watch)
exports.modernizr = modern; // permet la creation de class en js (inclu dans watch)
exports.build = series(deleteDistFolder, styles, scripts, copyGeneralFiles, series(beginClean, createSprite, createPngCopy, copySpriteGraphic, copySpriteCSS, endClean), optimizeImages, useminBuild); // ACTION 3: "gulp build" creer la version final dans dist ou docs
exports.previewDist = previewDist; // affiche la version finale

//dist = docs on github