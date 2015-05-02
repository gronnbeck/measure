var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('gulp-nodemon');

gulp.task('build', function () {
  gulp.src('src/server/index.js')
      .pipe(babel())
      .pipe(gulp.dest('build/server'));
});

gulp.task('service', function () {
  nodemon({
    script: 'build/server/index.js',
    env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('watch', function () {
  gulp.watch(['src/**/*.js', ['build']]);
});

gulp.task('dev', ['build', 'watch', 'service'])
