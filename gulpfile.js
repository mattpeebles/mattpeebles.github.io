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
const clean = require('gulp-clean');
const through = require('through2')

gulp.task('clean:dist', async function (done)
{
  return gulp.src('./dist', {allowEmpty: true}).pipe(clean())
});

gulp.task('clean:tmp', async function(done){
  return gulp.src('./tmp', {allowEmpty: true}).pipe(clean());
});

gulp.task('clean', gulp.series(['clean:dist', 'clean:tmp']));

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

gulp.task('compile-md', function (done)
{
  return gulp.src('./src/blog/posts/**/*.md')
    .pipe(markdown())
    .pipe(gulp.dest('./tmp/blog/'));
})

gulp.task('generate-posts', gulp.series('compile-md', function (done)
{
  const testReg = new RegExp(/<h1 id="[\w|-]+">[\w|\s]+<\/h1>/)
  const boiler = fs.readFileSync(`${__dirname}/src/boilerplate.html`).toString();

  let postTitle;
  let content;

  return gulp.src(['./tmp/blog/**/*.html'])
    .pipe(through.obj((file, enc, cb) =>
    {
      content = file.contents.toString();
      const titleTag = testReg.exec(content)[0]
      postTitle = titleTag.replace(/<h1 id="[\w|-]+">/, "").replace(/<\/h1>/, "").trim()
      file.contents = Buffer.from(boiler);
      return cb(null, file);
    }))
    .pipe(replace('{{BLOGTITLE}}', _ => postTitle))
    .pipe(replace('{{POSTCONTENT}}', _ => content))
    .pipe(rename(path => {
      path.basename = path.dirname;
      path.dirname = `blog`;
    }))
    .pipe(gulp.dest("./dist"));
  }, 'clean:tmp'));

gulp.task('less', function ()
{
  return gulp.src(['./src/**/*.less'])
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest('./dist/assets/css'));
});

gulp.task('watch-less', function ()
{
  return gulp.watch('./src/**/*.less', gulp.series(['less']));
});

gulp.task('watch-md', function ()
{
  return gulp.watch('./src/blog/posts/**/*.md', gulp.series(['generate-posts']));  // Watch all the .less files, then run the less task
});

gulp.task('html', function ()
{
  return gulp.src(['./src/**/*.html'])
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch-html', function ()
{
  return gulp.watch('./src/**/*.html', gulp.series(['html']));
});

gulp.task('js', function ()
{
  return gulp.src(['./src/**/*.js'])
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch-js', function ()
{
  return gulp.watch('./src/**/*.js', gulp.series(['js']));
});

gulp.task('watch', gulp.parallel('watch-less', 'watch-md', 'watch-html', 'watch-js'));

gulp.task('build', gulp.series(['clean', 'html', 'js', 'less', () => gulp.src('./src/resources/images/**').pipe(gulp.dest('./dist/resources/images/')), 'generate-posts']))

gulp.task('default', gulp.series(['build', gulp.parallel('gulp_nodemon', 'sync', 'watch')]));