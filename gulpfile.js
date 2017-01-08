const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
    return gulp
        .src('app/scss/**/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('app/css'))
        .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
    return gulp
        .src('app/ts/**/*.ts')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.typescript({
            noImplicitAny: true,
            out: 'app.js'
        }))
        .pipe($.uglify()) 
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('app/js'));
});

gulp.task('templates', () => {
    return gulp
        .src('app/views/**/*.pug')
        .pipe($.plumber())
        .pipe($.pug({
            pretty: true
        }))
        .pipe(gulp.dest('app/'))
        .pipe(reload({stream: true}));
});

gulp.task('serve', () => {
    browserSync.init({
        notify: false,
        port: 9000,
        ui: false,
        server: './app'
    });

    gulp.watch('app/scss/**/*.scss', ['styles']);
    gulp.watch('app/views/**/*.pug', ['templates']);
    gulp.watch('app/ts/**/*.ts', ['scripts']);
    gulp.watch(['app/js/*.js', 'app/index.html']).on('change', reload);
});

gulp.task('default', ['serve']);
