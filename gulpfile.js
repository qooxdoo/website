const { series, parallel } = require("gulp");

const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const path = require("upath");
const fs = require("fs");

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

async function readJsonSafe(filename) {
  let data = null;
  try {
    data = await fs.promises.readFile(filename, "utf8");
  }catch(ex) {
    if (ex.code == "ENOENT")
      return null;
    throw ex;
  }

  try {
    data = data ? JSON.parse(data) : null;
  }catch(ex) {
    console.error(`Cannot parse JSON in ${filename}: ${ex}`);
    return null;
  }
  return data;
}

async function readJson(filename) {
  let data = await fs.promises.readFile(filename, "utf8");
  data = data ? JSON.parse(data) : null;
  return data;
}

async function readFileSafe(filename) {
  try {
    let data = await fs.promises.readFile(filename, "utf8");
    return data || null;
  }catch(ex) {
    console.debug("Cannot read file: " + filename);
    return null;
  }
}

async function statSafe(filename) {
  try {
    return await fs.promises.stat(filename);
  }catch(ex) {
    if (ex.code == "ENOENT")
      return null;
    throw ex;
  }
}

function nunjucksTask(cb) {
  const nunjucksRender = require("gulp-nunjucks-render");
  const data = require('gulp-data');
  
  async function getDataForFile(file) {
    let base = path.relative("src/pages", file.base);
    let name = file.basename.substring(0, file.basename.length - file.extname.length);
    let ext = file.extname;
    
    let stat;
    
    let jsonName = path.join("src/data", base, name + ".json");
    let json = await readJsonSafe(jsonName);
    
    let htmlName = path.join("src/data", base, name + ".html");
    let html = await readJsonSafe(htmlName);
    if (html) {
      if (!json)
        json = {};
      json.body = html;
    }
    
    let dirName = path.join("src/data", base, name);
    stat = await statSafe(dirName);
    if (stat && stat.isDirectory()) {
      let files = await fs.promises.readdir(dirName, { withFileTypes: true });
      if (!json)
        json = {};
      json.items = [];
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (!file.isFile())
          continue;
        let itemExt = path.extname(file.name);
        if (itemExt != ".json")
          continue;
        let itemName = file.name.substring(0, file.name.length - itemExt.length);
        
        let itemJson = await readJsonSafe(path.join(dirName, file.name));
        if (!itemJson) {
          console.error(`Unable to read ${path.join(dirName, file.name)}`);
          continue;
        }
        let itemHtml = await readFileSafe(path.join(dirName, itemName + ".html"));
        if (itemHtml)
          itemJson.body = itemHtml;
        json.items.push(itemJson);
      }
    }
    if (json && json.randomisedItems && json.items) {
      let items = json.items;
      json.items = [];
      while (items.length) {
        let i = Math.floor(Math.random() * items.length);
        let item = items[i];
        items.splice(i, 1);
        json.items.push(item);
      }
    }
    
    return json;
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

function scriptsTask(cb) {
  gulp
    .src("src/js/**")
    .pipe(gulp.dest("html/js/"));
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
  gulp.watch("src/images/**", cb => {
    imagesTask(() => {
      browserSync.reload();
      cb();
    });
  });
  gulp.watch("src/js/**", cb => {
    scriptsTask(() => {
      browserSync.reload();
      cb();
    });
  });
  gulp.watch("src/pages/**/*.html", fn);
  gulp.watch("src/templates/**/*.html", fn);
  gulp.watch("src/css/*css", cb => {
    sassTask(() => {
      browserSync.reload();
      cb();
    });
  });
  cb();
}

// Compile and start project.
exports.default = series(sassTask, vendorScripts, nunjucksTask, imagesTask, scriptsTask);
exports.serve = series(sassTask, vendorScripts, nunjucksTask, imagesTask, scriptsTask, watchTask, 
    function(cb) {
      browserSync.init({
        server: "./html",
        open: false
      }, 
      (err, bs) => {
        bs.addMiddleware("*", (req, res) => {
          let accept = req.headers.accept||"";
          if (accept.match(/text\/html/)) {
            const content_404 = fs.readFileSync("html/404.html");
            res.write(content_404);
            res.end();
          } else {
            res.statusCode = 404;
            res.end();
          }
        });
      });
      cb();
    });




