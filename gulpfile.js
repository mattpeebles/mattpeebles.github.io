var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
var path = require('path');
var less = require('gulp-less');


gulp.task('gulp_nodemon', function() {
  nodemon({
    script: './server.js', //this is where my express server is
    ext: 'js html css less', //nodemon watches *.js, *.html and *.css files
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('sync', function() {
    browserSync.init({
        port: 3261, //this can be any port, it will show our app
        proxy: 'http://localhost:3260/', //this is the port where express server works
        ui: { port: 3003 }, //UI, can be any port
        reloadDelay: 1000 //Important, otherwise syncing will not work
    });

  gulp.watch(['./**/*.js', './**/*.html', './**/*.css']).on("change", browserSync.reload);
});

 
gulp.task('less', function () {
  return gulp.src('./*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('watch', function() {
  return gulp.watch('./*.less', gulp.series('less'));  // Watch all the .less files, then run the less task
});

gulp.task('default', gulp.parallel('gulp_nodemon', 'watch', 'sync'));