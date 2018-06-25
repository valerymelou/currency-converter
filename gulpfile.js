// Load Gulp, its plugins and other NodeJS utilities

var gulp = require('gulp');

var cssnano = require('gulp-cssnano');
var plumber = require( 'gulp-plumber' );
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var sourcemaps = require( 'gulp-sourcemaps' );
var autoprefixer = require('autoprefixer');
var babelify = require( 'babelify' );
var browserify = require( 'browserify' );
var source = require( 'vinyl-source-stream' );
var buffer = require( 'vinyl-buffer' );
var browserSync = require( 'browser-sync' ).create();
var reload = browserSync.reload;
var del = require('del');
var runSequence = require('run-sequence');

var getPathsConfig = function getPathsConfig() {
  this.app = './src';

  return {
    scss: `${this.app}/scss`,
    scripts: `${this.app}/scripts`,
    misc: `${this.app}/**/*.{html,ico,png}`,
    dist: './www'
  }
};

var paths = getPathsConfig();

// Compiles SCSS to CSS
gulp.task('scss', function() {
  return gulp.src(paths.scss + '/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(plumber())  // Check for errors
      .pipe(postcss([
          autoprefixer,
      ]))
      .pipe(cssnano())  // Minify the result
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.dist + '/css'));
});

// JavaScript
gulp.task('scripts', function() {
  var bundler = browserify(paths.scripts + '/app.js', {
    debug: true,
  }).transform(babelify, {presets: ["@babel/preset-env"]})

  return bundler.bundle()
    .on('error', function(error) {
      console.log(error.message);
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist + '/js'));;
});

// Copy miscellaneous files to the dist folder
gulp.task('copy', function() {
  return gulp.src(paths.misc).pipe(gulp.dest(paths.dist));
});

// Clean the dist folder
gulp.task('clean', function(done) {
  del([paths.dist + '/**/*']).then(function() {
    done();
  });
});

// Serve files
gulp.task('serve', function() {
  browserSync.init({
    files: [paths.dist + '/**/*'],
    server: {
      baseDir: paths.dist
    }
  });
});

// Build files
gulp.task('build', function() {
  runSequence('clean', ['copy'], ['scss', 'scripts']);
});

// Watch files for changes
gulp.task('watch', function() {
  gulp.watch(paths.scss + '/**/*.scss', ['scss']);
  gulp.watch(paths.scripts + '/**/*.js', ['scripts']);
  gulp.watch(paths.misc, ['copy']);
});

// Default task
gulp.task('default', function() {
  runSequence('clean', ['copy'], ['scss', 'scripts'], ['serve', 'watch']);
});
