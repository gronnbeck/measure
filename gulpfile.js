var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var reactify = require("reactify");
var babelify = require('babelify');
var source = require('vinyl-source-stream');

var errorHandler = function(error) {
    console.log('Error!');
    throw error;
}

gulp.task('build', function () {
  gulp.src('src/server/index.js')
      .pipe(babel())
      .pipe(gulp.dest('build/server'));
});

gulp.task('frontend', function () {
  var options = {
      debug: process.env.NODE_ENV == 'development'
  };

  var b = browserify(options);
  b.transform(babelify);
  b.add('./src/app/index.js');

  b.bundle()
      .on('error', errorHandler)
      .pipe(source('index.bundle.js'))
      .pipe(gulp.dest('build/app'));
});

gulp.task('service', function () {
  nodemon({
    script: 'build/server/index.js',
    env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('watch', function () {
  gulp.watch(['src/server/**/*.js'], ['build']);
  gulp.watch(['src/app/**/*.js'], ['frontend']);
});

gulp.task('dev', ['build', 'frontend', 'watch', 'service'])
