const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const path = require('path');
const less = require('gulp-less');
const markdown = require('gulp-markdown');
const fs = require('fs')
const each = require('gulp-each');
const replace = require('gulp-replace');
const rename = require('gulp-rename');

gulp.task('gulp_nodemon', function ()
{
  nodemon({
    script: './server.js', //this is where my express server is
    ext: 'js html css less md', //nodemon watches *.js, *.html and *.css files
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('sync', function ()
{
  browserSync.init({
    port: 3261, //this can be any port, it will show our app
    proxy: 'http://localhost:3260/', //this is the port where express server works
    ui: { port: 3003 }, //UI, can be any port
    reloadDelay: 1000 //Important, otherwise syncing will not work
  });

  gulp.watch(['./**/*.js', './**/*.html', './**/*.css']).on("change", browserSync.reload);
});

gulp.task('generate-posts-1', function ()
{
  return gulp.src('./src/blog/posts/**/*.md')
    .pipe(markdown())
    .pipe(gulp.dest('dist/blog/'))
})

gulp.task('generate-posts-2', function ()
{
  const testReg = new RegExp(/<h1 id="[\w|-]+">[\w|\s]+<\/h1>/)

  return gulp.src('./dist/blog/**/*.html')
    .pipe(each(function (content, file, callback)
    {
      const titleTag = testReg.exec(content)[0]
      const title = titleTag.replace(/<h1 id="[\w|-]+">/, "").replace(/<\/h1>/, "").trim()

      fs.unlinkSync(file.path)

      console.log(file.path)

      gulp
        .src(`${__dirname}/src/boilerplate.html`)
        .pipe(replace('{{BLOGTITLE}}', title))
        .pipe(replace('{{POSTCONTENT}}', content))
        .pipe(rename(`.${/\/blog\/.+\.html$/.exec(file.path)[0]}`))
        .pipe(gulp.dest("./dist"))
    }))
})

gulp.task('generate-posts', gulp.series(['generate-posts-1', 'generate-posts-2']))

gulp.task('less', function ()
{
  return gulp.src(['./src/**/*.less'])
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest('./src/assets/css'));
});

gulp.task('watch-less', function ()
{
  return gulp.watch('./src/**/*.less', gulp.series(['less']));  // Watch all the .less files, then run the less task
});

gulp.task('watch-md', function ()
{
  return gulp.watch('./src/blog/posts/**/*.md', gulp.series(['generate-posts']));  // Watch all the .less files, then run the less task
});

gulp.task('watch', gulp.parallel('watch-less', 'watch-md'));

gulp.task('default', gulp.parallel('gulp_nodemon', 'watch', 'sync'));