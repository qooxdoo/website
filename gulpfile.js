const { series, parallel } = require("gulp");

const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");

function sassTask(cb) {
  const sass = require("gulp-sass");
  const sourcemaps = require("gulp-sourcemaps");
  
  gulp.src("src/css/style.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./html/css"))
    .pipe(browserSync.stream());
  cb();
}

function nunjucksTask(cb) {
  const nunjucksRender = require("gulp-nunjucks-render");
  const data = require('gulp-data');
  
  function getDataForFile(file) {
    return {
      example: 'data loaded for ' + file.relative
    };
  }  
  gulp
    .src("src/pages/**/*.html")
    .pipe(data(getDataForFile))
    .pipe(nunjucksRender({
      path: ["src/templates"]
    }))
    .pipe(gulp.dest("html"));
  cb();
}

function imagesTask(cb) {
  gulp
    .src("src/images/**")
    .pipe(gulp.dest("html/images/"));
  cb();
}

function vendorScripts(cb) {
  gulp.src([
      "./node_modules/jquery/dist/jquery.min.js"])
    .pipe(gulp.dest("html/js/"));
  cb();
}

// Create a task that ensures the `nunjucks` task is complete before reloading browsers.
function watchTask(cb) {
  let fn = cb => {
    series(nunjucksTask, () => browserSync.reload())();
    cb();
  };
  gulp.watch("src/images/**", imagesTask);
  gulp.watch("src/pages/**/*.html", fn);
  gulp.watch("src/templates/**/*.html", fn);
  gulp.watch("src/css/*css", cb => {
    sassTask();
    browserSync.reload();
    cb();
  });
  cb();
}

// Compile and start project.
exports.default = series(sassTask, vendorScripts, nunjucksTask, imagesTask);
exports.serve = series(sassTask, vendorScripts, nunjucksTask, imagesTask, watchTask, 
    function(cb) {
      browserSync.init({
        server: "./html",
        open: false
      });
      cb();
    });




