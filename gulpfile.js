// Include gulp
var gulp = require('gulp'); 


// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var order = require('gulp-order');
var plumber = require('gulp-plumber');
var useref = require('gulp-useref');

var config = require('./gulp.config')();


// Lint Task
    gulp.task('lint', function() {
         return gulp.src(config.clientApp+'**/*.js')
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });


// Concatenate & Minify JS
    gulp.task('scripts', function() {

        return  gulp.src(config.clientApp+'**/*.js') 
            .pipe(order(config.alljs))
            .pipe(concat('all.js'))
            .pipe(gulp.dest('client/dist'))
            .pipe(rename('all.min.js'))
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(gulp.dest(config.client+'dist'));
    });


// Copy files
    gulp.task('copy', function() {

        return gulp
            .src(config.assets, {base: config.client})
            .pipe(gulp.dest(config.dist + '/'));
    });

    gulp.task('optimize', ['sass-min','copy'], function() {

        return gulp
            .src(config.index)
            .pipe(plumber())

            .pipe(useref({ searchPath: [config.client] }))
            .pipe(gulp.dest(config.dist + '/'));
    });


// Watch Files For Changes
    gulp.task('watch', function() {
        gulp.watch(config.clientApp+'**/*.js', ['lint', 'scripts']);
    });



// Default Task
    gulp.task('default', ['lint',  'scripts', 'watch']);