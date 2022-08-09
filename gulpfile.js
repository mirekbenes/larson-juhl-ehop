"use strict";

/*////////////////////////////////////////
    Load plugins
/////////////////////////////////////////*/
const async = require("async");
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cp = require("child_process");
const twig = require("gulp-twig");
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const consolidate = require("gulp-consolidate")
const iconfont = require("gulp-iconfont");
const concat = require("gulp-concat");
const uglify = require('gulp-uglify-es').default;
const copy = require("gulp-copy");


/*////////////////////////////////////////
    Borwsersync
/////////////////////////////////////////*/
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

/*////////////////////////////////////////
    HTML
/////////////////////////////////////////*/
function html() {
    return gulp
    .src("./source/twig/*.twig")
    .pipe(twig())
    .pipe(gulp.dest("./dist"))
    .pipe(browsersync.stream());
}

/*////////////////////////////////////////
    Styles
/////////////////////////////////////////*/
function styles() {
    return gulp
    .src("./source/styles/czstore.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(postcss([ autoprefixer("last 4 versions") , cssnano() ]))
    .pipe(gulp.dest("./dist/css/"))
    .pipe(browsersync.stream());
}

function stylesMaps() {
    return gulp
        .src("./source/styles/czstore.scss")
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(postcss([ autoprefixer("last 4 versions") , cssnano() ]))
        .pipe(rename({ suffix: ".maps" }))
        .pipe(sourcemaps.write("source-maps"))
        .pipe(gulp.dest("./dist/css/"))
        .pipe(browsersync.stream());
}

/*////////////////////////////////////////
    Images
/////////////////////////////////////////*/
function images() {
    return gulp
    .src("./source/images/**/*")
    .pipe(newer("./dist/images"))
    .pipe(
        imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [{
                    removeViewBox: false,
                    collapseGroups: true
                }]
            })
        ])
    )
    .pipe(gulp.dest("./dist/images"))
    .pipe(browsersync.stream());
}

/*////////////////////////////////////////
    Iconsfont
/////////////////////////////////////////*/
function iconFonts() {
    var iconStream = gulp.src(["./source/font-icons/*.svg"])

    return gulp
    .src("./source/font-icons/*.svg")
    .pipe(iconfont({
        fontName: "icons",
        formats: ["ttf", "eot", "woff", "woff2"], // Possible values ["svg", "ttf", "eot", "woff", "woff2"]
        fontHeight: 1001, //(>= 1000)
        normalize: true
    }))
    .on("glyphs", function(glyphs, options) {
        console.log(glyphs, options)
        gulp.src("source/styles/core/icon-fonts.scss")
        .pipe(consolidate("lodash", {
            glyphs: glyphs,
            fontName: "icons",
            fontPath: "../fonts/",
            className: "icon--"
        }))
        .pipe(gulp.dest("./source/styles/base/"))
    })
    .pipe(gulp.dest("./dist/fonts/"))
    .pipe(browsersync.stream());
}

/*////////////////////////////////////////
    Scripts
/////////////////////////////////////////*/
function scripts() {
    return gulp
    .src(["./source/js/_vendor-plugin/*.js", "./source/js/custom/*.js", "./source/js/init/*.js"])
    .pipe(concat("custom.js"))
    .pipe(gulp.dest("./dist/js"))
    .pipe(rename({suffix: ".min"}))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/js"))
    .pipe(browsersync.stream());
}

/*////////////////////////////////////////
    Copy Scripts
/////////////////////////////////////////*/
function copyScripts() {
    return gulp
    .src("./source/js-copy/*")
    .pipe(gulp.dest("./dist/js"))
    .pipe(browsersync.stream());
}

/*////////////////////////////////////////
    Copy fonts
/////////////////////////////////////////*/
function copyFonts() {
    return gulp
    .src("./source/fonts/*")
    .pipe(gulp.dest("./dist/fonts"))
    .pipe(browsersync.stream());
}

/*////////////////////////////////////////
    Process
/////////////////////////////////////////*/

// Watch files
function watchFiles() {
    gulp.watch("./source/twig/**/*", html);
    gulp.watch("./source/styles/**/*", gulp.series(styles, stylesMaps ));
    gulp.watch("./source/images/**/*", images);
    gulp.watch("./source/font-icons/*.svg", iconFonts);
    gulp.watch("./source/js/**/*.js", scripts);
    gulp.watch("./source/js-copy/*.js", copyScripts);
    gulp.watch("./source/fonts/*", copyFonts);
}

const watch = gulp.parallel(watchFiles, browserSync);
const build = gulp.series(html, styles, stylesMaps, images, iconFonts, scripts, copyScripts, copyFonts);

// export tasks
exports.watch = watch;
exports.build = build;
