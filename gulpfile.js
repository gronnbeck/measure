var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('gulp-nodemon');

gulp.task('build', function () {
  gulp.src('src/index.js')
      .pipe(babel())
      .pipe(gulp.dest('build'));
});

gulp.task('service', function () {
  nodemon({
    script: 'build/index.js',
    env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('watch', function () {
  gulp.watch(['src/**/*.js', ['build']]);
});

gulp.task('dev', ['build', 'watch', 'service'])
