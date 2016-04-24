/**
 * Demo Gulpfile
 *
 * You can refer to this Gulpfile to learn how to use this repo in your projects.
 * Feel free to copy and paste this file and customize it.
 */

const autoprefixer = require('autoprefixer');
const cssMqpacker = require('css-mqpacker');
const del = require('del');
const gulp = require('gulp');
const gulpCompass = require('gulp-compass');
const gulpConnect = require('gulp-connect');
const gulpJade = require('gulp-jade');
const gulpPostcss = require('gulp-postcss');
const gulpRename = require('gulp-rename');
const gulpReplace = require('gulp-replace');
const rimraf = require('rimraf');
const runSequence = require('run-sequence');

const SOURCE_DIR = './src';
const ASSETS_SRC = [
  `${SOURCE_DIR}/assets/**/*`,
];
const DISTRIBUTION_DIR = './dist';

gulp.task('serve', () => {
  return gulpConnect.server({
    root: './dist',
    fallback: './dist/index.html',
    port: 8000,
    livereload: true,
  });
});

gulp.task('copyAssets', () => {
  return gulp
    .src(`${SOURCE_DIR}/assets/**/*`)
    .pipe(gulp.dest(`${DISTRIBUTION_DIR}/assets`))
    .pipe(gulpConnect.reload());
});

gulp.task('copyJs', () => {
  return gulp
    .src(`${SOURCE_DIR}/index.js`)
    .pipe(gulp.dest(DISTRIBUTION_DIR))
    .pipe(gulpConnect.reload());
});

gulp.task('compileHtml', () => {
  return gulp
    .src(`${SOURCE_DIR}/index.jade`)
    .pipe(gulpJade({
      locals: {
        DATE_TIME: new Date().getTime(),
      },
    }))
    .pipe(gulp.dest(DISTRIBUTION_DIR))
    .pipe(gulpConnect.reload());
});

gulp.task('compileCss', done => {
  runSequence(
    'compileCss:compileScss',
    'compileCss:applyPostCss',
    done
  );
});

// Compile SCSS with Compass.
gulp.task('compileCss:compileScss', () => {
  return gulp
    .src(`${SOURCE_DIR}/index.scss`)
    .pipe(gulpCompass({
      css: DISTRIBUTION_DIR,
      import_path: './node_modules',
      sass: SOURCE_DIR,
    }))
    .on('error', function onCompileScssError() {
      // Continue watching when an error occurs.
      this.emit('end');
    })
    .pipe(gulp.dest(DISTRIBUTION_DIR));
});

// Run compiled CSS through PostCSS with Autoprefixer.
gulp.task('compileCss:applyPostCss', () => {
  return gulp
    .src(`${DISTRIBUTION_DIR}/index.css`)
    .pipe(gulpPostcss([
      autoprefixer({
        browsers: ['last 2 versions'],
      }),
      cssMqpacker,
    ]))
    .on('error', function onPostCssError() {
      // Continue watching when an error occurs.
      this.emit('end');
    })
    .pipe(gulp.dest(DISTRIBUTION_DIR));
});

gulp.task('watch', [
  'serve',
  'copyAssets',
  'copyJs',
  'compileHtml',
  'compileCss',
], () => {
  gulp.watch([`${SOURCE_DIR}/index.jade`], [
    'compileHtml',
  ]);
  gulp.watch([ASSETS_SRC], [
    'copyAssets',
  ]);
  gulp.watch([`${SOURCE_DIR}/**/*.scss`], [
    'compileCss',
  ]);
  gulp.watch([`${SOURCE_DIR}/index.js`], [
    'copyJs',
  ]);
});

gulp.task('default', () => {
  // Clean, then start.
  rimraf(DISTRIBUTION_DIR, () => {
    gulp.start('watch');
  });
});
