const gulp = require('gulp');
const { src, dest, watch, parallel, series } = require('gulp');
// const watch = require('gulp-watch');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();



function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/',

        }
    });
}


function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({ outputStyle: "expanded" }).on('error', scss.logError))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true,
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());

}



function script() {
    return src(['app/js/main.js',
            'node_modules/jquery/dist/jquery.js',
        ])
        .pipe(concat('main.min.js'))
        // .pipe(uglify())
        .pipe(dest('app/js'));
}



function images() {
    return src('app/images/**/*.*')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(gulp.dest('dist/images'));
}

function build() {
    return src([
            'app/index.html',
            'app/css/style.min.css',
            'app/js/main.min.js'
        ], { base: 'app' })
        .pipe(gulp.dest('dist/'));
}

function cleanDist() {
    return del('dist');
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], script);
    watch(['app/**/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.script = script;
exports.watching = watching;
exports.images = images;
exports.browsersync = browsersync;
exports.build = series(cleanDist, images, build);
exports.cleanDist = cleanDist;



exports.default = parallel(styles, script, browsersync, watching);